#!/usr/bin/env python

from app import app
from mitaffald_fetch import fetch_calendar_html
from mitaffald_parse import parse_calendar
from db import db, Address, Calendar

year = 2023

with app.app_context():
    addrs = Address.query.filter(Address.mitaffald_id.isnot(None)).all()
    for addr in addrs:
        # print(addr)
        mitaffald_id = addr.mitaffald_id
        print(mitaffald_id)
        res = Calendar.query.filter_by(mitaffald_id=mitaffald_id, year=year).first()
        if res:
            print('skipping', mitaffald_id)
            continue
        html = fetch_calendar_html(str(mitaffald_id), year)
        calendar, parser_version = parse_calendar(html)
        if calendar:
            db.session.add(
                Calendar(mitaffald_id=mitaffald_id, year=year, json=calendar, parser_version=parser_version))
            db.session.commit()
        # print(mitaffald_id, types)
