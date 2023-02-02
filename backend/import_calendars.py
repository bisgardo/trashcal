#!/usr/bin/env python

from app import app
from mitaffald_fetch import fetch_calendar_html
from mitaffald_parse import parse_calendar
from db import db, Address, Calendar
from random import shuffle
from time import sleep

year = 2023

with app.app_context():
    try:
        addrs = Address.query.filter(Address.mitaffald_id.isnot(None)).all()
        shuffle(addrs)
        for addr in addrs:
            mitaffald_id = addr.mitaffald_id
            # TODO Use 'resolve_calendar' instead to avoid duplication
            #      and also because it is going to insert NULL on failure.
            res = Calendar.query.filter_by(mitaffald_id=mitaffald_id, year=year).first()
            if res:
                print('skipping', mitaffald_id)
                continue
            print('fetching', mitaffald_id)
            html = fetch_calendar_html(str(mitaffald_id), year)
            calendar, parser_version = parse_calendar(html)
            if calendar:
                db.session.add(
                    Calendar(mitaffald_id=mitaffald_id, year=year, json=calendar, parser_version=parser_version))
                db.session.commit()
    except Exception as e:
        print('encountered error:', e)
        print('restarting in 60s')
        sleep(60)
