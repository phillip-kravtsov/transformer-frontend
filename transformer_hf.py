import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
import numpy as np
import torch.nn.functional as F
import time
'''
Method
def inference(phrase, top_k, top_p, length):
    phrase - input string
    top_k - integer of top k values from output logit
    top_p - double of top p (probability) values from output logit
    length = # of next words
'''

# Load pre-trained model tokenizer (vocabulary)
tokenizer = GPT2Tokenizer.from_pretrained('gpt2')

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = GPT2LMHeadModel.from_pretrained('gpt2')
model.eval()
model.half()
model.to(device)

def top_k_top_p_filtering(logits, top_k=0, top_p=0.0, filter_value=-float('Inf')):
    """ Filter a distribution of logits using top-k and/or nucleus (top-p) filtering
    https://gist.github.com/thomwolf/1a5a29f6962089e871b94cbd09daf317
        Args:
            logits: logits distribution shape (..., vocabulary size)
            top_k >0: keep only top k tokens with highest probability (top-k filtering).
            top_p >0.0: keep the top tokens with cumulative probability >= top_p (nucleus filtering).
    """
    top_k = min(top_k, logits.size(-1))  # Safety check
    if top_k > 0:
        # Remove all tokens with a probability less than the last token of the top-k
        indices_to_remove = logits < torch.topk(logits, top_k)[0][..., -1, None]
        logits[indices_to_remove] = filter_value

    if top_p > 0.0:
        sorted_logits, sorted_indices = torch.sort(logits, descending=True)
        cumulative_probs = torch.cumsum(F.softmax(sorted_logits, dim=-1), dim=-1)

        # Remove tokens with cumulative probability above the threshold
        sorted_indices_to_remove = torch.tensor(cumulative_probs >= top_p, dtype=torch.bool).to(device)
        #print(sorted_indices_to_remove.shape)
        # Shift the indices to the right to keep also the first token above the threshold
        sorted_indices_to_remove[..., 1:] = sorted_indices_to_remove[..., :-1].clone()
        sorted_indices_to_remove[..., 0] = 0
        
        #Zeros_like - creates tensor with zeros same length as input
        indices_to_remove = torch.zeros_like(logits, dtype=torch.bool).scatter_(dim=-1, index=sorted_indices, src=sorted_indices_to_remove)
        #indices_to_remove = sorted_indices[sorted_indices_to_remove]
        logits[indices_to_remove] = filter_value
    return logits

def get_log_likelihood(phrase, context='', enc=tokenizer, model=model, logger=None):
    assert len(phrase) > 0, 'nonempty phrase needed'
    tokens = enc.encode(phrase) if phrase else [enc.encoder['<|endoftext|>']]
    len_phrase_tokens = len(tokens)
    context_tokens = enc.encode(context) if context else []
    tokens.extend(context_tokens)

    logger.warning(tokens)
    if len(tokens) > 1024:
        tokens = tokens[:-1024]
    prev = torch.tensor(tokens, device=device, dtype=torch.long).unsqueeze(0).repeat(1,1)
    
    log_likelihood = 0.0
    with torch.no_grad():
        logits, past = model(prev, past=None)
        probs_full = F.softmax(logits, dim=-1)
        for i in range(len(context_tokens) + 1, len_phrase_tokens):
            prob_of_next_token = probs_full[0, i, tokens[i]]
            log_likelihood += np.log(prob_of_next_token.item())
    return float(log_likelihood)

def filter_predictions(predictions, entropies=None):
    out = []
    for pred in predictions:
        words = pred.split(' ')
        words_filtered = []
        for word in words:
            if '!' in word or '?' in word or '<|endoftext|>' in word:
                break
            words_filtered.append(word)
        out.append(' '.join(words_filtered))
    return out
    
def search(phrase, top_p, top_k, timeout, temperature, length, batch_size=1, enc=tokenizer, model=model, logger=None):
    if logger is not None:
        logger.debug('search')
    stop_token = [enc.encoder[x] for x in ('<|endoftext|>', '.', '?', '!')]
    context_tokens = enc.encode(phrase) if phrase else [enc.encoder['<|endoftext|>']]
    context = torch.tensor(context_tokens, device=device, dtype=torch.long).unsqueeze(0).repeat(batch_size, 1)
    prev = context
    output = context
    past = None

    entropies = []
    start_time = time.time()
    count = 0
    times = []
    with torch.no_grad():
        while time.time() < start_time + timeout and count <= length:
            st = time.time()
            logits, past = model(prev, past=past)
            times.append(time.time() - st)
            
            logits = logits[:, -1, :] / temperature
            probs_full = F.softmax(logits, dim=-1)
#            entropy = torch.distributions.Categorical(probs=probs_full).entropy()
#            entropies.append(entropy.numpy())
            logits = top_k_top_p_filtering(logits, top_p=top_p, top_k=top_k)
            probs = F.softmax(logits, dim=-1)
            prev = torch.multinomial(probs, num_samples=1)
            output = torch.cat((output, prev), dim=1)
            count += 1
    out = output[:, len(context_tokens):].tolist()
    out = filter_predictions([enc.decode(out[i]) for i in range(batch_size)])
    return {
        'completion': out[0],
        'all_completions': out,
        'times': times,
#        'entropies': {np.vstack(entropies)}
    }
