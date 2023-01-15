#!/usr/bin/env python

from app import app
from mitaffald_fetch import fetch_types_html
from mitaffald_parse import parse_types
from db import db, Address, Type

year = 2023

with app.app_context():
    addrs = Address.query.filter(Address.mitaffald_id.isnot(None)).all()
    for addr in addrs:
        # print(addr)
        mitaffald_id = addr.mitaffald_id
        # print(mitaffald_id)
        res = Type.query.filter_by(mitaffald_id=mitaffald_id, year=year).first()
        if res:
            print('skipping', mitaffald_id)
            continue
        html = fetch_types_html(str(mitaffald_id), year)
        types = parse_types(html)
        if types:
            db.session.add(
                Type(mitaffald_id=mitaffald_id, year=year, types_html_cache=html, types=types, parser_version=1))
            db.session.commit()
        # print(mitaffald_id, types)
