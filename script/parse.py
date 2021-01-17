#!/usr/bin/env python3

from bs4 import BeautifulSoup
import re

soup = BeautifulSoup(open('../data.html'), 'html.parser')

tables = soup.find_all('tbody')

# The response comes in three separate tables.
col_months = [
    [1, 2, 3, 4],   # table1 cols: jan-apr
    [5, 6, 7, 8],   # table2 cols: maj-aug
    [9, 10, 11, 12] # table3 cols: sep-dec
]

# The two types of dates.
restaffald_text = 'Restaffald'
genanv_affald_text = 'Genanvendeligt affald (Glas plast metal og papir pap)'

res = {}
res[restaffald_text] = []
res[genanv_affald_text] = []

for i, table in enumerate(tables):
    cols = table.find_all('td')
    for j, col in enumerate(cols): # there's only one row
        # Dates are separated by '<br>'.
        # The 'text' attribute ignores these tags
        # but leaves the inputs on the original lines.
        # A more robust solution would be to actually split on the tags.
        lines = [ l.strip() for l in col.text.splitlines() if l.strip() ]
        month = col_months[i][j]
        for l in lines:
            # Extract type and day from the line and append it to res.
            m = re.match(r'(.*): \w+ (\d+)\.', l)
            (type, day) = m.groups()
            res[type].append(day.lstrip('0') + '/' + str(month))


# Write results to the files expected by 'script.py'.

with open('../restaffald.txt', 'w') as f:
    dates = res[restaffald_text]
    f.write('\n'.join(dates))
    f.write('\n')

with open('../genanvendeligt_affald.txt', 'w') as f:
    dates = res[genanv_affald_text]
    f.write('\n'.join(dates))
    f.write('\n')
