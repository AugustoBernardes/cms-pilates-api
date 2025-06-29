import express from 'express'
import * as routes from './presentation/routes'
import { usersMiddleware, automationMiddleware } from './presentation/middlewares';
import cors from 'cors';

const app = express()
app.use(express.json());
app.use(cors())

app.use('/clients',usersMiddleware, routes.clientsRoute)
app.use('/invoices', usersMiddleware , routes.invoicesRoute)
app.use('/months', usersMiddleware, routes.monthsRoute)
app.use('/users', routes.usersRoute)
app.use('/automations', automationMiddleware, routes.automationRoute)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running in port ${port}`)
})
