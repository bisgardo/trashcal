#!/usr/bin/env python

import os

from fetch import fetch
from google_calendar import init_google_calendar_events_service, google_calendar_event_data
from parse import parse

# TODO Let the script resolve address ID. At least do:
#      1. present clickable URL to user
#      2. accept full cookie string and parse the ID from there

address_id = os.getenv('TRASHCAL_ADDRESS_ID')
year = int(os.getenv('TRASHCAL_YEAR'))
calendar_id = os.getenv('TRASHCAL_GOOGLE_CALENDAR_ID')

event_title_rest = 'Restaffald'
event_title_genanv = 'Genanvendeligt affald'


def to_events(dates, title):
    return [google_calendar_event_data(title, d.strftime('%Y-%m-%d')) for d in dates]


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    data = fetch(address_id, year)
    rest_dates, genanv_dates = parse(data, year)

    rest_events = to_events(rest_dates, event_title_rest)
    genanv_events = to_events(genanv_dates, event_title_genanv)
    events_service = init_google_calendar_events_service()
    for e in rest_events + genanv_events:
        events_service.insert(calendarId=calendar_id, body=e).execute()
