// Jaydeep Vasoya Portfolio - Complete JavaScript
;(() => {
  // Configuration
  const CONFIG = {
    typing: {
      roles: ["Flutter Developer", "Mobile App Developer", "UI/UX Enthusiast", "Problem Solver"],
      typeSpeed: 100,
      deleteSpeed: 50,
      pauseTime: 2000,
    },
    contact: {
      emailTo: "jaydeepvasoya88@gmail.com",
      emailSubjectPrefix: "Portfolio Contact: ",
      successMessage: "Email client opened successfully!",
      errorMessage: "There was an error. Please email directly at jaydeepvasoya88@gmail.com",
      clipboardMessage: "Could not open email client. Email address copied to clipboard: jaydeepvasoya88@gmail.com",
    },
    scroll: {
      navbarScrollThreshold: 50,
    },
  }

  // Utility Functions
  const Utils = {
    // DOM helpers
    $: (selector) => document.querySelector(selector),
    $$: (selector) => document.querySelectorAll(selector),

    // Event helpers
    on: (element, event, handler) => {
      if (element) element.addEventListener(event, handler)
    },

    // Animation helpers
    scrollToElement: (element, behavior = "smooth") => {
      if (element) {
        element.scrollIntoView({ behavior, block: "start" })
      }
    },

    // Validation helpers
    isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    isRequired: (value) => value && value.trim().length > 0,
    minLength: (value, min) => value && value.trim().length >= min,

    // String helpers
    cleanSpaces: (str) => str.replace(/\s+/g, " ").trim(),

    // Device helpers
    isMobile: () => window.innerWidth <= 768,
    isDesktop: () => window.innerWidth > 1024,

    // Utility functions
    debounce: (func, wait) => {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },

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

  // Application State
  const AppState = {
    mobileMenuOpen: false,
    isInitialized: false,
    typingState: {
      currentIndex: 0,
      displayText: "",
      isDeleting: false,
      element: null,
    },
    formState: {
      isSubmitting: false,
      form: null,
      submitBtn: null,
    },
  }

  // Navigation Controller
  const Navigation = {
    init() {
      this.initSmoothScrolling()
      this.initMobileMenu()
      this.initNavbarScroll()
      this.initResizeHandler()
    },

    initSmoothScrolling() {
      // Handle navigation links
      Utils.$$('nav a[href^="#"], .mobile-menu a[href^="#"]').forEach((link) => {
        Utils.on(link, "click", (e) => {
          e.preventDefault()
          const targetId = link.getAttribute("href").substring(1)
          this.scrollToSection(targetId)

          // Close mobile menu if open
          if (AppState.mobileMenuOpen) {
            this.closeMobileMenu()
          }
        })
      })

      // Handle view work button
      const viewWorkBtn = Utils.$("#viewWorkBtn")
      Utils.on(viewWorkBtn, "click", () => {
        this.scrollToSection("projects")
      })
    },

    scrollToSection(sectionId) {
      const element = Utils.$(`#${sectionId}`)
      if (element) {
        Utils.scrollToElement(element)
      }
    },

    initMobileMenu() {
      const mobileMenuBtn = Utils.$("#mobileMenuBtn")
      Utils.on(mobileMenuBtn, "click", () => this.toggleMobileMenu())

      // Close menu when clicking outside
      Utils.on(document, "click", (e) => {
        const mobileMenu = Utils.$("#mobileMenu")
        const mobileMenuBtn = Utils.$("#mobileMenuBtn")

        if (AppState.mobileMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          this.closeMobileMenu()
        }
      })

      // Close menu on escape key
      Utils.on(document, "keydown", (e) => {
        if (e.key === "Escape" && AppState.mobileMenuOpen) {
          this.closeMobileMenu()
        }
      })
    },

    toggleMobileMenu() {
      if (AppState.mobileMenuOpen) {
        this.closeMobileMenu()
      } else {
        this.openMobileMenu()
      }
    },

    openMobileMenu() {
      const mobileMenu = Utils.$("#mobileMenu")
      const menuIcon = Utils.$("#menuIcon")
      const closeIcon = Utils.$("#closeIcon")

      AppState.mobileMenuOpen = true

      if (mobileMenu) mobileMenu.classList.add("active")
      if (menuIcon) menuIcon.style.display = "none"
      if (closeIcon) closeIcon.style.display = "block"

      // Prevent body scroll
      document.body.style.overflow = "hidden"
    },

    closeMobileMenu() {
      const mobileMenu = Utils.$("#mobileMenu")
      const menuIcon = Utils.$("#menuIcon")
      const closeIcon = Utils.$("#closeIcon")

      AppState.mobileMenuOpen = false

      if (mobileMenu) mobileMenu.classList.remove("active")
      if (menuIcon) menuIcon.style.display = "block"
      if (closeIcon) closeIcon.style.display = "none"

      // Restore body scroll
      document.body.style.overflow = ""
    },

    initNavbarScroll() {
      const navbar = Utils.$("#navbar")
      if (!navbar) return

      const handleScroll = Utils.throttle(() => {
        if (window.scrollY > CONFIG.scroll.navbarScrollThreshold) {
          navbar.classList.add("scrolled")
        } else {
          navbar.classList.remove("scrolled")
        }
      }, 16)

      Utils.on(window, "scroll", handleScroll)
    },

    initResizeHandler() {
      const handleResize = Utils.debounce(() => {
        // Close mobile menu on resize to desktop
        if (Utils.isDesktop() && AppState.mobileMenuOpen) {
          this.closeMobileMenu()
        }

        // Update scroll indicator visibility
        const scrollIndicator = Utils.$("#scrollIndicator")
        if (scrollIndicator) {
          scrollIndicator.style.display = Utils.isDesktop() ? "block" : "none"
        }
      }, 250)

      Utils.on(window, "resize", handleResize)
    },
  }

  // Animation Controller
  const Animations = {
    init() {
      this.initTypingAnimation()
      this.initScrollAnimations()
      this.addFloatingElements()
      this.initHoverEffects()
    },

    initTypingAnimation() {
      const element = Utils.$("#typingText")
      if (!element) return

      AppState.typingState.element = element
      this.typeText()
    },

    typeText() {
      const { roles, typeSpeed, deleteSpeed, pauseTime } = CONFIG.typing
      const state = AppState.typingState
      const currentText = roles[state.currentIndex]

      if (!state.isDeleting) {
        if (state.displayText.length < currentText.length) {
          state.displayText = currentText.slice(0, state.displayText.length + 1)
        } else {
          setTimeout(() => (state.isDeleting = true), pauseTime)
        }
      } else {
        if (state.displayText.length > 0) {
          state.displayText = state.displayText.slice(0, -1)
        } else {
          state.isDeleting = false
          state.currentIndex = (state.currentIndex + 1) % roles.length
        }
      }

      if (state.element) {
        state.element.textContent = state.displayText
      }

      const speed = state.isDeleting ? deleteSpeed : typeSpeed
      setTimeout(() => this.typeText(), speed)
    },

    initScrollAnimations() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target)
          }
        })
      }, observerOptions)

      // Observe sections
      Utils.$$("section").forEach((section, index) => {
        // Skip first section (hero)
        if (index > 0) {
          section.classList.add("fade-in-section")
          observer.observe(section)
        }
      })
    },

    animateElement(element) {
      element.classList.add("visible")

      // Animate child elements with stagger
      const children = element.querySelectorAll(".card, .stat-card, .skill-category")
      children.forEach((child, index) => {
        setTimeout(() => {
          child.classList.add("animate-fade-in-up")
        }, index * 100)
      })
    },

    addFloatingElements() {
      const hero = Utils.$(".hero")
      if (!hero) return

      const floatingElements = [
        { size: "80px", color: "rgba(59, 130, 246, 0.1)", top: "20%", left: "10%", delay: "0s" },
        { size: "120px", color: "rgba(168, 85, 247, 0.1)", top: "60%", right: "10%", delay: "1s" },
        { size: "60px", color: "rgba(6, 182, 212, 0.1)", top: "40%", left: "20%", delay: "0.5s" },
      ]

      floatingElements.forEach((element) => {
        const div = document.createElement("div")
        div.style.cssText = `
                    position: absolute;
                    width: ${element.size};
                    height: ${element.size};
                    background: ${element.color};
                    border-radius: 50%;
                    filter: blur(40px);
                    animation: pulse 2s infinite;
                    animation-delay: ${element.delay};
                    z-index: 1;
                    pointer-events: none;
                `

        if (element.top) div.style.top = element.top
        if (element.left) div.style.left = element.left
        if (element.right) div.style.right = element.right

        hero.appendChild(div)
      })
    },

    initHoverEffects() {
      const cards = Utils.$$(".card, .stat-card, .skill-category, .contact-card")

      cards.forEach((card) => {
        Utils.on(card, "mouseenter", function () {
          this.style.transform = "translateY(-5px) scale(1.02)"
        })

        Utils.on(card, "mouseleave", function () {
          this.style.transform = "translateY(0) scale(1)"
        })
      })
    },
  }

  // Contact Controller
  const Contact = {
    init() {
      this.initContactForm()
      this.initContactLinks()
    },

    initContactForm() {
      const form = Utils.$("#contactForm")
      const submitBtn = Utils.$("#submitBtn")

      if (!form || !submitBtn) return

      AppState.formState.form = form
      AppState.formState.submitBtn = submitBtn

      Utils.on(form, "submit", (e) => this.handleFormSubmit(e))

      // Add real-time validation
      const inputs = form.querySelectorAll("input, textarea")
      inputs.forEach((input) => {
        Utils.on(input, "blur", () => this.validateField(input))
        Utils.on(input, "input", () => this.clearFieldError(input))
      })
    },

    handleFormSubmit(e) {
      e.preventDefault()

      if (AppState.formState.isSubmitting) return

      const formData = new FormData(AppState.formState.form)
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      }

      // Validate form
      if (!this.validateForm(data)) {
        return
      }

      this.submitForm(data)
    },

    validateForm(data) {
      let isValid = true
      const errors = {}

      // Validate name
      if (!Utils.isRequired(data.name)) {
        errors.name = "Name is required"
        isValid = false
      } else if (!Utils.minLength(data.name, 2)) {
        errors.name = "Name must be at least 2 characters"
        isValid = false
      }

      // Validate email
      if (!Utils.isRequired(data.email)) {
        errors.email = "Email is required"
        isValid = false
      } else if (!Utils.isValidEmail(data.email)) {
        errors.email = "Please enter a valid email address"
        isValid = false
      }

      // Validate subject
      if (!Utils.isRequired(data.subject)) {
        errors.subject = "Subject is required"
        isValid = false
      } else if (!Utils.minLength(data.subject, 5)) {
        errors.subject = "Subject must be at least 5 characters"
        isValid = false
      }

      // Validate message
      if (!Utils.isRequired(data.message)) {
        errors.message = "Message is required"
        isValid = false
      } else if (!Utils.minLength(data.message, 10)) {
        errors.message = "Message must be at least 10 characters"
        isValid = false
      }

      // Display errors
      if (!isValid) {
        this.displayFormErrors(errors)
      }

      return isValid
    },

    validateField(field) {
      const value = field.value
      const name = field.name
      let error = ""

      switch (name) {
        case "name":
          if (!Utils.isRequired(value)) {
            error = "Name is required"
          } else if (!Utils.minLength(value, 2)) {
            error = "Name must be at least 2 characters"
          }
          break

        case "email":
          if (!Utils.isRequired(value)) {
            error = "Email is required"
          } else if (!Utils.isValidEmail(value)) {
            error = "Please enter a valid email address"
          }
          break

        case "subject":
          if (!Utils.isRequired(value)) {
            error = "Subject is required"
          } else if (!Utils.minLength(value, 5)) {
            error = "Subject must be at least 5 characters"
          }
          break

        case "message":
          if (!Utils.isRequired(value)) {
            error = "Message is required"
          } else if (!Utils.minLength(value, 10)) {
            error = "Message must be at least 10 characters"
          }
          break
      }

      if (error) {
        this.displayFieldError(field, error)
      } else {
        this.clearFieldError(field)
      }

      return !error
    },

    displayFormErrors(errors) {
      Object.keys(errors).forEach((fieldName) => {
        const field = AppState.formState.form.querySelector(`[name="${fieldName}"]`)
        if (field) {
          this.displayFieldError(field, errors[fieldName])
        }
      })

      // Show general error message
      this.showMessage("Please correct the errors above.", "error")
    },

    displayFieldError(field, message) {
      this.clearFieldError(field)

      const errorElement = document.createElement("div")
      errorElement.className = "field-error"
      errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `
      errorElement.textContent = message

      field.parentNode.appendChild(errorElement)
      field.style.borderColor = "#ef4444"
    },

    clearFieldError(field) {
      const errorElement = field.parentNode.querySelector(".field-error")
      if (errorElement) {
        errorElement.remove()
      }
      field.style.borderColor = ""
    },

    submitForm(data) {
      this.setSubmittingState(true)

      try {
        const { emailTo, emailSubjectPrefix } = CONFIG.contact
        const emailSubject = `${emailSubjectPrefix}${Utils.cleanSpaces(data.subject)}`
        const emailBody = this.createEmailBody(data)

        // Create mailto URL with CC to user's email
        const mailtoUrl = this.createMailtoUrl(emailTo, emailSubject, emailBody, data.email)

        // Try to open email client
        const opened = window.open(mailtoUrl, "_blank")

        if (!opened) {
          // Fallback: copy email to clipboard
          this.handleEmailClientFallback()
        } else {
          this.handleSubmitSuccess()
        }
      } catch (error) {
        console.error("Error opening email client:", error)
        this.handleSubmitError()
      } finally {
        setTimeout(() => {
          this.setSubmittingState(false)
        }, 1000)
      }
    },

    createEmailBody(data) {
      return `Hi Jaydeep,

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

Best regards,
${data.name}`
    },

    createMailtoUrl(to, subject = "", body = "", cc = "") {
      const params = new URLSearchParams()
      if (subject) params.append("subject", subject)
      if (body) params.append("body", body)
      if (cc) params.append("cc", cc)

      const queryString = params.toString()
      return `mailto:${to}${queryString ? "?" + queryString : ""}`
    },

    handleEmailClientFallback() {
      const { emailTo, clipboardMessage } = CONFIG.contact

      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(emailTo)
          .then(() => {
            this.showMessage(clipboardMessage, "info")
          })
          .catch(() => {
            this.showMessage(`Could not open email client. Please email directly at: ${emailTo}`, "info")
          })
      } else {
        this.showMessage(`Could not open email client. Please email directly at: ${emailTo}`, "info")
      }
    },

    handleSubmitSuccess() {
      const { successMessage } = CONFIG.contact
      this.showMessage(successMessage, "success")
      this.resetForm()
    },

    handleSubmitError() {
      const { errorMessage } = CONFIG.contact
      this.showMessage(errorMessage, "error")
    },

    setSubmittingState(isSubmitting) {
      AppState.formState.isSubmitting = isSubmitting
      const submitBtn = AppState.formState.submitBtn

      if (!submitBtn) return

      if (isSubmitting) {
        const originalContent = submitBtn.innerHTML
        submitBtn.setAttribute("data-original-content", originalContent)
        submitBtn.innerHTML = '<div class="loading-spinner"></div> Opening Email...'
        submitBtn.disabled = true
      } else {
        const originalContent = submitBtn.getAttribute("data-original-content")
        if (originalContent) {
          submitBtn.innerHTML = originalContent
        }
        submitBtn.disabled = false

        // Reinitialize Lucide icons
        if (window.lucide) {
          window.lucide.createIcons()
        }
      }
    },

    resetForm() {
      if (AppState.formState.form) {
        AppState.formState.form.reset()

        // Clear any remaining errors
        const errorElements = AppState.formState.form.querySelectorAll(".field-error")
        errorElements.forEach((error) => error.remove())

        // Reset field styles
        const fields = AppState.formState.form.querySelectorAll("input, textarea")
        fields.forEach((field) => {
          field.style.borderColor = ""
        })
      }
    },

    showMessage(message, type = "info") {
      // Create message element
      const messageElement = document.createElement("div")
      messageElement.className = `message message-${type}`
      messageElement.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                z-index: 9999;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                color: white;
                font-weight: 500;
                max-width: 400px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `

      // Set background color based on type
      switch (type) {
        case "success":
          messageElement.style.background = "linear-gradient(to right, #10b981, #059669)"
          break
        case "error":
          messageElement.style.background = "linear-gradient(to right, #ef4444, #dc2626)"
          break
        case "info":
        default:
          messageElement.style.background = "linear-gradient(to right, #3b82f6, #2563eb)"
          break
      }

      messageElement.textContent = message
      document.body.appendChild(messageElement)

      // Animate in
      setTimeout(() => {
        messageElement.style.transform = "translateX(0)"
      }, 100)

      // Auto remove after 5 seconds
      setTimeout(() => {
        messageElement.style.transform = "translateX(100%)"
        setTimeout(() => {
          if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement)
          }
        }, 300)
      }, 5000)

      // Allow manual close
      Utils.on(messageElement, "click", () => {
        messageElement.style.transform = "translateX(100%)"
        setTimeout(() => {
          if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement)
          }
        }, 300)
      })
    },

    initContactLinks() {
      // Add click tracking for contact links
      const contactLinks = Utils.$$(".contact-card, .social-icon, .social-icon-large")
      contactLinks.forEach((link) => {
        Utils.on(link, "click", () => {
          const href = link.getAttribute("href")
          if (href && href.startsWith("mailto:")) {
            console.log("Email contact clicked")
          } else if (href && href.includes("wa.me")) {
            console.log("WhatsApp contact clicked")
          }
        })
      })
    },
  }

  // Main Application
  const App = {
    init() {
      if (AppState.isInitialized) return

      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        Utils.on(document, "DOMContentLoaded", () => this.onDOMReady())
      } else {
        this.onDOMReady()
      }
    },

    onDOMReady() {
      // Show loading state
      this.showLoadingState()

      // Initialize Lucide icons
      if (window.lucide) {
        window.lucide.createIcons()
      }

      // Initialize all controllers
      this.initializeControllers()

      // Wait for window load for complete initialization
      if (document.readyState === "complete") {
        this.onWindowLoad()
      } else {
        Utils.on(window, "load", () => this.onWindowLoad())
      }
    },

    onWindowLoad() {
      this.hideLoadingState()
      this.initializePostLoad()
      AppState.isInitialized = true

      // Log initialization
      console.log("🚀 Jaydeep Vasoya Portfolio - Loaded Successfully!")
      console.log("📱 Flutter Developer | Mobile App Specialist")
      console.log("💼 Available for freelance projects and collaborations")
      console.log("📧 Contact: jaydeepvasoya88@gmail.com")
    },

    initializeControllers() {
      try {
        // Initialize navigation
        Navigation.init()

        // Initialize animations
        Animations.init()

        // Initialize contact functionality
        Contact.init()

        // Initialize other features
        this.initializeFeatures()
      } catch (error) {
        console.error("Error initializing controllers:", error)
      }
    },

    initializeFeatures() {
      // Initialize image preloading
      this.preloadImages()

      // Initialize error handling
      this.initializeErrorHandling()

      // Initialize accessibility features
      this.initializeAccessibility()
    },

    initializePostLoad() {
      // Initialize lazy loading
      this.initializeLazyLoading()
    },

    showLoadingState() {
      if (document.body) {
        document.body.style.opacity = "0"
        document.body.style.transition = "opacity 0.5s ease"
      }
    },

    hideLoadingState() {
      setTimeout(() => {
        if (document.body) {
          document.body.style.opacity = "1"
        }
      }, 100)
    },

    preloadImages() {
      const images = []

      images.forEach((src) => {
        const img = new Image()
        img.src = src
        img.onload = () => console.log(`Preloaded: ${src}`)
        img.onerror = () => console.warn(`Failed to preload: ${src}`)
      })
    },

    initializeErrorHandling() {
      // Global error handler
      Utils.on(window, "error", (e) => {
        console.error("Global error:", e.error)
      })

      // Unhandled promise rejection handler
      Utils.on(window, "unhandledrejection", (e) => {
        console.error("Unhandled promise rejection:", e.reason)
        e.preventDefault()
      })
    },

    initializeAccessibility() {
      // Add skip link
      this.addSkipLink()

      // Initialize keyboard navigation
      this.initializeKeyboardNavigation()

      // Initialize focus management
      this.initializeFocusManagement()
    },

    addSkipLink() {
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

      Utils.on(skipLink, "focus", () => {
        skipLink.style.top = "6px"
      })

      Utils.on(skipLink, "blur", () => {
        skipLink.style.top = "-40px"
      })

      document.body.insertBefore(skipLink, document.body.firstChild)

      // Add main content ID
      const heroSection = Utils.$("#home")
      if (heroSection) {
        heroSection.id = "main-content"
        heroSection.setAttribute("tabindex", "-1")
      }
    },

    initializeKeyboardNavigation() {
      // Handle escape key for closing modals/menus
      Utils.on(document, "keydown", (e) => {
        if (e.key === "Escape") {
          // Close mobile menu if open
          if (AppState.mobileMenuOpen) {
            Navigation.closeMobileMenu()
          }
        }
      })

      // Handle tab navigation
      Utils.on(document, "keydown", (e) => {
        if (e.key === "Tab") {
          document.body.classList.add("keyboard-navigation")
        }
      })

      Utils.on(document, "mousedown", () => {
        document.body.classList.remove("keyboard-navigation")
      })
    },

    initializeFocusManagement() {
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

    initializeLazyLoading() {
      if ("IntersectionObserver" in window) {
        const lazyImages = Utils.$$("img[data-src]")

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
  }

  // Initialize application
  App.init()
})()
