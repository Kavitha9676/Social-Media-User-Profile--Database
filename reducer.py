#!/usr/bin/env python3
"""Hadoop Streaming reducer: sum values for each sorted key."""
import sys

current_key = None
current_total = 0

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue

    try:
        key, value = line.split("\t", 1)
        count = int(value)
    except ValueError:
        continue

    if key == current_key:
        current_total += count
    else:
        if current_key is not None:
            print(f"{current_key}\t{current_total}")
        current_key = key
        current_total = count

if current_key is not None:
    print(f"{current_key}\t{current_total}")
