@echo off
echo 🚀 Starting Snappy Eats Application...
echo ==================================

REM Start Backend Server
echo 📡 Starting Backend Server on port 5000...
cd server
start "Backend Server" cmd /c "npm start"

REM Wait for backend to start
timeout /t 5 /nobreak > nul

REM Check if backend is running
curl -s http://localhost:5000/health > nul
if %errorlevel% equ 0 (
    echo ✅ Backend Server is running!
) else (
    echo ❌ Backend Server failed to start
    pause
    exit /b 1
)

REM Start Frontend Server
echo 🎨 Starting Frontend Server...
cd ..
start "Frontend Server" cmd /c "npm run dev"

echo ==================================
echo 🎉 Snappy Eats is now running!
echo 📊 Backend API: http://localhost:5000/api/restaurants
echo 🌐 Frontend App: http://localhost:3000
echo ==================================
echo Press any key to exit...

pause
