#!/usr/bin/env python3

#from __future__ import print_function
import datetime
import pickle
import os
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar']

CALENDAR_ID = os.getenv('CALENDAR_ID')
YEAR = os.getenv('YEAR')

def init_service():
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server()
        # Save the credentials for the next run.
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    return build('calendar', 'v3', credentials=creds)

def parse_date(line):
    day, month = line.split('/')
    return YEAR, month, day

def load_dates(file):
    with open(file) as fp:
        dates = []
        for line in fp.readlines():
            line = line.strip()
            if not line: continue
            year, month, day = parse_date(line)
            dates.append('%s-%s-%s' % (year, month, day))
        return dates

def main():
    cal_id = CALENDAR_ID
    service = init_service()
    service_events = service.events()
    def create_event(title, date):
        event = {
            'summary': title,
            'start': { 'date': date },
            'end': { 'date': date },
            # Note that the default reminder for *normal* events (i.e. not "all day") is used:
            # https://issuetracker.google.com/issues/65576067
            'reminders': { 'useDefault': True },
            'transparency': 'transparent', # Don't show as "busy".
        }
        #print(event)
        event = service_events.insert(calendarId=cal_id, body=event).execute()

    restaffald_dates = load_dates('../restaffald.txt')
    genanvendeligt_affald_dates = load_dates('../genanvendeligt_affald.txt')

    for date in restaffald_dates:
        #print(date)
        create_event('Restaffald', date)

    for date in genanvendeligt_affald_dates:
        #print(date)
        create_event('Genanvendeligt affald', date)

if __name__ == '__main__':
    main()
