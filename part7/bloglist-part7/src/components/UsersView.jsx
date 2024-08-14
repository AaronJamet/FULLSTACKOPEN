import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useMatch,
  Routes, Route, Link
} from 'react-router-dom'
import { fetchAllUsers } from '../reducers/userReducer'
import UserDetail from './UserDetail'
import {
  Table, TableHead, TableBody, TableCell,
  TableContainer, TableRow, Paper
} from '@mui/material'

const UsersView = () => {
  const dispacth = useDispatch()
  const users = useSelector(state => state.user.allUsers)

  useEffect(() => {
    dispacth(fetchAllUsers())
  }, [dispacth])

  const match = useMatch('users/:id')
  const user = match
    ? users.find(user => user.id === Number(match.params.id))
    : null

  if (!users.length) {
    return <div>Loading users...</div>
  }

  return(
    <div>
      <h2>Users</h2>
      <Routes>
        <Route
          path="/"
          element={
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2}><strong>blogs created</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell><Link to={`/users/${user.id}`}>{user.name}</Link></TableCell>
                      <TableCell>{user.blogs.length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          }
        />

        <Route path=':id' element={<UserDetail />} />
      </Routes>
    </div>
  )
}

export default UsersView