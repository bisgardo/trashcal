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


class Calendar(db.Model):
    mitaffald_id = db.Column('mitaffald_id', UUIDType, primary_key=True)
    year = db.Column('year', db.Integer, primary_key=True)
    json = db.Column('json', db.JSON)
    parser_version = db.Column('parser_version', db.Integer, nullable=False)
    # TODO Rename to 'create_time' and add 'update_time'.
    #      The creation time is used to display which dates aren't accounted for (they're grayed out).
    #      The update time is used to determine if it's time to refresh the data.
    timestamp = db.Column('time', db.DateTime, nullable=False, default=datetime.utcnow)
