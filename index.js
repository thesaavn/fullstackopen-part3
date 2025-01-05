const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  { 
    "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const {id} = request.params
  const person = persons.find(person => person.id === id)
  
  if (person) {
    return response.json(person)
  }
  
  response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const {id} = request.params
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const id = String(Math.floor(Math.random() * 10000000))
  const {name, number} = request.body

  if(!name || !number) {
    return response.status(400).json({error: 'missing name or number'})
  } else if (persons.find(person => person.name === name)) {
    return response.status(400).json({error: `name must be unique`})
  }

  const newPerson = {id, name, number}
  persons = [...persons, newPerson]
  response.json(newPerson)
})

const PORT = 3001

app.listen(PORT, () => {
  console.log('Server running on ', PORT)
})