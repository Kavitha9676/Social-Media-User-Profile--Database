# Social Media User Profile Database

A beginner-friendly Big Data Analytics project using **Apache Hadoop HDFS, Hadoop MapReduce, Hadoop Streaming and Python**.

## Project overview

This project demonstrates how social media user profile records can be stored in HDFS and analysed with a MapReduce job. The Python mapper emits profile counts by:

- Location
- Interest
- Follower-count range

The reducer sums values for matching keys and writes grouped totals.

> **Dataset note:** `data/social_media_profiles.csv` contains six synthetic sample records created for demonstration. It is not data collected from a real social media platform. Replace it with a larger, lawfully obtained and appropriately anonymised dataset for meaningful analysis.

## Technology stack

- Apache Hadoop (HDFS and MapReduce)
- Hadoop Streaming
- Python 3
- CSV dataset
- Ubuntu / WSL (recommended for the lab setup)

## Repository structure

```text
social-media-user-profile-database/
├── data/
│   └── social_media_profiles.csv
├── output/
│   └── .gitkeep
├── mapper.py
├── reducer.py
├── README.md
├── .gitignore
└── requirements.txt
```

## Dataset fields

| Field | Description |
|---|---|
| user_id | Sample unique user identifier |
| username | Sample account name |
| age_group | Broad age band |
| location | City or region |
| interest | Profile interest |
| followers | Number of followers |
| following | Number of accounts followed |
| posts | Number of posts |

## How MapReduce works

1. **Input:** The CSV file is uploaded to HDFS.
2. **Mapper:** Each valid profile produces three key-value pairs: `LOCATION`, `INTEREST` and `FOLLOWER_BAND`, each with value `1`.
3. **Shuffle and sort:** Hadoop groups identical keys.
4. **Reducer:** Values for each key are added.
5. **Output:** Aggregated counts are saved in HDFS.

Follower bands: `0-499`, `500-999`, `1000-1999`, and `2000+`.

## Requirements

- Java installed and configured
- Apache Hadoop installed and configured
- Python 3 installed
- Hadoop services running (for a pseudo-distributed setup)

No third-party Python packages are required.

## Run locally (mapper/reducer logic check)

From the project root:

```bash
cat data/social_media_profiles.csv | python3 mapper.py | sort | python3 reducer.py
```

This checks the mapper and reducer logic locally. It does **not** run a Hadoop job.

## Run with Hadoop Streaming

### 1. Start Hadoop services

Start HDFS and YARN using the commands appropriate for your Hadoop installation. For a typical single-node setup:

```bash
start-dfs.sh
start-yarn.sh
jps
```

### 2. Find the Hadoop Streaming JAR

```bash
find "$HADOOP_HOME" -name 'hadoop-streaming-*.jar'
```

Copy the full path returned by the command.

### 3. Upload the input file to HDFS

```bash
hdfs dfs -mkdir -p /user/$USER/social-profile/input
hdfs dfs -put -f data/social_media_profiles.csv /user/$USER/social-profile/input/
```

### 4. Submit the Streaming job

Replace `/path/to/hadoop-streaming.jar` with the actual JAR path found in Step 2.

```bash
hadoop jar /path/to/hadoop-streaming.jar \
  -files mapper.py,reducer.py \
  -mapper "python3 mapper.py" \
  -reducer "python3 reducer.py" \
  -input /user/$USER/social-profile/input/social_media_profiles.csv \
  -output /user/$USER/social-profile/output
```

Hadoop requires the output directory not to exist before a job starts. For another run, remove the old output directory first:

```bash
hdfs dfs -rm -r /user/$USER/social-profile/output
```

### 5. View the result

```bash
hdfs dfs -cat /user/$USER/social-profile/output/part-*
```

## Expected sample result

The following is the expected aggregation for the six synthetic rows supplied in this repository. Confirm it against the output produced in your own environment.

```text
FOLLOWER_BAND|0-499        2
FOLLOWER_BAND|1000-1999    1
FOLLOWER_BAND|2000+        1
FOLLOWER_BAND|500-999      2
INTEREST|Art               1
INTEREST|Books             2
INTEREST|Technology        2
INTEREST|Travel            1
LOCATION|Bengaluru         2
LOCATION|Hyderabad         2
LOCATION|Madanapalle       2
```

Each dimension should total six profiles. The mapper should emit 18 records (three per valid profile).

## Responsible use and limitations

- The included dataset is synthetic and very small.
- Profile counts do not measure engagement, popularity or user satisfaction.
- Do not upload private profile data, passwords, messages, phone numbers or other sensitive information to a public repository.
- Use only data you are authorised to process. Prefer anonymised or aggregated records.
- A single-node Hadoop installation demonstrates the workflow but does not prove multi-node scalability.

## Future enhancements

- Use a larger, documented and ethically sourced dataset.
- Add time-based profile analysis.
- Add validation reports for missing values, duplicate IDs and invalid counts.
- Visualise aggregated output using charts.
- Compare Hadoop output with a local Python baseline.

## Author

**G. Navya Sree**  
B.Tech – Computer Science & Engineering (Data Science)  
Madanapalle Institute of Technology & Science

Update this section with your correct roll number, guide details and any team-member information before submission.
