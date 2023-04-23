#!/usr/bin/env python
from datetime import datetime

from flask import Flask, request, abort
from flask_cors import CORS

from db import db
from db_query import query_address, query_calendar, AddressNotFoundError, CalendarNotFoundError


# Serve the contents of 'frontend_path' as static files on the root path:
# Passing 'static_url_path' on initialization ensures that the static route is registered.
# Because we read the frontend path using 'app',
# the correct value of 'static_folder' is not available at initialization time.
# Luckily, Flask intentionally doesn't check that the folder exists before actually serving files,
# so we can overwrite the value later.
# It isn't really necessary as the server isn't started until the app is fully initialized,
# but in order to be completely sure that we cannot unintentionally ship files from an unexpected directory,
# we start by initializing 'static_folder' to a dummy path that should be invalid on all platforms.
app = Flask(__name__, static_folder='</>', static_url_path='/')
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


# Fall back to 'index.html' if the path doesn't match any static files in
# the automatically generated static content handler (or the API routes).
# TODO Problem: Also catches cases where other handlers produce 404 error...
#      Idea: Initialize app with 'static_url_path' set to 'None'.
#      This should prevent the automatic handler from being set up but still allow
#      'app.send_static_file' from our own route handler.
@app.errorhandler(404)
def page_not_found(e):
    print(type(e), e)
    return app.send_static_file('index.html')


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
