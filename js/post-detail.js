// Post Detail Page Handler
class PostDetailHandler {
  constructor() {
    this.currentPostId = this.getPostIdFromUrl()
    this.allPosts = []
  }

  // Extract post ID from URL
  getPostIdFromUrl() {
    const url = window.location.pathname
    const match = url.match(/\/posts\/([^/]+)\.html/)
    return match ? match[1] : null
  }

  // Load all posts and display navigation
  async initialize() {
    const PostsManager = {
      loadPosts: async () => {
        // Simulate loading posts
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, 1000)
        })
      },
      posts: [
        { id: "1", title: "First Post" },
        { id: "2", title: "Second Post" },
        { id: "3", title: "Third Post" },
      ],
    }
    await PostsManager.loadPosts()
    this.allPosts = PostsManager.posts
    this.renderPostNavigation()
  }

  // Render next/previous post links
  renderPostNavigation() {
    const currentIndex = this.allPosts.findIndex((p) => p.id === this.currentPostId)

    if (currentIndex === -1) {
      console.log("[v0] Post not found in data")
      return
    }

    const prevPost = currentIndex > 0 ? this.allPosts[currentIndex - 1] : null
    const nextPost = currentIndex < this.allPosts.length - 1 ? this.allPosts[currentIndex + 1] : null

    const navHTML = `
      <div class="post-nav-wrapper">
        ${
          prevPost
            ? `
          <a href="./${prevPost.id}.html" class="post-nav-link post-nav-prev">
            <span class="post-nav-arrow">←</span>
            <div class="post-nav-content">
              <span class="post-nav-label">Previous Post</span>
              <span class="post-nav-title">${this.escapeHtml(prevPost.title)}</span>
            </div>
          </a>
        `
            : '<div class="post-nav-link post-nav-prev disabled"></div>'
        }
        
        ${
          nextPost
            ? `
          <a href="./${nextPost.id}.html" class="post-nav-link post-nav-next">
            <div class="post-nav-content">
              <span class="post-nav-label">Next Post</span>
              <span class="post-nav-title">${this.escapeHtml(nextPost.title)}</span>
            </div>
            <span class="post-nav-arrow">→</span>
          </a>
        `
            : '<div class="post-nav-link post-nav-next disabled"></div>'
        }
      </div>
    `

    const navContainer = document.getElementById("postNavigation")
    if (navContainer) {
      navContainer.innerHTML = navHTML
    }
  }

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  const handler = new PostDetailHandler()
  handler.initialize()
})
