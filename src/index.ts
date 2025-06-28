import express from 'express'
import * as routes from './presentation/routes'

const app = express()
app.use(express.json());

app.use('/clients', routes.clientsRoute.default)
app.use('/invoices', routes.invoicesRoute.default)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running in port ${port}`)
})
