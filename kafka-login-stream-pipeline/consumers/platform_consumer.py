"""
Platform Consumer
Generic consumer that listens to a single Kafka topic and prints messages.
Replaces the separate ios/android/missing consumer scripts.

Usage:
    python consumers/platform_consumer.py ios-user-login
    python consumers/platform_consumer.py android-user-login
    python consumers/platform_consumer.py missing-data-login
"""

from confluent_kafka import Consumer, KafkaError
from datetime import datetime
import sys

BOOTSTRAP = "localhost:29092"


def consume_topic(topic: str, group_suffix: str = None):
    """Listen to a single topic and print messages as they arrive."""

    group = group_suffix or topic.replace("-", "_")

    consumer = Consumer({
        "bootstrap.servers": BOOTSTRAP,
        "group.id": group,
        "auto.offset.reset": "earliest",
    })

    consumer.subscribe([topic])
    print(f"Listening on '{topic}' (group={group})")
    print("Press Ctrl+C to stop.\n")

    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() != KafkaError._PARTITION_EOF:
                    print(f"ERROR: {msg.error()}")
                continue

            payload = msg.value().decode("utf-8")
            ts = datetime.now().strftime("%H:%M:%S")
            print(f"[{ts}] {payload}")

    except KeyboardInterrupt:
        print(f"\nStopped listening on '{topic}'.")
    finally:
        consumer.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python platform_consumer.py <topic-name>")
        print("Topics: ios-user-login, android-user-login, missing-data-login")
        sys.exit(1)

    consume_topic(sys.argv[1])
