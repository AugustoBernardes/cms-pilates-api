import express from 'express'
import clientRoute from './presentation/routes/clients-route'

const app = express()

app.get('/clients', clientRoute)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running in port ${port}`)
})
