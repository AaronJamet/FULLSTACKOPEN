const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  const textboxes = await page.getByRole('textbox').all()
  await textboxes[0].fill(username)
  await textboxes[1].fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const addBlog = async (page, name, author) => {
  await page.getByRole('button', { name: 'Create new blog' }).click()
  const textboxes = await page.getByRole('textbox').all()
  await textboxes[0].fill(name)
  await textboxes[1].fill(author)
  await page.getByRole('button', { name: 'Add Blog' }).click()
  await page.getByRole('button', { name: 'Cancel' }).click()
  await page.getByText(name).waitFor()
}

const giveLikestoBlog2 = async (page) => {
  const blog2 = await page.getByText('blog2')
  const blog2Element = await blog2.locator('..')
  
  await blog2Element.getByRole('button', { name: 'View details' })
    .click()
  await blog2Element.getByRole('button', { name: 'Like' })
    .click()
  await expect(blog2Element.getByText('likes: 1')).toBeVisible() 
  await blog2Element.getByRole('button', { name: 'Like' })
    .click()
  await expect(blog2Element.getByText('likes: 2')).toBeVisible() 
}

const giveLiketoBlog3 = async (page) => {
  const blog3 = await page.getByText('blog3')
  const blog3Element = await blog3.locator('..')

  await blog3Element.getByRole('button', { name: 'View details' })
    .click()
  await blog3Element.getByRole('button', { name: 'Like' })
    .click()
  await expect(blog3Element.getByText('likes: 1')).toBeVisible()
}

export { loginWith, addBlog, giveLikestoBlog2, giveLiketoBlog3 }