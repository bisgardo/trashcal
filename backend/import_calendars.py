#!/usr/bin/env python

from app import app
from import_ import import_calendar
from db import Address, Calendar

YEAR = 2023

with app.app_context():
    print('loading IDs')
    # Fetch all non-null MitAffald IDs that don't have calendar data.
    q = Address.query.filter(
        Address.mitaffald_id.isnot(None),
        Address.mitaffald_id.not_in(Calendar.query.with_entities(Calendar.mitaffald_id))
    ).with_entities(Address.mitaffald_id)
    print('done loading IDs')
    c = 0
    for (mitaffald_id,) in q:
        id = str(mitaffald_id)
        c += 1
        print(f"#{c}: Attempting to import MitAffald ID '{id}'")
        res = import_calendar(id, YEAR)
        if res:
            print('SUCCESS!')
        else:
            print('failure')
        # break
