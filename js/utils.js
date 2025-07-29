// Utility Functions
const Utils = {
  // DOM manipulation utilities
  dom: {
    // Get element by ID
    getElementById: (id) => document.getElementById(id),

    // Get elements by class name
    getElementsByClassName: (className) => document.getElementsByClassName(className),

    // Get elements by query selector
    querySelector: (selector) => document.querySelector(selector),

    // Get elements by query selector all
    querySelectorAll: (selector) => document.querySelectorAll(selector),

    // Add class to element
    addClass: (element, className) => {
      if (element) element.classList.add(className)
    },

    // Remove class from element
    removeClass: (element, className) => {
      if (element) element.classList.remove(className)
    },

    // Toggle class on element
    toggleClass: (element, className) => {
      if (element) element.classList.toggle(className)
    },

    // Check if element has class
    hasClass: (element, className) => {
      return element ? element.classList.contains(className) : false
    },

    // Set element style
    setStyle: (element, property, value) => {
      if (element) element.style[property] = value
    },

    // Set element content
    setContent: (element, content) => {
      if (element) element.textContent = content
    },

    // Set element HTML
    setHTML: (element, html) => {
      if (element) element.innerHTML = html
    },
  },

  // Event utilities
  events: {
    // Add event listener
    on: (element, event, handler) => {
      if (element) element.addEventListener(event, handler)
    },

    // Remove event listener
    off: (element, event, handler) => {
      if (element) element.removeEventListener(event, handler)
    },

    // Trigger custom event
    trigger: (element, eventName, data = {}) => {
      if (element) {
        const event = new CustomEvent(eventName, { detail: data })
        element.dispatchEvent(event)
      }
    },
  },

  // Animation utilities
  animation: {
    // Smooth scroll to element
    scrollToElement: (element, behavior = "smooth", block = "start") => {
      if (element) {
        element.scrollIntoView({ behavior, block })
      }
    },

    // Fade in element
    fadeIn: (element, duration = 300) => {
      if (!element) return

      element.style.opacity = "0"
      element.style.display = "block"

      const start = performance.now()

      const animate = (currentTime) => {
        const elapsed = currentTime - start
        const progress = Math.min(elapsed / duration, 1)

        element.style.opacity = progress

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    },

    // Fade out element
    fadeOut: (element, duration = 300) => {
      if (!element) return

      const start = performance.now()
      const startOpacity = Number.parseFloat(getComputedStyle(element).opacity)

      const animate = (currentTime) => {
        const elapsed = currentTime - start
        const progress = Math.min(elapsed / duration, 1)

        element.style.opacity = startOpacity * (1 - progress)

        if (progress >= 1) {
          element.style.display = "none"
        } else {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    },
  },

  // Validation utilities
  validation: {
    // Validate email
    isValidEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    // Validate required field
    isRequired: (value) => {
      return value && value.trim().length > 0
    },

    // Validate minimum length
    minLength: (value, min) => {
      return value && value.trim().length >= min
    },

    // Validate maximum length
    maxLength: (value, max) => {
      return value && value.trim().length <= max
    },
  },

  // String utilities
  string: {
    // Capitalize first letter
    capitalize: (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

    // Truncate string
    truncate: (str, length, suffix = "...") => {
      if (str.length <= length) return str
      return str.substring(0, length) + suffix
    },

    // Remove extra spaces
    cleanSpaces: (str) => {
      return str.replace(/\s+/g, " ").trim()
    },
  },

  // URL utilities
  url: {
    // Open URL in new tab
    openInNewTab: (url) => {
      window.open(url, "_blank", "noopener,noreferrer")
    },

    // Create mailto URL
    createMailtoUrl: (to, subject = "", body = "", cc = "") => {
      const params = new URLSearchParams()
      if (subject) params.append("subject", subject)
      if (body) params.append("body", body)
      if (cc) params.append("cc", cc)

      const queryString = params.toString()
      return `mailto:${to}${queryString ? "?" + queryString : ""}`
    },
  },

  // Device utilities
  device: {
    // Check if mobile device
    isMobile: () => {
      return window.innerWidth <= 768
    },

    // Check if tablet device
    isTablet: () => {
      return window.innerWidth > 768 && window.innerWidth <= 1024
    },

    // Check if desktop device
    isDesktop: () => {
      return window.innerWidth > 1024
    },

    // Get viewport dimensions
    getViewport: () => {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
  },

  // Storage utilities
  storage: {
    // Set local storage item
    setLocal: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
      } catch (error) {
        console.error("Error setting localStorage:", error)
        return false
      }
    },

    // Get local storage item
    getLocal: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
      } catch (error) {
        console.error("Error getting localStorage:", error)
        return defaultValue
      }
    },

    // Remove local storage item
    removeLocal: (key) => {
      try {
        localStorage.removeItem(key)
        return true
      } catch (error) {
        console.error("Error removing localStorage:", error)
        return false
      }
    },
  },

  // Debounce utility
  debounce: (func, wait, immediate = false) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        timeout = null
        if (!immediate) func(...args)
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func(...args)
    }
  },

  // Throttle utility
  throttle: (func, limit) => {
    let inThrottle
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },
}

// Export Utils to global scope
window.Utils = Utils
