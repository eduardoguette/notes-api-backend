const express = require('express')
const cors = require('cors')

const logger = require('./loggerMiddleware')

const app = express()
app.use(logger)

app.use(cors())
app.use(express.json())

let notes = [
  {
    id: 1,
    content: 'Crear una API',
    important: true,
  },
  {
    id: 2,
    content: 'Probar la API',
    important: false,
  },
]

app.get('/', (request, response) => {
  response.send('<h1>Appi de notas</h1>')
})

app.get('/api/notes', (request, response) => {
  response.send(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id === id)
  console.log({ note })
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note.content || !note) {
    return response.status(400).json({
      error: 'note.content is missing',
    })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important != 'undefined' ? note.important : false,
  }
  notes = notes.concat(newNote)

  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found',
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
