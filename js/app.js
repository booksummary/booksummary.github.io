// Main Application Logic
const App = {
  async init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.start())
    } else {
      this.start()
    }
  },

  async start() {
    // Load posts
    await window.PostsManager.loadPosts()

    // Initialize components
    this.initHeroSlider()
    this.renderCategorySections()
    this.renderPopularPosts()
    this.renderLatestPosts()
    this.renderSidebarCategories()
    this.renderSidebarLatest()
    this.renderSidebarPopular()
    this.initSearch()
  },

  initHeroSlider() {
    const popularPosts = window.PostsManager.getPopularPosts(6)
    const slider = document.getElementById("heroSlider")
    const dotsContainer = document.getElementById("sliderDots")

    if (popularPosts.length === 0) {
      slider.innerHTML = '<div class="no-posts"><p>No posts available yet. Check back soon!</p></div>'
      return
    }

    // Render slider items
    slider.innerHTML = popularPosts
      .map(
        (post, index) => `
            <div class="slider-item" style="background: linear-gradient(135deg, #ff6b35, #004e89);">
                <img src="${post.image}" alt="${post.title}" class="slider-item-image" onerror="this.style.display='none'">
                <div class="slider-item-overlay">
                    <div class="slider-item-category">${post.category}</div>
                    <div class="slider-item-title">${post.title}</div>
                </div>
            </div>
        `,
      )
      .join("")

    // Render dots
    dotsContainer.innerHTML = popularPosts
      .map((_, index) => `<div class="dot ${index === 0 ? "active" : ""}" data-index="${index}"></div>`)
      .join("")

    // Slider logic
    let currentIndex = 0
    const itemsPerView = 1
    const items = slider.querySelectorAll(".slider-item")
    const dots = dotsContainer.querySelectorAll(".dot")

    const updateSlider = (index) => {
      currentIndex = (index + items.length) % items.length
      slider.scrollLeft = currentIndex * (slider.clientWidth / itemsPerView)

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex)
      })
    }

    // Auto-advance slider every 5 seconds
    let autoSlideInterval = setInterval(() => {
      updateSlider(currentIndex + 1)
    }, 5000)

    // Button handlers
    document.getElementById("prevBtn").addEventListener("click", () => {
      clearInterval(autoSlideInterval)
      updateSlider(currentIndex - 1)
      autoSlideInterval = setInterval(() => {
        updateSlider(currentIndex + 1)
      }, 5000)
    })

    document.getElementById("nextBtn").addEventListener("click", () => {
      clearInterval(autoSlideInterval)
      updateSlider(currentIndex + 1)
      autoSlideInterval = setInterval(() => {
        updateSlider(currentIndex + 1)
      }, 5000)
    })

    // Dot handlers
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        clearInterval(autoSlideInterval)
        updateSlider(Number.parseInt(dot.dataset.index))
        autoSlideInterval = setInterval(() => {
          updateSlider(currentIndex + 1)
        }, 5000)
      })
    })
  },

  renderCategorySections() {
    const container = document.getElementById("category-sections")
    const categories = window.PostsManager.getAllCategories()

    if (categories.length === 0) {
      container.innerHTML = '<div class="no-posts"><p>No posts available yet.</p></div>'
      return
    }

    container.innerHTML = categories
      .map((category) => {
        const posts = window.PostsManager.getPostsByCategory(category).slice(0, 6)

        return `
                <section class="category-section" id="category-${category.toLowerCase().replace(/\s+/g, "-")}">
                    <div class="category-header">
                        <h2>${category}</h2>
                        <span class="category-tag">${posts.length} posts</span>
                    </div>
                    <div class="posts-grid">
                        ${posts.map((post) => this.renderPostCard(post)).join("")}
                    </div>
                </section>
            `
      })
      .join("")
  },

  renderPostCard(post) {
    return `
            <article class="post-card">
                <img src="${post.image}" alt="${post.title}" class="post-image" onerror="this.style.background='linear-gradient(135deg, #ff6b35, #004e89)'">
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                        <span class="post-views">👁️ ${post.views || 0}</span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <p class="post-author">by ${post.author}</p>
                </div>
            </article>
        `
  },

  renderPopularPosts() {
    const container = document.getElementById("popularPosts")
    const posts = window.PostsManager.getPopularPosts(5)

    if (posts.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">No posts yet</p>'
      return
    }

    container.innerHTML = posts
      .map(
        (post) => `
            <div class="widget-item">
                <div class="widget-item-title">${post.title}</div>
                <div class="widget-item-meta">${post.category} • ${post.views || 0} views</div>
            </div>
        `,
      )
      .join("")
  },

  renderLatestPosts() {
    const container = document.getElementById("latestPosts")
    const posts = window.PostsManager.getLatestPosts(5)

    if (posts.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">No posts yet</p>'
      return
    }

    container.innerHTML = posts
      .map(
        (post) => `
            <div class="widget-item">
                <div class="widget-item-title">${post.title}</div>
                <div class="widget-item-meta">${new Date(post.date).toLocaleDateString()}</div>
            </div>
        `,
      )
      .join("")
  },

  renderSidebarCategories() {
    const container = document.getElementById("sidebarCategories")
    const categories = window.PostsManager.getAllCategories()

    if (categories.length === 0) {
      container.innerHTML = '<li><span style="color: var(--text-secondary);">No categories yet</span></li>'
      return
    }

    container.innerHTML = categories
      .map((category) => {
        const count = window.PostsManager.getPostsByCategory(category).length
        return `
                <li>
                    <a href="#category-${category.toLowerCase().replace(/\s+/g, "-")}">
                        <span>${category}</span>
                        <span style="color: var(--accent-primary); font-weight: 600;">${count}</span>
                    </a>
                </li>
            `
      })
      .join("")
  },

  renderSidebarLatest() {
    const container = document.getElementById("latestSummaries")
    const posts = window.PostsManager.getLatestPosts(5)

    if (posts.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">No posts yet</p>'
      return
    }

    container.innerHTML = posts
      .map(
        (post) => `
            <div class="summary-item">
                <div class="summary-item-title">${post.title}</div>
                <div class="summary-item-meta">${new Date(post.date).toLocaleDateString()}</div>
            </div>
        `,
      )
      .join("")
  },

  renderSidebarPopular() {
    const container = document.getElementById("popularSummaries")
    const posts = window.PostsManager.getPopularPosts(5)

    if (posts.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">No posts yet</p>'
      return
    }

    container.innerHTML = posts
      .map(
        (post) => `
            <div class="summary-item">
                <div class="summary-item-title">${post.title}</div>
                <div class="summary-item-meta">${post.views || 0} views</div>
            </div>
        `,
      )
      .join("")
  },

  initSearch() {
    const searchInput = document.getElementById("searchInput")
    if (!searchInput) return

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim()

      if (query.length === 0) {
        this.renderCategorySections()
        return
      }

      const filtered = window.PostsManager.posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query),
      )

      const container = document.getElementById("category-sections")

      if (filtered.length === 0) {
        container.innerHTML = '<div class="no-posts"><p>No posts found matching your search.</p></div>'
        return
      }

      container.innerHTML = `
                <section class="category-section">
                    <div class="category-header">
                        <h2>Search Results</h2>
                        <span class="category-tag">${filtered.length} found</span>
                    </div>
                    <div class="posts-grid">
                        ${filtered.map((post) => this.renderPostCard(post)).join("")}
                    </div>
                </section>
            `
    })
  },
}

// Start the app
App.init()
