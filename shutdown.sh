#!/bin/bash
# shutdown.sh

echo "====================================================="
echo " Shutting down Agentic Strategic Command Center"
echo "====================================================="

# Navigate to script directory
cd "$(dirname "$0")"

if [ -f ".server.pid" ]; then
    PID=$(cat .server.pid)
    
    # Check if process is running
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "Server process (PID $PID) has been stopped."
    else
        echo "Server was not running. Removing stale PID file."
    fi
    rm .server.pid
else
    # Fallback if PID file was deleted
    echo "No PID file found. Attempting to kill any running vite processes..."
    if pkill -f "vite"; then
        echo "Running vite processes have been stopped."
    else
        echo "No running vite processes found."
    fi
fi

echo "Shutdown complete."
