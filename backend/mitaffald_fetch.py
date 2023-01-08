import json
import requests
from flask import abort


def fetch_address(postcode_str, street_address_text, house_number_str):
    r = requests.get('https://mitaffald.affaldvarme.dk/Adresse/AddressesFromCodeByNumber', params={
        'term': house_number_str,
        'postnr': postcode_str,
        'selectedAdresse': street_address_text,
        'numberOfResults': 10,
    })
    addresses = r.json()
    if len(addresses) == 0:
        abort(404)
    # TODO handle invalid/unexpected response
    # Extract result by exact house number.
    address = next(filter(lambda v: v['Husnr'] == house_number_str, addresses))
    return address['Id']


def fetch_calendar_html(address_id, year):
    url = 'https://mitaffald.affaldvarme.dk/Adresse/ToemmekalenderContent'
    cookies = {'AddressId': address_id}
    # TODO Additional known filter values: "Papir pap", "Glas plast metal".
    data = {'filterValues': ['Restaffald', 'Genanvendeligt affald (Glas plast metal og papir pap)'], 'year': year}
    headers = {'Content-Type': 'application/json; charset=utf-8'}
    r = requests.post(url, headers=headers, cookies=cookies, data=json.dumps(data))
    return r.text
