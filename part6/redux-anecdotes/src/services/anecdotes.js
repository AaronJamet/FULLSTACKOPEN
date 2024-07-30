import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content: content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const updateAnecdote = async (id) => {
  const oldAnecdote = await getById(id)
  const updatedAnecdote = {...oldAnecdote, votes: oldAnecdote.votes + 1}

  const response = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
  return response.data
}

const anecdotesService = {
  getAll, createNew, getById, updateAnecdote
}

export default anecdotesService