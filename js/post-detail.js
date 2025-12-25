// Post Detail Page Handler
class PostDetailHandler {
  constructor() {
    this.currentPostId = this.getPostIdFromUrl()
    this.allPosts = []
  }

  // Extract post ID from URL (from posts/atomic-habits.html → atomic-habits)
  getPostIdFromUrl() {
    const url = window.location.pathname
    const match = url.match(/\/posts\/([^/]+)\.html/)
    return match ? match[1] : null
  }

  // Load posts using PostsManager and render navigation
  async initialize() {
    try {
      // Wait for PostsManager to load all posts
      const PostsManager = window.PostsManager // Declare PostsManager variable
      await PostsManager.loadPosts()
      this.allPosts = PostsManager.posts

      console.log("[v0] Loaded posts:", this.allPosts.length)
      console.log("[v0] Current post ID:", this.currentPostId)

      // Render navigation after posts are loaded
      this.renderPostNavigation()
    } catch (error) {
      console.error("[v0] Error initializing post detail:", error)
    }
  }

  // Render next/previous post links based on category
  renderPostNavigation() {
    if (!this.currentPostId) {
      console.log("[v0] No post ID found")
      return
    }

    // Find current post
    const currentPost = this.allPosts.find((p) => p.id === this.currentPostId)
    if (!currentPost) {
      console.log("[v0] Current post not found in data")
      return
    }

    // Get posts in same category, sorted by date
    const categoryPosts = this.allPosts
      .filter((p) => p.category === currentPost.category)
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    const currentIndex = categoryPosts.findIndex((p) => p.id === this.currentPostId)
    const prevPost = currentIndex > 0 ? categoryPosts[currentIndex - 1] : null
    const nextPost = currentIndex < categoryPosts.length - 1 ? categoryPosts[currentIndex + 1] : null

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

// Initialize on page load - waits for components.js to finish loading
document.addEventListener("DOMContentLoaded", () => {
  // Small delay to ensure PostsManager and components are ready
  setTimeout(() => {
    const handler = new PostDetailHandler()
    handler.initialize()
  }, 100)
})
