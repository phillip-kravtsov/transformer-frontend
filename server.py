from __future__ import absolute_import, print_function
from flask import Flask, request, jsonify, Response
from transformer_hf import search, get_log_likelihood
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def complete(context, config):
    out_dict = search(phrase=context,
                      top_k=int(config['top_k']),
                      top_p=float(config['top_p']),
                      timeout=config['timeout'],
                      temperature=config['temperature'],
                      length=config['length'],
                      batch_size=8,
                      logger=app.logger)
    app.logger.warning(sum(out_dict["times"])/len(out_dict['times']))
    return out_dict

@app.route('/prob', methods=['POST', ])
def prob():
    data = request.get_json(force=True)
    app.logger.debug(data)
    log_likelihood = get_log_likelihood(phrase=data['phrase'], context=data['context'], logger=app.logger)
    app.logger.warning(log_likelihood)
    return jsonify({'log_likelihood': log_likelihood}), 200

@app.route('/predict', methods=['POST', ])
def predict():
    data = request.get_json(force=True)
    app.logger.warning(data)
    comp = complete(data['context'], data['config']) 
    app.logger.warning(comp['completion'])
    jp = jsonify(comp)
    app.logger.warning(jp)
    return jp, 200

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', '-p', type=int, default=4200)
    parser.add_argument('--prod', '-o', action='store_true')
    args = parser.parse_args()
    if args.prod:
        app.run(host='0.0.0.0', port=args.port, debug=True)
    else:
        app.run(port=args.port, debug=True)
