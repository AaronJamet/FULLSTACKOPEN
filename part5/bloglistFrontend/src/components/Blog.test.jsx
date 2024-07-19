import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

describe('<Blog /> tests', () => {
  const blog = {
    title: 'Test blog name',
    author: 'Test Master',
    url: 'http:www.example.com',
    likes: 32
  }

  test('displays blog name and author by default, but not the url and likes', () => {
    const { container } = render(<Blog blog={blog} />)

    const blogTitleAndAuthor = container.querySelector('#titleAuthorText')
    expect(blogTitleAndAuthor).not.toHaveStyle('display: none')

    const urlLikes = container.querySelector('#detailsText')
    expect(urlLikes).toHaveStyle('display: none')
  })

  test('verify that url and likes are visible when details button is clicked', async () => {
    const { container } = render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = container.querySelector('#detailsButton')
    await user.click(button)

    const urlLikes = container.querySelector('#detailsText')
    expect(urlLikes).not.toHaveStyle('display: none')
  })

  test('verify that updateLikes method is called 2 times after 2 clicks', async () => {
    const mockHandler = vi.fn()

    const { container } = render(<Blog blog={blog} updateLikes={mockHandler} />)

    const user = userEvent.setup()
    const button = container.querySelector('#detailsButton')
    await user.click(button)

    const likesButton = container.querySelector('#likesButton')
    await user.click(likesButton)
    await user.click(likesButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})