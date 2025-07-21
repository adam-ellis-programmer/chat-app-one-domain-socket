// server.js
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import { initializeSocket } from './socketHandler.js'

import passport from 'passport'
import { configurePassport } from './config/passport.js'
import configureRoutes from './config/configureRoutes.js'

import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================
// CONNECT TO DATABASE
// ============================
connectDB()

console.log('🔍 Environment variables check:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log(
  'GOOGLE_CLIENT_ID:',
  process.env.GOOGLE_CLIENT_ID ? 'EXISTS' : 'MISSING'
)
console.log(
  'GOOGLE_CLIENT_SECRET:',
  process.env.GOOGLE_CLIENT_SECRET ? 'EXISTS' : 'MISSING'
)
console.log('--server running--')

// Configure Passport after environment is loaded
// ============================
// CONFIGURE PASSPORT SETUP
// ============================
configurePassport()

const app = express()
const server = createServer(app)

// Initialize Socket.IO
const io = initializeSocket(server)

// ============================
// APP MIDDLEWARE
// ============================
app.use(express.json())
app.use(cookieParser())

// CORS Configuration - Only needed for development
if (process.env.NODE_ENV === 'production') {
  // Production: No CORS needed since everything is on same domain
  console.log('🚀 Running in PRODUCTION mode - CORS disabled (same domain)')
} else {
  // Development: Enable CORS for local development only
  app.use(
    cors({
      origin: [
        'http://localhost:5173', // Development frontend (Vite default)
        'http://localhost:3000', // Alternative dev port (CRA default)
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    })
  )
  console.log('🔧 Running in DEVELOPMENT mode - CORS enabled for localhost')
}

// ============================
// INITIALIZE PASSPORT FOR AUTH
// ============================
app.use(passport.initialize())

// ============================
// PRODUCTION: SERVE STATIC FILES
// ============================
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build
  const clientBuildPath = path.join(__dirname, '../client/dist')
  app.use(express.static(clientBuildPath))

  console.log('📁 Serving static files from:', clientBuildPath)
}

// ============================
// SET UP API ROUTES
// ============================
configureRoutes(app)

// ============================
// PRODUCTION: CATCH-ALL ROUTE FOR REACT APP
// ============================
if (process.env.NODE_ENV === 'production') {
  // Catch all handler: send back React's index.html file
  // Fix: Use a more specific pattern that doesn't confuse path-to-regexp
  app.get('/*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API route not found' })
    }

    const indexPath = path.join(__dirname, '../client/dist/index.html')
    console.log('📄 Serving React app from:', indexPath)
    res.sendFile(indexPath)
  })
}

// ============================
// ERROR / NOT FOUND MIDDLEWARE
// ============================
app.use(notFound)
app.use(errorHandler)

// ============================
// PORT AND SERVER LISTEN
// ============================
const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔌 Socket.IO initialized`)

  if (process.env.NODE_ENV === 'production') {
    console.log('🌐 Production mode: Frontend and API served from same domain')
    console.log('📱 Frontend: Available at root URL')
    console.log('🔗 API: Available at /api/* routes')
  } else {
    console.log('🔧 Development mode: CORS enabled for local frontend')
  }
})
