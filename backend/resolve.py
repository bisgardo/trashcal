from db import db, Address, Calendar
from mitaffald_parse import parse_calendar
from mitaffald_fetch import fetch_calendar_html, fetch_address


def resolve_address(street_name, house_number, postcode, postcode_name):
    res = Address.query.filter_by(street_name=street_name, house_number=house_number, postcode=postcode).first()
    if res:
        if res.mitaffald_id:
            return str(res.mitaffald_id), True
        return None, True
    mitaffald_id = fetch_address(street_name, house_number, postcode, postcode_name)
    db.session.add(
        Address(street_name=street_name, house_number=house_number, postcode=postcode, mitaffald_id=mitaffald_id))
    db.session.commit()
    return mitaffald_id, False


def resolve_calendar(mitaffald_id, year):
    res = Calendar.query.filter_by(mitaffald_id=mitaffald_id, year=year).first()
    if res:
        return res.json, True
    html = fetch_calendar_html(mitaffald_id, year)
    json, version = parse_calendar(html)
    db.session.add(Calendar(mitaffald_id=mitaffald_id, year=year, json=json, parser_version=version))
    db.session.commit()
    return json, False
