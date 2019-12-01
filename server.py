from __future__ import absolute_import, print_function
from flask import Flask, request, jsonify, Response
from transformer_hf import search
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def complete(context, config):
    out_dict = search(phrase=context,
                 top_k=config['top_k'],
                 top_p=config['top_p'],
                 timeout=config['timeout'],
                 temperature=config['temperature'])
#    out = context[::-1]
    return out_dict

@app.route('/predict', methods=['POST', ])
def predict():
    data = request.get_json(force=True)
    app.logger.warning(data)
    comp = complete(data['context'], data['config']) 
    app.logger.warning(comp['completion'])
    jp = jsonify(comp)
    app.logger.warning(jp)
    return jp, 200
    #resp = Response(jp)
    #resp.headers['Access-Control-Allow-Origin'] = '*'
    #return jsonify(resp)

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', '-p', type=int, default=4200)
    args = parser.parse_args()
    app.run(port=args.port, debug=True)
    #app.run(host='0.0.0.0', port=args.port, debug=True)
