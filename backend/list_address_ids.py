#!/usr/bin/env python

from app import app
from mitaffald_fetch import fetch_types_html
from mitaffald_parse import parse_types
from db import db, Address, Type

year = 2023

with app.app_context():
    addrs = Address.query.filter(Address.mitaffald_id.isnot(None)).all()
    for addr in addrs:
        mitaffald_id = addr.mitaffald_id
        print(str(mitaffald_id))
