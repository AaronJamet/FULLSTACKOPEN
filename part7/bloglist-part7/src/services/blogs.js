import axios from 'axios'
const baseUrl = 'http://localhost:3008/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const updateBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const oldBlog = await getById(id)
  const updatedBlog = { ...oldBlog, likes: Number(oldBlog.likes) + 1 }

  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return response.data
}

const deleteBlog = async (id, deletedBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

const addComment = async (id, content) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(`${baseUrl}/${id}/comments`, content, config)
  console.log('Response from addComment:', response.data)
  return response.data
}

export default {
  getAll, setToken,
  create, updateBlog, deleteBlog,
  addComment
}