// Main Application Controller
const App = {
  // Application state
  state: {
    isInitialized: false,
    isLoading: true,
  },

  // Initialize application
  init: () => {
    if (App.state.isInitialized) return

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", App.onDOMReady)
    } else {
      App.onDOMReady()
    }
  },

  // Handle DOM ready
  onDOMReady: () => {
    // Show loading state after DOM is ready
    App.showLoadingState()

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons()
    }

    // Initialize all controllers
    App.initializeControllers()

    // Wait for window load for complete initialization
    if (document.readyState === "complete") {
      App.onWindowLoad()
    } else {
      window.addEventListener("load", App.onWindowLoad)
    }
  },

  // Handle window load
  onWindowLoad: () => {
    App.hideLoadingState()
    App.initializePostLoad()
    App.state.isInitialized = true

    // Log initialization
    console.log("🚀 Jaydeep Vasoya Portfolio - Loaded Successfully!")
    console.log("📱 Flutter Developer | Mobile App Specialist")
    console.log("💼 Available for freelance projects and collaborations")
    console.log("📧 Contact: jaydeepvasoya88@gmail.com")
  },

  // Initialize all controllers
  initializeControllers: () => {
    try {
      // Check if dependencies are loaded
      if (!window.Utils) {
        console.error("Utils not loaded")
        return
      }

      // Initialize navigation
      if (window.NavigationController) {
        window.NavigationController.init()
      }

      // Initialize animations
      if (window.AnimationController) {
        window.AnimationController.init()
      }

      // Initialize contact functionality
      if (window.ContactController) {
        window.ContactController.init()
      }

      // Initialize other features
      App.initializeFeatures()
    } catch (error) {
      console.error("Error initializing controllers:", error)
    }
  },

  // Initialize additional features
  initializeFeatures: () => {
    // Initialize image preloading
    App.preloadImages()

    // Initialize error handling
    App.initializeErrorHandling()

    // Initialize performance monitoring
    App.initializePerformanceMonitoring()

    // Initialize accessibility features
    App.initializeAccessibility()
  },

  // Initialize post-load features
  initializePostLoad: () => {
    // Initialize lazy loading
    App.initializeLazyLoading()

    // Initialize service worker (if available)
    App.initializeServiceWorker()
  },

  // Show loading state
  showLoadingState: () => {
    if (document.body) {
      document.body.style.opacity = "0"
      document.body.style.transition = "opacity 0.5s ease"
    }
  },

  // Hide loading state
  hideLoadingState: () => {
    setTimeout(() => {
      if (document.body) {
        document.body.style.opacity = "1"
        App.state.isLoading = false
      }
    }, 100)
  },

  // Preload images
  preloadImages: () => {
    const images = [
      "/placeholder.svg?height=300&width=300&text=Jaydeep+Vasoya",
      "/placeholder.svg?height=300&width=300&text=🎮+IDLE+Billionaire",
    ]

    images.forEach((src) => {
      const img = new Image()
      img.src = src
      img.onload = () => console.log(`Preloaded: ${src}`)
      img.onerror = () => console.warn(`Failed to preload: ${src}`)
    })
  },

  // Initialize error handling
  initializeErrorHandling: () => {
    // Global error handler
    window.Utils.events.on(window, "error", (e) => {
      console.error("Global error:", e.error)
      // Could send to error reporting service
    })

    // Unhandled promise rejection handler
    window.Utils.events.on(window, "unhandledrejection", (e) => {
      console.error("Unhandled promise rejection:", e.reason)
      e.preventDefault()
    })
  },

  // Initialize performance monitoring
  initializePerformanceMonitoring: () => {
    // Monitor page load performance
    if ("performance" in window) {
      window.Utils.events.on(window, "load", () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType("navigation")[0]
          if (perfData) {
            console.log("Page Load Performance:", {
              domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
              loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
              totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
            })
          }
        }, 0)
      })
    }
  },

  // Initialize accessibility features
  initializeAccessibility: () => {
    // Add skip link
    App.addSkipLink()

    // Initialize keyboard navigation
    App.initializeKeyboardNavigation()

    // Initialize focus management
    App.initializeFocusManagement()

    // Initialize ARIA live regions
    App.initializeAriaLiveRegions()
  },

  // Add skip link for accessibility
  addSkipLink: () => {
    const skipLink = document.createElement("a")
    skipLink.href = "#main-content"
    skipLink.textContent = "Skip to main content"
    skipLink.className = "skip-link"
    skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `

    window.Utils.events.on(skipLink, "focus", () => {
      skipLink.style.top = "6px"
    })

    window.Utils.events.on(skipLink, "blur", () => {
      skipLink.style.top = "-40px"
    })

    document.body.insertBefore(skipLink, document.body.firstChild)

    // Add main content ID
    const heroSection = window.Utils.dom.getElementById("home")
    if (heroSection) {
      heroSection.id = "main-content"
      heroSection.setAttribute("tabindex", "-1")
    }
  },

  // Initialize keyboard navigation
  initializeKeyboardNavigation: () => {
    // Handle escape key for closing modals/menus
    window.Utils.events.on(document, "keydown", (e) => {
      if (e.key === "Escape") {
        // Close mobile menu if open
        if (window.NavigationController.mobileMenuOpen) {
          window.NavigationController.closeMobileMenu()
        }
      }
    })

    // Handle tab navigation
    window.Utils.events.on(document, "keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation")
      }
    })

    window.Utils.events.on(document, "mousedown", () => {
      document.body.classList.remove("keyboard-navigation")
    })
  },

  // Initialize focus management
  initializeFocusManagement: () => {
    // Add focus styles for keyboard navigation
    const style = document.createElement("style")
    style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid #60a5fa !important;
                outline-offset: 2px !important;
            }
            
            .keyboard-navigation .btn:focus {
                box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.5) !important;
            }
        `
    document.head.appendChild(style)
  },

  // Initialize ARIA live regions
  initializeAriaLiveRegions: () => {
    // Create live region for announcements
    const liveRegion = document.createElement("div")
    liveRegion.setAttribute("aria-live", "polite")
    liveRegion.setAttribute("aria-atomic", "true")
    liveRegion.className = "sr-only"
    liveRegion.id = "live-region"
    liveRegion.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `
    document.body.appendChild(liveRegion)

    // Function to announce messages
    window.announceToScreenReader = (message) => {
      const liveRegion = window.Utils.dom.getElementById("live-region")
      if (liveRegion) {
        window.Utils.dom.setContent(liveRegion, message)
        setTimeout(() => {
          window.Utils.dom.setContent(liveRegion, "")
        }, 1000)
      }
    }
  },

  // Initialize lazy loading
  initializeLazyLoading: () => {
    if ("IntersectionObserver" in window) {
      const lazyImages = window.Utils.dom.querySelectorAll("img[data-src]")

      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            img.removeAttribute("data-src")
            imageObserver.unobserve(img)
          }
        })
      })

      lazyImages.forEach((img) => imageObserver.observe(img))
    }
  },

  // Initialize service worker
  initializeServiceWorker: () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration)
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error)
        })
    }
  },

  // Handle application errors
  handleError: (error, context = "Unknown") => {
    console.error(`Error in ${context}:`, error)

    // Show user-friendly error message
    if (window.ContactController.showMessage) {
      window.ContactController.showMessage("Something went wrong. Please try again.", "error")
    }
  },

  // Get application info
  getInfo: () => {
    return {
      name: "Jaydeep Vasoya Portfolio",
      version: "1.0.0",
      author: "Jaydeep Vasoya",
      initialized: App.state.isInitialized,
      loading: App.state.isLoading,
    }
  },
}

// Initialize application when script loads
App.init()

// Export App to global scope for debugging
window.App = App

// Add some useful global functions
window.scrollToSection = window.NavigationController.scrollToSection
window.toggleMobileMenu = window.NavigationController.toggleMobileMenu
