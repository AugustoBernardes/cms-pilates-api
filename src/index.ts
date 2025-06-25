import express from 'express'
import { ClientsRepository } from './infra/repositories/clients-repository'

const app = express()

app.get('/', async (req, res) => {
    const repository = new ClientsRepository()
    const response = await repository.findById('1')
  res.send(response)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running in port ${port}`)
})
