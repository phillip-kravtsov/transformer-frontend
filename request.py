from __future__ import absolute_import, print_function
import requests
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--port', '-p', default=4200)
parser.add_argument('--url', '-u', default='http://127.0.0.1')
args = parser.parse_args()

url = '{}:{}/predict'.format(args.url, args.port)
r = requests.post(url, json={'x': "absolute-import"})
print(r.json())
