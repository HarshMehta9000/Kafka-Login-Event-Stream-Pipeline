"""
Login Event Router
Consumes raw login events from the 'user-login' topic, transforms timestamps,
and routes messages to platform-specific topics based on device_type.

Routing:
    device_type == "iOS"     → ios-user-login
    device_type == "android" → android-user-login
    missing fields           → missing-data-login
"""

from confluent_kafka import Consumer, Producer, KafkaError
from datetime import datetime
import json
import sys

BOOTSTRAP = "localhost:29092"

# Source topic
SOURCE_TOPIC = "user-login"

# Destination topics
TOPICS = {
    "iOS": "ios-user-login",
    "android": "android-user-login",
    "missing": "missing-data-login",
}

EXPECTED_FIELDS = 7


def create_consumer():
    return Consumer({
        "bootstrap.servers": BOOTSTRAP,
        "group.id": "login-router",
        "auto.offset.reset": "earliest",
    })


def create_producer():
    return Producer({"bootstrap.servers": BOOTSTRAP})


def route_message(raw: dict, producer: Producer):
    """Route a single login event to the appropriate topic."""

    # Missing fields → missing-data topic
    if len(raw) != EXPECTED_FIELDS:
        producer.produce(TOPICS["missing"], value=json.dumps(raw))
        print(f"[MISSING]  {raw}")
        return

    # Null user_id → skip entirely
    if raw.get("user_id") is None:
        return

    # Transform timestamp
    raw["timestamp"] = str(datetime.fromtimestamp(raw["timestamp"]))

    device = raw.get("device_type", "")
    topic = TOPICS.get(device, TOPICS["missing"])

    producer.produce(topic, value=json.dumps(raw))
    print(f"[{device.upper():>7s}]  user={raw['user_id']}  time={raw['timestamp']}")


def main():
    consumer = create_consumer()
    producer = create_producer()
    consumer.subscribe([SOURCE_TOPIC])

    print(f"Router listening on '{SOURCE_TOPIC}' → routing to {list(TOPICS.values())}")
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

            raw = json.loads(msg.value().decode("utf-8"))
            route_message(raw, producer)
            producer.flush()

    except KeyboardInterrupt:
        print("\nShutting down router.")
    finally:
        consumer.close()


if __name__ == "__main__":
    main()
