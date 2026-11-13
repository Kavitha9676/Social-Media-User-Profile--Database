#!/usr/bin/env python3
"""Hadoop Streaming mapper for social media user profile aggregation."""
import csv
import sys

def follower_band(value):
    count = int(value)
    if count < 0:
        raise ValueError("followers cannot be negative")
    if count < 500:
        return "0-499"
    if count < 1000:
        return "500-999"
    if count < 2000:
        return "1000-1999"
    return "2000+"

reader = csv.reader(sys.stdin)
for row in reader:
    try:
        # Expected columns:
        # user_id, username, age_group, location, interest, followers, following, posts
        if not row or row[0].strip().lower() == "user_id":
            continue
        if len(row) < 8:
            continue

        user_id = row[0].strip()
        location = row[3].strip()
        interest = row[4].strip()
        followers = row[5].strip()

        if not user_id or not location or not interest:
            continue

        band = follower_band(followers)

        # Emit one count for each analysis dimension.
        print(f"LOCATION|{location}\t1")
        print(f"INTEREST|{interest}\t1")
        print(f"FOLLOWER_BAND|{band}\t1")
    except (ValueError, IndexError):
        # Ignore malformed rows in this teaching example.
        continue
