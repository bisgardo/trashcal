from bs4 import BeautifulSoup
import re
from datetime import date

from mitaffald_const import genanv_text, rest_text


def map_to_dates(strs, year):
    def to_date(s):
        day, month = s.split('/')
        return date(year, month, day)
    return [to_date(s) for s in strs]


def parse_calendar(html, year_int):
    soup = BeautifulSoup(html, 'html.parser')
    tables = soup.find_all('tbody')
    # The response comes in three separate tables.
    col_months = [
        [1, 2, 3, 4],    # table1 cols: jan-apr
        [5, 6, 7, 8],    # table2 cols: maj-aug
        [9, 10, 11, 12]  # table3 cols: sep-dec
    ]
    res = {
        rest_text: [],
        genanv_text: [],
    }
    for i, table in enumerate(tables):
        cols = table.find_all('td')
        for j, col in enumerate(cols):  # there's only one row
            # Dates are separated by '<br>'.
            # The 'text' attribute ignores these tags
            # but leaves the inputs on the original lines.
            # A more robust solution would be to actually split on the tags.
            lines = [l.strip() for l in col.text.splitlines() if l.strip()]
            month = col_months[i][j]
            for l in lines:
                # Extract type and day from the line and append it to res.
                m = re.match(r'(.*): \w+ (\d+)\.', l)
                (type, day) = m.groups()
                res[type].append(date(year_int, month, int(day.lstrip('0'))))
    return res[rest_text], res[genanv_text]
