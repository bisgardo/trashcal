from mitaffald_parse import parse_calendar
from db import db, Address, Calendar
from mitaffald_fetch import fetch_address, fetch_calendar_html


def import_address(street_name, house_number, postcode, postcode_name):
    mitaffald_id = None
    try:
        mitaffald_id = fetch_address(street_name, house_number, postcode, postcode_name)
    except:
        pass
    # TODO Remove any existing record of the MitAffald ID (or use UPDATE in that case).
    db.session.add(Address(street_name=street_name, house_number=house_number, postcode=postcode, mitaffald_id=mitaffald_id))
    db.session.commit()
    return mitaffald_id


def import_calendar(mitaffald_id, year):
    json = None
    version = 0
    try:
        html = fetch_calendar_html(mitaffald_id, year)
        json, version = parse_calendar(html)
        # TODO Merge with any existing data (and of so, use UPDATE below).
    except:
        pass
    db.session.add(Calendar(mitaffald_id=mitaffald_id, year=year, json=json, parser_version=version))
    db.session.commit()
    return json
