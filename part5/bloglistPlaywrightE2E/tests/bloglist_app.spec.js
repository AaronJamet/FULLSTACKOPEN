const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, addBlog, giveLikestoBlog2, giveLiketoBlog3 } = require('./helper')

describe('Bloglist App', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3008/api/testing/reset')
    await request.post('http://localhost:3008/api/users/', {
      data: {
        name: 'Test Master',
        username: 'test master',
        password: 'cuquito'
      }
    })

    await request.post('http://localhost:3008/api/users/', {
      data: {
        name: 'tester2',
        username: 'tester2',
        password: 'tester2'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const nameInput = page.getByText('username')
    const passwordInput = page.getByText('password') 
    const loginButton = page.getByText('Login')

    await expect(nameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test master', 'cuquito')
  
      await expect(page.getByText('Test Master logged in')).toBeVisible()
    })
  
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'test master', 'malpassword')
  
      const errorDiv = await page.locator('.errorMessage')
      await expect(errorDiv).toContainText('Wrong/invalid credentials, cannot login')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      // in Playwright, colors must be defined using RGB codes
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  
      await expect(page.getByText('Test Master logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({page}) => {
      await loginWith(page, 'test master', 'cuquito')
    })

    test('a new blog can be created', async ({page}) => {
      await addBlog(page, 'a blog created by playwright', 'Test Master', true) 
      await expect(page.getByText('a blog created by playwright')).toBeVisible()
    })

    test('an existing blog can be updated with like button', async ({page}) => {
      await addBlog(page, 'a second blog created by playwright', 'Test Master', true) 
      const newBlog = await page.getByText('a second blog created by playwright')

      const blogElement = await newBlog.locator('..')

      await blogElement.getByRole('button', { name: 'View details' })
        .click()
      await blogElement.getByRole('button', { name: 'Like' })
        .click()  
      await expect(page.getByText('likes: 1')).toBeVisible()
    })

    describe('and a created blog exists', () => {
      beforeEach(async ({page}) => {
        await addBlog(page, 'a blog created by playwright', 'Test Master', true)
      })

      test('a blog can be deleted by the user that created it', async ({page}) => {      
        // event listener for the window.confirm dialogue, 
        // clicks on accept when it shows up
        page.on('dialog', async (alert) => await alert.accept())
        
        await page.getByRole('button', { name: 'View details' })
          .click()
        await page.getByRole('button', { name: 'Delete blog' })
          .click()  

        await expect(page.getByText('a blog created by playwright')).not.toBeVisible()  
        await expect(page.getByText('Blog has been deleted correctly')).toBeVisible()
      })

      test('delete button in blog post can only be viewed by its logged author', async ({page}) => {
        await page.getByRole('button', { name: 'Logout' }).click()
        await loginWith(page, 'tester2', 'tester2')

        await page.getByRole('button', { name: 'View details' })
          .click()
        await expect(page.getByRole('button', { name: 'Delete blog' })).not.toBeVisible()
      })
    })  
  
    describe('and a few blogs with likes exists', () => {
      beforeEach(async ({page}) => {
        await addBlog(page, 'blog1', 'Test Master', true)
        await addBlog(page, 'blog2', 'Test Master', true)
        await addBlog(page, 'blog3', 'Test Master', true)

        await giveLikestoBlog2(page)
      })
  
      test('list of blogs displayed is ordered by number of likes', async ({page}) => {      
        // press like button a few times in blog2 and one time in blog3
        const blog1 = await page.getByText('blog1')
        const blog2 = await page.getByText('blog2')
        const blog3 = await page.getByText('blog3')
  
        // Get their positions
        const firstElementBox = await blog1.boundingBox()
        const secondElementBox = await blog2.boundingBox()
        const thirdElementBox = await blog3.boundingBox() 
  
        // verify that blogs with more likes appear higher in the bloglist 
        expect(secondElementBox.y).toBeLessThan(firstElementBox.y)
        expect(secondElementBox.y).toBeLessThan(thirdElementBox.y)
      })
    })
  })   
 
})