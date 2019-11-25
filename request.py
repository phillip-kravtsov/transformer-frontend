from __future__ import absolute_import, print_function
import requests
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--port', '-p', default=4200)
args = parser.parse_args()

url = 'http://127.0.0.1:{}/predict'.format(args.port)
r = requests.post(url, json={'x': "absolute-import"})
print(r.json())
