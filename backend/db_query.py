from db import Address, Calendar


class AddressNotFoundError(Exception):
    def __init__(self, street_name, house_number, postcode):
        self.street_name = street_name
        self.house_number = house_number
        self.postcode = postcode


class CalendarNotFoundError(Exception):
    def __init__(self, mitaffald_id):
        self.mitaffald_id = mitaffald_id


def query_address(street_name, house_number, postcode):
    res = Address.query.filter_by(street_name=street_name, house_number=house_number, postcode=postcode).first()
    if not res:
        raise AddressNotFoundError(street_name, house_number, postcode)
    mitaffald_id = res.mitaffald_id
    if not mitaffald_id:
        return None
    return str(mitaffald_id)


def query_calendar(mitaffald_id, year):
    res = Calendar.query.filter_by(mitaffald_id=mitaffald_id, year=year).first()
    if not res:
        raise CalendarNotFoundError(mitaffald_id)
    return res.json, res.create_time
