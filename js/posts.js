// Post data structure - stored in JSON files per category
const CATEGORIES = [
  "Personal Development & Self-Improvement",
  "Business & Entrepreneurship",
  "Productivity & Time Management",
  "Psychology & Mindfulness",
  "Finance & Investing",
  "Health & Wellness",
  "History & Biography",
  "Science & Technology",
]

// Post interface for data
class Post {
  constructor(id, title, category, image, excerpt, author, date, views = 0) {
    this.id = id
    this.title = title
    this.category = category
    this.image = image
    this.excerpt = excerpt
    this.author = author
    this.date = date
    this.views = views
  }
}

// Posts Manager
const PostsManager = {
  posts: [],

  async loadPosts() {
    // Load all posts from category JSON files
    for (const category of CATEGORIES) {
      try {
        const response = await fetch(`data/posts/${category.toLowerCase().replace(/\s+/g, "-")}.json`)
        if (response.ok) {
          const posts = await response.json()
          this.posts = [...this.posts, ...posts]
        }
      } catch (error) {
        // Silently skip if file doesn't exist
      }
    }
    return this.posts
  },

  getPostsByCategory(category) {
    return this.posts.filter((post) => post.category === category)
  },

  getPopularPosts(limit = 5) {
    return [...this.posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit)
  },

  getLatestPosts(limit = 5) {
    return [...this.posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit)
  },

  getAllCategories() {
    return [...new Set(this.posts.map((post) => post.category))]
  },
}
