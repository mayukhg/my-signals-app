#!/bin/bash
# startup.sh

echo "====================================================="
echo " Starting Agentic Strategic Command Center"
echo "====================================================="

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "Error: Node.js is not installed. Please run 'brew install node'."
    exit 1
fi

# Navigate to script directory just in case it's run from elsewhere
cd "$(dirname "$0")"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the server in the background
echo "Starting Vite dev server..."
npm run dev > server.log 2>&1 &
PID=$!
echo $PID > .server.pid

echo "Server started successfully with PID $PID!"
echo "Initializing..."
sleep 3
echo "The application is running at: http://localhost:5173/my-signals-app/"
echo "(View server.log for full output)"
