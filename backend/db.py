from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_utils import UUIDType

db = SQLAlchemy()


class Address(db.Model):
    street_name = db.Column('street_name', db.Integer, primary_key=True)
    house_number = db.Column('house_number', db.Integer, primary_key=True)
    postcode = db.Column('postcode', db.Integer, primary_key=True)
    mitaffald_id = db.Column('mitaffald_id', UUIDType)
    timestamp = db.Column('time', db.DateTime, nullable=False, default=datetime.utcnow)


# TODO Split in cache and result?
class Calendar(db.Model):
    mitaffald_id = db.Column('mitaffald_id', UUIDType, primary_key=True)
    year = db.Column('year', db.Integer, primary_key=True)
    html_cache = db.Column('html_cache', db.String)
    json = db.Column('json', db.JSON)
    version = db.Column('parser_version', db.Integer)
    timestamp = db.Column('time', db.DateTime, nullable=False, default=datetime.utcnow)


def lookup_address(street_name, house_number, postcode, fetch):
    res = Address.query.filter_by(street_name=street_name, house_number=house_number, postcode=postcode).first()
    if res:
        return str(res.mitaffald_id), True
    mitaffald_id = fetch()
    db.session.add(
        Address(street_name=street_name, house_number=house_number, postcode=postcode, mitaffald_id=mitaffald_id))
    db.session.commit()
    return mitaffald_id, False


def lookup_calendar(mitaffald_id, year, fetch, parse):
    res = Calendar.query.filter_by(mitaffald_id=mitaffald_id, year=year).first()
    if res:
        return res.json, True
    html = fetch()
    json, version = parse(html)
    db.session.add(Calendar(mitaffald_id=mitaffald_id, year=year, html=html, json=json))
    db.session.commit()
    return json, False
