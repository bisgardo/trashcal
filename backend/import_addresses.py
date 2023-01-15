#!/usr/bin/env python

from app import app
from resolve import resolve_address

import gzip
from json import load


def load_addrs(path):
    with gzip.open(path) as f:
        return load(f)


addrs = load_addrs('./data/addresses-aarhus.json.gz')

with app.app_context():
    for addr in addrs:
        street_name = addr['vejnavn']
        house_number = addr['husnr']
        postcode = addr['postnr']
        postcode_name = addr['postnrnavn']
        try:
            _, status = resolve_address(street_name, house_number, postcode, postcode_name)
            if status:
                # print('cache hit', flush=True)
                pass
            else:
                print('cache missed', flush=True)
        except Exception as e:
            print('no match for', street_name, house_number, postcode, postcode_name, e)
            pass
