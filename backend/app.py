#!/usr/bin/env python
from datetime import datetime

from flask import Flask, request, abort
from flask_cors import CORS

from db import db
from db_query import query_address, query_calendar, AddressNotFoundError, CalendarNotFoundError


# Serve the contents of 'frontend_path' as static files on the root path:
# Passing 'static_folder' as 'None' ensures that the default static route is *not* registered.
# Note that we're overwriting the value with the path loaded from config below.
# This does not cause the default router to be setup, but it does ensure that
# 'app.send_static_file' will serve static files from the correct location in the 'static' route below.
# We originally used the default static route with a "404" handler to ship 'index.html' as a fallback
# (because the frontend uses dynamic routing),
# but that also caught the 404 responses from the API routes, which was not desired.
app = Flask(__name__, static_folder=None)
app.config.from_prefixed_env()

# Let the env var 'FLASK_FRONTEND_PATH' override the default frontend path.
# which by default (i.e. for local deployment) is assumed to have been built using
# 'REACT_APP_BACKEND_URL_BASE="localhost:5000/api" npm run build'.
app.static_folder = app.config.get('FRONTEND_PATH', '../frontend/build')

# TODO Expect this to be set in deployment config?
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trashcal.sqlite3'

CORS(app)  # accept any origin

# TODO See 'https://github.com/app-generator/api-server-flask' for a "pro" example.
#      And 'https://github.com/4GeeksAcademy/react-flask-hello'...
# TODO Init DB in '@app.before_first_request'?

db.init_app(app)
with app.app_context():
    db.create_all()


@app.route('/')
def index():
    return static('index.html')


@app.route('/<path:path>')
def static(path):
    try:
        return app.send_static_file(path)
    except:
        # Fall back to serving index (or overflow the stack if it isn't there).
        # This allows the frontend to use its own internal routing (i.e. putting the address in the URL).
        return index()


@app.route('/api/address')
def address_id():
    query_params = request.args
    street_name = query_params['street_name']
    house_number = query_params['house_number']
    postcode = query_params['postcode']
    _ = query_params['postcode_name']
    try:
        res = query_address(street_name, house_number, postcode)
        if not res:
            # Address was looked up but did not resolve to a MitAffald ID.
            raise AddressNotFoundError(street_name, house_number, postcode)
        return res
    except AddressNotFoundError as e:
        abort(404, description=f"no MitAffald ID found for address (street_name='{e.street_name}', house_number='{e.house_number}', postcode='{e.postcode}')")


@app.route('/api/trash_calendar/<address_id>')
def trash_calendar(address_id):
    query_params = request.args
    year = query_params['year']
    try:
        dates_json, valid_from_time = query_calendar(address_id, year)
        # TODO MitAffald (sometimes!) doesn't include data for the current day -
        #      so valid time is the day *after* the create time (unless "today" is included in the data).
        if not valid_from_time:
            valid_from_time = datetime.utcnow()
        # Adding '-' inside the format specifier eliminates leading '0'.
        valid_from_date = valid_from_time.strftime('%-m-%-d')
        return {
            'dates': dates_json,  # is None if MitAffald import failed
            'valid_from_date': valid_from_date,
        }
    except CalendarNotFoundError as e:
        abort(404, description=f"no calendar data imported for MitAffald ID '{e.mitaffald_id}'")
