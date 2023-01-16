#!/usr/bin/env python
import os.path

from mitaffald_fetch import fetch_types_html

year = 2023

out_dir = './out'
os.makedirs(out_dir, exist_ok=True)

with open('mitaffald_ids.txt', 'r') as f:
    ids = f.readlines()
    for id in ids:
        mitaffald_id = id.strip()
        out_filename = os.path.join(out_dir, f'{mitaffald_id}.html')
        if os.path.exists(out_filename):
            print(mitaffald_id, 'skipped')
            continue
        try:
            html = fetch_types_html(str(mitaffald_id), year)
            with open(out_filename, 'w') as out_file:
                out_file.write(html)
            print(mitaffald_id, 'successful')
        except:
            print(mitaffald_id, 'failed')
