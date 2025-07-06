#!/bin/bash

echo "🚀 Starting E-Learning Management System..."
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-all
    echo ""
fi

if [ ! -d "Backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd Backend && npm install && cd ..
    echo ""
fi

if [ ! -d "Frontend/learn/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd Frontend/learn && npm install && cd ../..
    echo ""
fi

echo "✅ All dependencies are installed"
echo ""

echo "🎯 Starting the application in development mode..."
echo "   Backend will run on: http://localhost:5000"
echo "   Frontend will run on: http://localhost:3000"
echo ""
echo "👤 Test Accounts:"
echo "   Admin: admin@example.com / admin123"
echo "   Student: student@example.com / student123"
echo ""
echo "⚠️  Press Ctrl+C to stop the application"
echo ""

# Start the application
npm run dev-simple