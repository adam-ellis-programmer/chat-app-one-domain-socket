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

    // OAuth required pages - Privacy Policy
    console.log('🔍 Adding privacy policy route...')
    app.get('/privacy', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Privacy Policy</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            h1 { color: #333; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Privacy Policy</h1>
          <p>We collect basic profile information when you sign in with Google to provide our chat service.</p>
          <p>Contact: thechatappcompany@gmail.com</p>
        </body>
        </html>
      `)
    })
    console.log('✅ Privacy policy route added')

    // OAuth required pages - Terms of Service
    console.log('🔍 Adding terms of service route...')
    app.get('/terms', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Terms of Service</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            h1 { color: #333; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Terms of Service</h1>
          <p>By using our chat application, you agree to use it responsibly and follow applicable laws.</p>
          <p>Contact: thechatappcompany@gmail.com</p>
        </body>
        </html>
      `)
    })
    console.log('✅ Terms of service route added')
  } catch (error) {
    console.error('❌ Error in configureRoutes:', error.message)
    throw error
  }
}

export default configureRoutes
