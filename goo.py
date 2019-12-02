from transformer_hf import get_log_likelihood
from itertools import permutations
from scipy.stats import kendalltau

sentences = [
'''Despite America's beginnings as an isolationist country, the seeds for the Monroe Doctrine were already being laid even during George Washington's presidency.''',
''' According to S.E. Morison, "as early as 1783, then, the United States adopted the policy of isolation and announced its intention to keep out of Europe.''',
'''The supplementary principle of the Monroe Doctrine, that Europe must keep out of America, was still over the horizon.''',
'''While not specifically the Monroe Doctrine, Alexander Hamilton desired to control the sphere of influence in the western hemisphere, particularly in North America but was extended to the Latin American colonies by the Monroe Doctrine.''',
'''But Hamilton, writing in the Federalist Papers, was already wanting to establish America as a world power and hoped that America would suddenly become strong enough to keep the European powers outside of the Americas, despite the fact that the European countries controlled much more of the Americas than the U.S. itself.''',
'''Hamilton expected that the United States would become the dominant power in the new world and would, in the future, act as an intermediary between the European powers and any new countries blossoming near the U.S.''',
]

perms = permutations(list(range(len(sentences))))
ordered = list(range(len(sentences)))

corrs = []
lls = []
for perm in perms:
    sent = [sentences[i] for i in perm]
    phrase = ' '.join(sent)
    corr, p = kendalltau(ordered, perm)
    ll = get_log_likelihood(phrase=phrase, logger=None)
    corrs.append(corr)
    lls.append(ll)

with open('./data.txt', 'w+') as f:
    f.write(str(corrs))
    f.write('\n')
    f.write(str(lls))
print(corrs)
print(lls)
