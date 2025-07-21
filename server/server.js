// PROGRESSIVELY BUILDING SERVER.JS
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import connectDB from './config/db.js'
import { initializeSocket } from './socketHandler.js'
import configureRoutes from './config/configureRoutes.js'

import path from 'path'
import { fileURLToPath } from 'url'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================
// CONNECT TO DATABASE
// ============================
connectDB()

const app = express()
const server = createServer(app)

// ============================
// INITIALIZE SOCKET.IO
// ============================
console.log('🔍 Initializing Socket.IO...')
const io = initializeSocket(server)
console.log('✅ Socket.IO initialized')

// ============================
// BASIC MIDDLEWARE
// ============================
app.use(express.json())
app.use(cookieParser())

// CORS for development only
if (process.env.NODE_ENV !== 'production') {
  const cors = await import('cors')
  app.use(
    cors.default({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    })
  )
  console.log('🔧 CORS enabled for development')
}

// ============================
// STATIC FILES IN PRODUCTION
// ============================
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist')
  app.use(express.static(clientBuildPath))
  console.log('📁 Serving static files from:', clientBuildPath)
}

// ============================
// API ROUTES
// ============================
console.log('🔍 Adding API routes...')
configureRoutes(app)
console.log('✅ API routes added')

// ============================
// CATCH-ALL FOR REACT APP
// ============================
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next()
    }

    // Serve React app
    const indexPath = path.join(__dirname, '../client/dist/index.html')
    res.sendFile(indexPath)
  })
  console.log('✅ React catch-all added')
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(
    `📊 Health check: ${
      process.env.NODE_ENV === 'production' ? '' : 'http://localhost:' + PORT
    }/api/health`
  )
  console.log(
    `🔌 Socket.IO available at: ${
      process.env.NODE_ENV === 'production' ? '' : 'http://localhost:' + PORT
    }/socket.io/`
  )

  if (process.env.NODE_ENV === 'production') {
    console.log('🌐 Production: Frontend and API on same domain')
    console.log('💬 WebSocket: Available on same domain')
  }
})
