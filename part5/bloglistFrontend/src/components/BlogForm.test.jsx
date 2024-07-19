import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { expect } from 'chai'

test('<BlogForm /> component calls event handler receive as prop when new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const nameInput = screen.getByPlaceholderText('write blog name here')
  const authorInput = screen.getByPlaceholderText('write blog author here')
  const addBlogButton = screen.getByText('Add Blog')

  await user.type(nameInput, 'blog name test')
  await user.type(authorInput, 'blog author test')
  await user.click(addBlogButton)

  console.log(createBlog.mock.calls)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('blog name test')
  expect(createBlog.mock.calls[0][0].author).toBe('blog author test')
})