import pickle
import os
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar']


def init_google_calendar_events_service():
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
    return build('calendar', 'v3', credentials=creds).events()


def google_calendar_event_data(title, date):
    # Reference: https://developers.google.com/calendar/api/v3/reference/events#resource
    return {
        'summary': title,
        'start': {'date': date},
        'end': {'date': date},
        # Note that the default reminder for *normal* events (i.e. not "all day") configured for the calendar is used:
        # https://issuetracker.google.com/issues/65576067
        'reminders': {'useDefault': True},
        'transparency': 'transparent',  # don't show as "busy"
    }
