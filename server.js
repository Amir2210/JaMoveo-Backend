import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
//work with tcp protocol
const server = http.createServer(app)

// Express App Config
// Configuring an Express.js application by adding middleware functions to handle cookies and JSON data.
app.use(cookieParser())
//allow us to work with data inside the body of the request
app.use(express.json())


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('public')))
} else {
  const corsOptions = {
    origin: ['http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://localhost:5173'
    ],
    //allows cookies and authorization headers to be sent with requests
    credentials: true
  }
  app.use(cors(corsOptions))
}




app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})
const port = process.env.PORT || 3030
server.listen(port, () => {
  console.log('Server is running on port: ' + port)
})