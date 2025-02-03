require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

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

morgan.token('body', (request, response) => {
  if(request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const {id} = request.params
  Person.findById(id).then(person => {
    if (person) {
      return response.json(person)
    }
    else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const {id} = request.params
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const {name, number} = request.body

  if(!name || !number) {
    return response.status(400).json({error: 'missing name or number'})
  } else if (persons.find(person => person.name === name)) {
    return response.status(400).json({error: `name must be unique`})
  }

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('Server running on port ', PORT)
})