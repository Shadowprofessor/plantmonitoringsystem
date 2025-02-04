import requests
import mysql.connector
from datetime import datetime
import time

# ThingSpeak API details
THING_SPEAK_CHANNEL_ID = 2679947  # Replace with your ThingSpeak Channel ID
THING_SPEAK_READ_API_KEY = "KR8S190NY76UDC68"  # Replace with your Read API key
THING_SPEAK_URL = f"https://api.thingspeak.com/channels/{THING_SPEAK_CHANNEL_ID}/feeds.json"

# MySQL database credentials
DB_CONFIG = {
    "host": "127.0.0.1",        # Replace with your database host
    "user": "root",    # Replace with your database username
    "password": "",    # Replace with your database password
    "database": "iothub" # Replace with your database name
}

def fetch_thingspeak_data():
    """Fetch data from ThingSpeak."""
    params = {"api_key": THING_SPEAK_READ_API_KEY}
    try:
        response = requests.get(THING_SPEAK_URL, params=params)
        response.raise_for_status()  # Will raise an HTTPError if the HTTP request failed
        return response.json().get("feeds", [])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return []

def store_data_in_db(data):
    """Store ThingSpeak data in the SQL database."""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()

        for feed in data:
            entry_id = feed.get("entry_id")
            created_at = feed.get("created_at")
            field1 = feed.get("field1")
            field2 = feed.get("field2")
            field3 = feed.get("field3")
            field4 = feed.get("field4")  # Ensure we capture the exact value

            # Convert created_at to datetime format
            created_at_dt = datetime.strptime(created_at, "%Y-%m-%dT%H:%M:%SZ")

            # Ensure precision for field4 by keeping it as a float
            field1 = float(field1) if field1 else None
            field2 = float(field2) if field2 else None
            field3 = float(field3) if field3 else None
            field4 = float(field4) if field4 else None  # Ensuring exact value sent

            # Insert or update the record
            sql = """
                INSERT INTO thingspeak_data (entry_id, created_at, field1, field2, field3, field4)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                created_at = VALUES(created_at),
                field1 = VALUES(field1),
                field2 = VALUES(field2),
                field3 = VALUES(field3),
                field4 = VALUES(field4)
            """
            values = (entry_id, created_at_dt, field1, field2, field3, field4)
            cursor.execute(sql, values)

        connection.commit()
        cursor.close()
        connection.close()
        print("Data successfully stored in the database.")
    except mysql.connector.Error as e:
        print(f"Error inserting data: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def main():
    while True:
        try:
            print("Fetching new data from ThingSpeak...")
            data = fetch_thingspeak_data()
            if data:
                store_data_in_db(data)
            else:
                print("No new data to store.")

            print("Waiting for 30 seconds before reactivating...")
            time.sleep(30)  # Wait for 30 seconds before reactivating
        except KeyboardInterrupt:
            print("Process interrupted by user.")
            break  # Exit the loop when the script is manually stopped
        except Exception as e:
            print(f"Error occurred: {e}")
            print("Reactivating after a short pause...")
            time.sleep(10)  # Sleep for 10 seconds before reactivating in case of an error

if __name__ == "__main__":
    main()
