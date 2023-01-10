from flask import Flask, request
from flask_cors import CORS

from mitaffald_fetch import fetch_address, fetch_calendar_html
from mitaffald_parse import parse_calendar


app = Flask(__name__)
# TODO Restrict to our own frontend?
CORS(app)  # accepts all origins


# TODO Validate inputs and handle errors.

@app.route('/lookup_address_id')
def address():
    query_params = request.args
    postcode = query_params['postcode']
    house_number = query_params['house_number']
    street_address_text = query_params['street_address_text']
    return fetch_address(postcode, street_address_text, house_number)


@app.route('/trash_calendar/<address_id>')
def trash_calendar(address_id):
    query_params = request.args
    year = query_params['year']
    calendar_html = fetch_calendar_html(address_id, year)
    rest_dates, genanv_dates = parse_calendar(calendar_html, int(year))
    return {
        "restaffald": rest_dates,
        "genanvendeligt_affald": genanv_dates,
    }
