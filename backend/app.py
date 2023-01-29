#!/usr/bin/env python

from flask import Flask, request, abort
from flask_cors import CORS

from db import db
from resolve import resolve_address, resolve_calendar

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
    res, _ = resolve_address(street_name, house_number, postcode, postcode_name)
    if not res:
        abort(404)
    return res


@app.route('/trash_calendar/<address_id>')
def trash_calendar(address_id):
    query_params = request.args
    year = query_params['year']
    res, _ = resolve_calendar(address_id, year)
    if not res:
        abort(404)
    return {
        'dates': res,
        'valid_from': '1-27',  # TODO use date from DB.
    }
