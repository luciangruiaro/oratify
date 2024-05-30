#!/bin/bash

# Find the process ID (PID) of oratify.py
PID=$(ps -ef | grep '[c]ratify.py' | awk '{print $2}')

# Check if the PID was found
if [ -z "$PID" ]; then
    echo "oratify.py is not running."
else
    # Kill the process
    kill $PID
    echo "oratify.py has been stopped."
fi