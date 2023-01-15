#!/usr/bin/env python

from flask import Flask, request
from flask_cors import CORS

from db import db, lookup_address, lookup_calendar
from mitaffald_fetch import fetch_address, fetch_calendar_html
from mitaffald_parse import parse_calendar

app = Flask(__name__)
CORS(app)  # accept any origin

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trashcal.sqlite3'

db.init_app(app)
with app.app_context():
    db.create_all()


# TODO Validate inputs and handle errors.

@app.route('/lookup_address_id')
def address():
    query_params = request.args
    street_name = query_params['street_name']
    house_number = query_params['house_number']
    postcode = query_params['postcode']
    postcode_name = query_params['postcode_name']
    res, _ = lookup_address(street_name, house_number, postcode,
                            lambda: fetch_address(street_name, house_number, postcode, postcode_name))
    return res


@app.route('/trash_calendar/<address_id>')
def trash_calendar(address_id):
    query_params = request.args
    year = query_params['year']
    res, _ = lookup_calendar(address_id, year, lambda: fetch_calendar_html(address_id, year),
                             lambda html: parse_calendar(html, int(year)))
    return res
