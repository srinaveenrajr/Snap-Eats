#!/bin/bash

echo "🚀 Starting Snappy Eats Application..."
echo "=================================="

# Start Backend Server
echo "📡 Starting Backend Server on port 5000..."
cd server && npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend Server is running!"
else
    echo "❌ Backend Server failed to start"
    kill $BACKEND_PID
    exit 1
fi

# Start Frontend Server
echo "🎨 Starting Frontend Server on port 3000..."
cd .. && npm run dev &
FRONTEND_PID=$!

echo "=================================="
echo "🎉 Snappy Eats is now running!"
echo "📊 Backend API: http://localhost:5000/api/restaurants"
echo "🌐 Frontend App: http://localhost:3000"
echo "=================================="
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
