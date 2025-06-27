import express from 'express'
import clientsRoute from './presentation/routes/clients-route'

const app = express()
app.use(express.json());

app.use('/clients', clientsRoute)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running in port ${port}`)
})
