// MINIMAL SERVER.JS FOR TESTING
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Basic middleware
app.use(express.json())

// Test route
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  })
})

// Static files in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist')
  app.use(express.static(clientBuildPath))

  // Simple catch-all
  app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '../client/dist/index.html')
    res.sendFile(indexPath)
  })
}

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`)
})
