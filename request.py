from __future__ import absolute_import, print_function
import requests
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--port', '-p', default=4200)
parser.add_argument('--url', '-u', default='http://127.0.0.1')
args = parser.parse_args()

config = {
    'top_k': 10,
    'top_p': 1,
    'temperature': 1.2,
    'timeout': 2.0,
}
url = '{}:{}/predict'.format(args.url, args.port)
r = requests.post(url, json={'context': "absolute-import",
                             'config': config})
print(r.json())
