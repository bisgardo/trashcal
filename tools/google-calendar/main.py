#!/usr/bin/env python

import os
import sys
sys.path.append(os.getcwd() + '/../../backend')

from mitaffald_const import key_map

from mitaffald_fetch import fetch_calendar_html
from mitaffald_parse import parse_calendar
from google_calendar import init_google_calendar_events_service, google_calendar_event_data

# TODO Let the script resolve address ID. At least do:
#      1. present clickable URL to user
#      2. accept full cookie string and parse the ID from there

address_id = os.getenv('TRASHCAL_ADDRESS_ID')
year = int(os.getenv('TRASHCAL_YEAR'))
calendar_id = os.getenv('TRASHCAL_GOOGLE_CALENDAR_ID')

dates_key_rest = key_map['Restaffald']
dates_key_genanv = key_map['Genanvendeligt affald (Glas plast metal og papir pap)']

event_title_rest = 'Restaffald'
event_title_genanv = 'Genanvendeligt affald'


def to_events(year, dates, title):
    return [google_calendar_event_data(title, f'{year}-{d}') for d in dates]


if __name__ == '__main__':
    data = fetch_calendar_html(address_id, year)
    dates, v = parse_calendar(data)
    rest_dates, genanv_dates = dates[dates_key_rest], dates[dates_key_genanv]

    rest_events = to_events(year, rest_dates, event_title_rest)
    genanv_events = to_events(year, genanv_dates, event_title_genanv)
    events_service = init_google_calendar_events_service()
    for e in rest_events + genanv_events:
        events_service.insert(calendarId=calendar_id, body=e).execute()
