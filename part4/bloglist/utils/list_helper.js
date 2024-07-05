const blog = require("../models/blog")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else if (blogs.length === 1) {
    return blogs[0].likes
  } else {
    const addedLikes = blogs.map(blog => blog.likes)
                            .reduce((a, b) => a + b, 0)
    
    return addedLikes
  }
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  } else if (blogs.length === 1) {
    return blogs[0]
  } else {
    const favBlog = blogs
      .reduce((prev, current) => +prev.likes > +current.likes
                               ? prev : current)
                                    
    return(favBlog)
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 'no authors'
  } else if (blogs.length === 1) {
    // return blog object only with the fields author and one blog
    return [{ 
      author: blogs[0].author,
      blogs: blogs.length
    }]
  } else {
    // find name of author with most posts, and the total of likes he has
    const authors = blogs.map(b => b.author)
                         .reduce((acc, value) => {
                           acc[value] = (acc[value] || 0) + 1 
                           return acc
                         }, {}) 

    const mostRepeatedAuthor = Object.keys(authors)
                                     .sort((a, b) => authors[b] - authors[a])[0]

    const authorBlogs = blogs.filter(b => b.author === mostRepeatedAuthor)
            
    return [{ 
      author: mostRepeatedAuthor,
      blogs: authorBlogs.length
    }]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 'no blogs'
  } else if (blogs.length === 1) {
    // return blog object only with the fields author and likes
    return [{ 
      author: blogs[0].author,
      likes: blogs[0].likes
    }]
  } else {
    // find name of author with most likes, and the total of likes he has
    const maxLikes = blogs
                       .reduce((max, b) => (b.likes > max ? b.likes : max), -Infinity)  

    const favAuthor = blogs.find(b => b.likes === maxLikes)
    const favAuthorBlogs = blogs.filter(b => b.author === favAuthor.author)
    const totalLikes = favAuthorBlogs
                        .map(blog => blog.likes)
                        .reduce((a, b) => a + b, 0)
            
    return [{ 
      author: favAuthor.author,
      likes: totalLikes
    }]
  }
}

module.exports = {
  dummy, 
  totalLikes, 
  favoriteBlog, 
  mostBlogs, 
  mostLikes
}