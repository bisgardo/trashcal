from bs4 import BeautifulSoup
import re

from mitaffald_const import key_map


def parse_types(html):
    soup = BeautifulSoup(html, 'html.parser')
    select = soup.find(id='myaffaldstype')
    if select is None:
        return None
    return [t.text for t in select.find_all('option')]


def parse_calendar(html):
    soup = BeautifulSoup(html, 'html.parser')
    tables = soup.find_all('tbody')
    # The response comes in three separate tables.
    col_months = [
        [1, 2, 3, 4],  # table1 cols: jan-apr
        [5, 6, 7, 8],  # table2 cols: maj-aug
        [9, 10, 11, 12]  # table3 cols: sep-dec
    ]
    res = {k: [] for k in key_map.keys()}
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
                (k, day) = m.groups()
                res[k].append(f'{month}-{int(day.lstrip("0"))}')
    return {key_map[k]: v for (k, v) in res.items() if v}, 1
