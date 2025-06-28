import express from 'express'
import clientsRoute from './presentation/routes/clients-route'
import invoicesRoute from './presentation/routes/invoices-route'

const app = express()
app.use(express.json());

app.use('/clients', clientsRoute)
app.use('/invoices', invoicesRoute)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running in port ${port}`)
})
