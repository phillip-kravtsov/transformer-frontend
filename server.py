from __future__ import absolute_import, print_function
from flask import Flask, request, jsonify, Response
#from transformer_hf import inference
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def complete(ret_string, size=None, search=None):
    #out = inference(phrase=ret_string, top_k=10, length=10)
    out = ret_string[::-1]
    ret = {'completion': out}
    return ret

@app.route('/predict', methods=['POST', ])
def predict():
    data = request.get_json(force=True)
    app.logger.warning(data)
    prediction = complete(data['x'], data['size'], data['search'])
    app.logger.warning(prediction)
    jp = jsonify(prediction)
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
