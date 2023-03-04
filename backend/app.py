#!/usr/bin/env python
from datetime import datetime

from flask import Flask, request, abort
from flask_cors import CORS

from db import db
from resolve import resolve_address, resolve_calendar


# TODO Solve chicken-egg issue with reading frontend path using 'app' and using it to initialize 'app'.
# Serve the contents of 'frontend_path' as static files on the root path.
app = Flask(__name__, static_folder=frontend_path, static_url_path='/')

app.config.from_prefixed_env()

# By default, the frontend is assumed to have been built using
# 'REACT_APP_BACKEND_URL_BASE="localhost:5000/api" npm run build'.
frontend_path = app.config['FRONTEND_PATH'] or '../frontend/build'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trashcal.sqlite3'

CORS(app)  # accept any origin

# TODO See 'https://github.com/app-generator/api-server-flask' for a "pro" example.
# TODO Init DB in '@app.before_first_request'?

db.init_app(app)
with app.app_context():
    db.create_all()


# Fall back to 'index.html' if the path doesn't match any static files in
# the automatically generated static content handler (or the API routes).
@app.errorhandler(404)
def page_not_found(e):
    return app.send_static_file('index.html')


@app.route('/api/address')
def address_id():
    query_params = request.args
    street_name = query_params['street_name']
    house_number = query_params['house_number']
    postcode = query_params['postcode']
    postcode_name = query_params['postcode_name']
    res, _ = resolve_address(street_name, house_number, postcode, postcode_name)
    if not res:
        abort(404)
    return res


@app.route('/api/trash_calendar/<address_id>')
def trash_calendar(address_id):
    query_params = request.args
    year = query_params['year']
    res, valid_from_time = resolve_calendar(address_id, year)
    if not res:
        abort(404)
    # TODO Mitaffald doesn't include data for the current day - so valid time is the day *after* create time.
    if not valid_from_time:
        valid_from_time = datetime.utcnow()
    # Adding '-' inside the format specifier eliminates leading '0'.
    valid_from_date = valid_from_time.strftime('%-m-%-d')
    return {
        'dates': res,
        'valid_from_date': valid_from_date,
    }
