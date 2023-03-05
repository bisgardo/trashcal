import json
import requests

from mitaffald_const import keys


def fetch_address(street_name, house_number_str, postcode_str, postcode_name):
    street_address_text = f'{street_name}, {postcode_str} {postcode_name}'
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
    return None


def fetch_types_html(address_id, year):
    url = f'https://mitaffald.affaldvarme.dk/Adresse/Toemmekalender?year={year}'
    cookies = {'AddressId': address_id}
    r = requests.get(url, cookies=cookies)
    return r.text


def fetch_calendar_html(address_id, year):
    url = 'https://mitaffald.affaldvarme.dk/Adresse/ToemmekalenderContent'
    cookies = {'AddressId': address_id}
    data = {'filterValues': keys, 'year': year}
    headers = {'Content-Type': 'application/json; charset=utf-8'}
    r = requests.post(url, headers=headers, cookies=cookies, data=json.dumps(data))
    return r.text
