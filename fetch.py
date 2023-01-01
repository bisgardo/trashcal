import json
import requests


def fetch(address_id, year):
    url = 'https://mitaffald.affaldvarme.dk/Adresse/ToemmekalenderContent'
    cookies = {'AddressId': address_id}
    data = {'filterValues': ['Restaffald', 'Genanvendeligt affald (Glas plast metal og papir pap)'], 'year': year}
    headers = {'Content-Type': 'application/json; charset=utf-8'}
    r = requests.post(url, headers=headers, cookies=cookies, data=json.dumps(data))
    return r.text
