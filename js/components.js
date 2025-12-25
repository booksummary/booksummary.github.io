// Load Header Component
async function loadHeader() {
  try {
    const response = await fetch("header.html")
    const html = await response.text()
    document.getElementById("header-container").innerHTML = html
  } catch (error) {
    console.error("Error loading header:", error)
  }
}

// Load Sidebar Component
async function loadSidebar() {
  try {
    const response = await fetch("sidebar.html")
    const html = await response.text()
    document.getElementById("sidebar-container").innerHTML = html
  } catch (error) {
    console.error("Error loading sidebar:", error)
  }
}

// Load Footer Component
async function loadFooter() {
  try {
    const response = await fetch("footer.html")
    const html = await response.text()
    document.getElementById("footer-container").innerHTML = html
  } catch (error) {
    console.error("Error loading footer:", error)
  }
}

// Initialize Components
document.addEventListener("DOMContentLoaded", () => {
  loadHeader()
  loadSidebar()
  loadFooter()
})
