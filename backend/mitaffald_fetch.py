import json
import requests
from flask import abort

from mitaffald_const import genanv_text, rest_text


def fetch_address(postcode_str, street_address_text, house_number_str):
    r = requests.get('https://mitaffald.affaldvarme.dk/Adresse/AddressesFromCodeByNumber', params={
        'term': house_number_str,
        'postnr': postcode_str,
        'selectedAdresse': street_address_text,
        'numberOfResults': 10,
    })
    addresses = r.json()
    # TODO handle invalid/unexpected response
    # Extract result by exact house number.
    for address in addresses:
        if address['Husnr'] == house_number_str:
            return address['Id']
    abort(404)


def fetch_calendar_html(address_id, year):
    url = 'https://mitaffald.affaldvarme.dk/Adresse/ToemmekalenderContent'
    cookies = {'AddressId': address_id}
    # TODO Additional known filter values: "Papir pap", "Glas plast metal".
    data = {'filterValues': [rest_text, genanv_text], 'year': year}
    headers = {'Content-Type': 'application/json; charset=utf-8'}
    r = requests.post(url, headers=headers, cookies=cookies, data=json.dumps(data))
    return r.text
