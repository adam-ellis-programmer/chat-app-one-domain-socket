// routes/index.js
import authRoutes from '../routes/auth.js'
import roomRoutes from '../routes/room.js'
import messageRoutes from '../routes/message.js'

const configureRoutes = (app) => {
  console.log('🔍 Configuring individual routes...')

  try {
    console.log('🔍 Mounting auth routes...')
    app.use('/api/auth', authRoutes)
    console.log('✅ Auth routes mounted')

    console.log('🔍 Mounting room routes...')
    app.use('/api/rooms', roomRoutes)
    console.log('✅ Room routes mounted')

    console.log('🔍 Mounting message routes...')
    app.use('/api/messages', messageRoutes)
    console.log('✅ Message routes mounted')

    console.log('🔍 Adding health check route...')
    // Basic health check route
    app.get('/api/health', (req, res) => {
      res.json({
        message: 'Server is running!',
        environment: process.env.NODE_ENV || null,
        appName: process.env.APP_NAME || null,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        googleConfigured: !!process.env.GOOGLE_CLIENT_ID,
        socketIO: 'enabled',
      })
    })
    console.log('✅ Health check route added')
  } catch (error) {
    console.error('❌ Error in configureRoutes:', error.message)
    throw error
  }
}

export default configureRoutes
