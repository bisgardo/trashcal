# trashcal

Tool for inserting trash pickup dates for a given Danish address into a given calendar in Google Calendar.
The inserted events are "all-day" and use the default notification settings for the calendar.

While a significantly less than great deal of time has been spent polishing this project,
it's pretty simple to use: Complete instructions are provided below.

*History*

The project has been used once a year since Mar 2019; evolving a little each time.
It was last used in Jan 2022, where it worked without major issues.

## Install

The tool consists of a few Bash and Python scripts.

The Python dependencies are installed by creating a virtual env in the `script` folder
and installing the dependencies:

```
cd scripts
python -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```

The commands below assume that the virtual env is active.
Deactivate using the command `deactivate` when done or just exit the shell.

## Usage

1.  Find the address ID by filling the address form on [MitAffald](https://mitaffald.affaldvarme.dk#address-search).
    Assuming that "search" finds a match, the ID will be stored in the cookie `AddressId`
    and may be retrieved from the variable `document.cookie` in the browser console;
    it's a UUID like `87a936ba-5299-11eb-865d-77a3a31922d4`.
    Store the value in a shell variable for use in the next step:
    ```
    $ address_id=... # copy/paste from cookie
    ```

2.  From the project root, run `fetch-data.sh` to download an HTML table containing the dates:
    ```
    $ year=2022
    $ ./fetch-data.sh -y "$year" -a "$address_id" > data.html
    ```

3.  Extract dates from `data.html`:
    ```
    $ (cd script && ./parse.py)
    ```

4.  The import script expects to find credentials to the Google Cloud project in
    the file `script/credentials.json`.

    To get this, I suppose one has to create a personal Google Cloud project
    the first time that they use this tool.
    See the [quickstart](https://developers.google.com/calendar/quickstart/python)
    that this project was originally bootstrapped from for details.

    Existing credentials may be downloaded from the
    [Cloud Console](https://console.cloud.google.com/apis/credentials)
    (APIs & Services > Credentials; OAuth 2.0 Client IDs).
    Download the appropriate "OAuth client" (select "Download JSON")
    and move/rename it to `script/credentials.json` so the app can find it.

    If the file `script/token.pickle` is present, it's probably expired and
    may then have to be deleted.
    The import script should just generate a new one using the login flow.

5.  Create a calendar in Google Calendar and find its Calendar ID
    (it looks like `<gibberish>@group.calendar.google.com`)
    and set the environment variable `CALENDAR_ID` to this value.
    The variable `YEAR` also needs to be set.

    Set desired default event notifications on the calendar:
    Without remembering the details, I believe that because of some probably-never-to-be-fixed bug
    in Google Calendar, the import script uses event notifications from "ordinary" events
    even though the event is created as being "all day".
    Just define both types to be sure that it works
    (for example, set "Event notifications: 6 hrs" and
    "All-day event notifications: 1 day before at 18:00").

6.  Run the import script to add the events to the calendar:
    ```
    $ (cd script && CALENDAR_ID=<calendar ID from above> YEAR=2022 ./import.py)
    ```
    This will open a browser window to go through a bunch of Google account selection approval steps.

    The app has not yet been submitted to Google for verification,
    which is why you'll run it as yourself being the developer.
    But for this reason, a bunch of security warnings will be presented
    and have to be explicitly ignored for it to work.

    If there is a valid `token.pickle` file, it probably skips this step.
    Once the script is done, the events should have been added to the calendar.
