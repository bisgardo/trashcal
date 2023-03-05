# trashcal - Google Calendar

Small tool for inserting trash pickup dates for a given Danish address into a given calendar in Google Calendar.
The inserted events are "all-day" and use the default notification settings for the calendar.

While a significantly less than great deal of time has been spent polishing this tool,
it's pretty simple to use: Complete instructions are provided below.

*History*

The project has been used once a year since Mar 2019; evolving a little each time.
It was last used in Jan 2023, where it was rewritten into a single Python script.

In Mar 2023, as the project was partly migrated into a web app
(which can render a calendar for any address but missing the Google Calendar part),
the tool was moved into this directory.
This migration incurred a bunch of functional changes that have only been superficially verified.

## Install

The tool consists of a Python script that uses the web backend as a library.

The Python dependencies are installed by creating a virtual env in the root folder
and installing the dependencies:

```
python -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```

The commands below assume that the virtual env is active.
Deactivate using the command `deactivate` when done or just exit the shell.

## Usage

1.  The script expects to find credentials to the Google Cloud project in
    the file `credentials.json`.

    To get this, I suppose one has to create a personal Google Cloud project
    the first time that they use this tool.
    See the [quickstart](https://developers.google.com/calendar/quickstart/python)
    that this project was originally bootstrapped from for details.

    Existing credentials may be downloaded from the
    [Cloud Console](https://console.cloud.google.com/apis/credentials)
    (APIs & Services > Credentials; OAuth 2.0 Client IDs).
    Download the appropriate "OAuth client" (select "Download JSON")
    and move/rename it to `credentials.json` so the app can find it.

    If the file `token.pickle` is present, it's probably expired and
    may then have to be deleted.
    The script should just generate a new one using the login flow.

2.  Create a calendar in Google Calendar and find its Calendar ID
    (it looks like `<gibberish>@group.calendar.google.com`)
    and set the environment variable `TRASHCAL_CALENDAR_ID` to this value:

    ```shell
    $ export TRASHCAL_GOOGLE_CALENDAR_ID=... # copy/paste from Google Calendar
    ```

    Set desired default event notifications on the calendar:
    Because of [a never-to-be-fixed bug](https://issuetracker.google.com/issues/65576067)
    in Google Calendar, the script uses event notifications from "ordinary" events
    even though the event is created as being "all day".
    Just define both types to be sure that it works
    (for example, set "Event notifications: 6 hrs" and
    "All-day event notifications: 1 day before at 18:00").

3.  Find the address ID by filling the address form on [MitAffald](https://mitaffald.affaldvarme.dk#address-search).
    Assuming that "search" finds a match, the ID will be stored in the cookie `AddressId`
    and may be retrieved from the variable `document.cookie` in the browser console;
    it's a UUID like `87a936ba-5299-11eb-865d-77a3a31922d4`.
    Store the value in the environment variable `TRASHCAL_ADDRESS_ID`:
    ```shell
    $ export TRASHCAL_ADDRESS_ID=... # copy/paste from cookie
    ```

4.  From the project root, run the main script ` ./main.py`,
    passing the year in the environment variable `TRASHCAL_YEAR`:
    ```shell
    $ TRASHCAL_YEAR=2023 ./main.py
    ```
    This will fetch and parse the dates from MitAffald and then insert the full-day events into your calendar.

    This will open a browser window to go through a bunch of Google account selection approval steps.

    The app has not yet been submitted to Google for verification,
    which is why you'll run it as yourself being the developer.
    But for this reason, a bunch of security warnings will be presented
    and have to be explicitly ignored for it to work.

    If there is a valid `token.pickle` file, it probably skips this step.
    Once the script is done, the events should have been added to the calendar.
