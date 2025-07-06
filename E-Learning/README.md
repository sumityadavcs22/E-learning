# E-Learning Management System (LMS)

A comprehensive Learning Management System built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🌟 Features

### For Students:
- 👤 User registration and authentication
- 📚 Browse course catalog
- 🎓 Enroll in courses
- 📖 Access course content and lessons
- 📊 Track learning progress
- 🧪 Take quizzes and assessments
- 👨‍🎓 Personal dashboard

### For Administrators:
- 🔐 Admin dashboard
- 👥 User management
- 📑 Course management
- 📈 Analytics and reporting
- ⚙️ System settings

### Technical Features:
- 🔒 JWT-based authentication
- 📱 Responsive design
- 🌙 Dark/Light theme support
- 🚀 RESTful API
- 📁 File upload support
- 🔄 Real-time updates

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router DOM, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with in-memory fallback for development)
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** CSS3 with custom themes

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (optional - development mode works without it)

## 🚀 Quick Start

### Option 1: Development Mode (Recommended for testing)

This mode runs without requiring MongoDB installation:

```bash
# Clone the repository
git clone <your-repo-url>
cd E-Learning

# Install all dependencies
npm run install-all

# Start in development mode (no MongoDB required)
npm run dev-simple
```

### Option 2: Full Production Mode

This mode requires MongoDB:

```bash
# Clone the repository
git clone <your-repo-url>
cd E-Learning

# Install all dependencies
npm run install-all

# Make sure MongoDB is running
# Then start the full application
npm run dev
```

## 📁 Project Structure

```
E-Learning/
├── Backend/                 # Server-side application
│   ├── middleware/          # Express middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── uploads/            # File upload directory
│   ├── server.js           # Main server file
│   ├── server-dev.js       # Development server (no MongoDB)
│   └── package.json        # Backend dependencies
├── Frontend/
│   └── learn/              # React application
│       ├── public/         # Static assets
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── context/    # React context providers
│       │   ├── styles/     # CSS stylesheets
│       │   └── utils/      # Utility functions
│       └── package.json    # Frontend dependencies
├── package.json            # Root package.json
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# MongoDB Connection (optional in dev mode)
MONGODB_URI=mongodb://localhost:27017/lms

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 👤 Default Test Accounts

When running in development mode, the following test accounts are automatically created:

### Administrator
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** Admin

### Student
- **Email:** student@example.com
- **Password:** student123
- **Role:** Student

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get specific course
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/enrolled` - Get enrolled courses

### Users (Admin only)
- `GET /api/users` - Get all users

### System
- `GET /api/health` - Health check endpoint

## 🎯 Usage

1. **Start the application:**
   ```bash
   npm run dev-simple
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

3. **Login with test accounts:**
   - Use the default test accounts provided above

4. **Explore features:**
   - Browse courses as a student
   - Enroll in courses
   - Access admin features with admin account

## 🔨 Development Commands

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend (development mode)
npm run dev-simple

# Start both frontend and backend (with MongoDB)
npm run dev

# Start only backend (development mode)
npm run server-dev

# Start only backend (with MongoDB)
npm run server

# Start only frontend
npm run client

# Build frontend for production
npm run build
```

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use:**
   - Backend runs on port 5000
   - Frontend runs on port 3000
   - Make sure these ports are available

2. **MongoDB connection issues:**
   - Use development mode (`npm run dev-simple`) which doesn't require MongoDB
   - Or ensure MongoDB is installed and running

3. **CORS errors:**
   - Check that frontend environment variable points to correct backend URL
   - Ensure both frontend and backend are running

4. **Dependencies not found:**
   - Run `npm run install-all` to install all dependencies

## 🚀 Deployment

### Frontend Deployment
```bash
cd Frontend/learn
npm run build
# Deploy the build folder to your hosting service
```

### Backend Deployment
- Set environment variables in your hosting service
- Ensure MongoDB is available in production
- Use `npm start` to run the production server

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any problems or have questions:

1. Check the troubleshooting section above
2. Ensure all dependencies are properly installed
3. Verify that all environment variables are set correctly
4. Check that required ports (3000, 5000) are available

## 📊 Current Status

✅ **Working Features:**
- User authentication and registration
- Course browsing and enrollment
- Basic admin functionality
- Responsive design
- Development mode without MongoDB

🚧 **In Development:**
- Advanced quiz functionality
- File upload for course materials
- Enhanced admin dashboard
- Email notifications
- Progress tracking

---

Made with ❤️ using MERN Stack