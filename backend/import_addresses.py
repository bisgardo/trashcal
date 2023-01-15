#!/usr/bin/env python

from app import app
from mitaffald_fetch import fetch_address
from db import lookup_address

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
            _, status = lookup_address(street_name, house_number, postcode,
                                       lambda: fetch_address(street_name, house_number, postcode, postcode_name))
            # if status:
            #     print('cache hit', flush=True)
            # else:
            #     print('cache missed', flush=True)
        except:
            print('no match for', street_name, house_number, postcode, postcode_name)
            pass
