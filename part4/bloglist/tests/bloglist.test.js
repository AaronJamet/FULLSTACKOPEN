const { test, describe } = require('node:test')
const assert = require('node:assert')
const totalLikes = require('../utils/list_helper').totalLikes
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes

const listWithOneBlog = [ 
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  } 
]

const listWithMultipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

describe('total likes in all blogs', () => {
  test('de la lista vacia es cero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  test('cuando la lista solo tiene un blog es igual a los likes de este', () => {
    assert.strictEqual(totalLikes(listWithOneBlog), 5)
  })

  test('de una lista mas grande se calcula la suma exacta', () => {
    assert.strictEqual(totalLikes(listWithMultipleBlogs), 36)
  })
})

describe('favorite blogs based in likes', () => {
  test('si lista es vacia el resultado es null', () => {
    assert.deepStrictEqual(favoriteBlog([]), null)
  })

  test('si solo hay un blog el resultado es el mismo', () => {
    assert.deepStrictEqual(favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })

  test('de una lista con varios blogs se devuelve el que mas likes tiene', () => {
    assert.deepStrictEqual(favoriteBlog(listWithMultipleBlogs), listWithMultipleBlogs[2])
  })
})

describe('author with articles in most blogs', () => {
  test('si lista es vacia el resultado es no authors', () => {
    assert.deepStrictEqual(mostBlogs([]), 'no authors')
  })

  test('si solo hay un blog el resultado es su autor y un blog', () => {
    assert.deepStrictEqual(mostBlogs(listWithOneBlog), 
                            [{ author: 'Edsger W. Dijkstra',
                               blogs: 1 
                            }])
  })

  test('de una lista con varios blogs se devuelve el autor que mas aparece y la cantidad de blogs donde sale', () => {
    assert.deepStrictEqual(mostBlogs(listWithMultipleBlogs),
                            [{ author: 'Robert C. Martin',
                               blogs: 3 
                            }])
  })
})

describe('author with most number of likes', () => {
  test('si lista es vacia el resultado es no blogs', () => {
    assert.deepStrictEqual(mostLikes([]), 'no blogs')
  })

  test('si solo hay un blog el resultado es su autor y sus likes', () => {
    assert.deepStrictEqual(mostLikes(listWithOneBlog), 
                            [{ author: 'Edsger W. Dijkstra',
                               likes: 5
                            }])
  })

  test('de una lista con varios blogs se devuelve el autor y el total de likes de todos sus blogs', () => {
    assert.deepStrictEqual(mostLikes(listWithMultipleBlogs),
                            [{ author: 'Edsger W. Dijkstra',
                               likes: 17 
                            }])
  })
})