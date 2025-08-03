
;(() => {
  
  const CONFIG = {
    typing: {
      roles: ["Flutter Developer", "Mobile App Developer", "UI/UX Enthusiast", "Problem Solver"],
      typeSpeed: 100,
      deleteSpeed: 50,
      pauseTime: 2000,
    },
    emailjs: {
      serviceId: "service_0fnqy42", 
      templateId: "template_kapglt3", 
      publicKey: "EhAkzzXfH0F9eoE0b", 
    },
    contact: {
      successMessage: "Email sent successfully! I'll get back to you soon.",
      errorMessage: "Failed to send email. Please try again or contact me directly.",
    },
    scroll: {
      navbarScrollThreshold: 50,
    },
  }

  
  const Utils = {
    
    $: (selector) => document.querySelector(selector),
    $$: (selector) => document.querySelectorAll(selector),

    
    on: (element, event, handler) => {
      if (element) element.addEventListener(event, handler)
    },

    
    scrollToElement: (element, behavior = "smooth") => {
      if (element) {
        element.scrollIntoView({ behavior, block: "start" })
      }
    },

    
    isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    isRequired: (value) => value && value.trim().length > 0,
    minLength: (value, min) => value && value.trim().length >= min,

    
    cleanSpaces: (str) => str.replace(/\s+/g, " ").trim(),

    
    isMobile: () => window.innerWidth <= 768,
    isDesktop: () => window.innerWidth > 1024,

    
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

  
  const Navigation = {
    init() {
      this.initSmoothScrolling()
      this.initMobileMenu()
      this.initNavbarScroll()
      this.initResizeHandler()
    },

    initSmoothScrolling() {
      
      Utils.$$('nav a[href^="#"], .mobile-menu a[href^="#"]').forEach((link) => {
        Utils.on(link, "click", (e) => {
          e.preventDefault()
          const targetId = link.getAttribute("href").substring(1)
          this.scrollToSection(targetId)
          
          if (AppState.mobileMenuOpen) {
            this.closeMobileMenu()
          }
        })
      })

      
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

      
      Utils.on(document, "click", (e) => {
        const mobileMenu = Utils.$("#mobileMenu")
        const mobileMenuBtn = Utils.$("#mobileMenuBtn")
        if (AppState.mobileMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          this.closeMobileMenu()
        }
      })

      
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
        
        if (Utils.isDesktop() && AppState.mobileMenuOpen) {
          this.closeMobileMenu()
        }
      }, 250)

      Utils.on(window, "resize", handleResize)
    },
  }

  
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

      
      Utils.$$("section").forEach((section, index) => {
        
        if (index > 0) {
          section.classList.add("fade-in-section")
          observer.observe(section)
        }
      })
    },

    animateElement(element) {
      element.classList.add("visible")
      
      const children = element.querySelectorAll(".card, .stat-card, .skill-category, .project-card")
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
      const cards = Utils.$$(".card, .stat-card, .skill-category, .contact-card, .project-card")
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

  
  const Contact = {
    init() {
      this.initEmailJS()
      this.initContactForm()
      this.initContactLinks()
    },

    initEmailJS() {
      
      const emailjs = window.emailjs 
      if (emailjs) {
        emailjs.init(CONFIG.emailjs.publicKey)
      }
    },

    initContactForm() {
      const form = Utils.$("#contactForm")
      const submitBtn = Utils.$("#submitBtn")
      if (!form || !submitBtn) return

      AppState.formState.form = form
      AppState.formState.submitBtn = submitBtn

      Utils.on(form, "submit", (e) => this.handleFormSubmit(e))

      
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

      
      if (!this.validateForm(data)) {
        return
      }

      this.submitForm(data)
    },

    validateForm(data) {
      let isValid = true
      const errors = {}

      
      if (!Utils.isRequired(data.name)) {
        errors.name = "Name is required"
        isValid = false
      } else if (!Utils.minLength(data.name, 2)) {
        errors.name = "Name must be at least 2 characters"
        isValid = false
      }

      
      if (!Utils.isRequired(data.email)) {
        errors.email = "Email is required"
        isValid = false
      } else if (!Utils.isValidEmail(data.email)) {
        errors.email = "Please enter a valid email address"
        isValid = false
      }

      
      if (!Utils.isRequired(data.subject)) {
        errors.subject = "Subject is required"
        isValid = false
      } else if (!Utils.minLength(data.subject, 5)) {
        errors.subject = "Subject must be at least 5 characters"
        isValid = false
      }

      
      if (!Utils.isRequired(data.message)) {
        errors.message = "Message is required"
        isValid = false
      } else if (!Utils.minLength(data.message, 10)) {
        errors.message = "Message must be at least 10 characters"
        isValid = false
      }

      
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

      const emailjs = window.emailjs
      if (!emailjs) {
        console.error("EmailJS not loaded")
        this.handleSubmitError("EmailJS service not available")
        this.setSubmittingState(false)
        return
      }

      
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        to_email: "jaydeepvasoya88@gmail.com", 
        to_name: "Jaydeep Vasoya",
        reply_to: data.email,
      }

      
      emailjs
        .send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, templateParams)
        .then(
          (response) => {
            console.log("Email sent successfully:", response)
            this.handleSubmitSuccess()
          },
          (error) => {
            console.error("Email send failed:", error)
            this.handleSubmitError("Failed to send email. Please try again.")
          },
        )
        .finally(() => {
          setTimeout(() => {
            this.setSubmittingState(false)
          }, 1000)
        })
    },

    handleSubmitSuccess() {
      const { successMessage } = CONFIG.contact
      this.showMessage(successMessage, "success")
      this.resetForm()
    },

    handleSubmitError(message) {
      const errorMessage = message || CONFIG.contact.errorMessage
      this.showMessage(errorMessage, "error")
    },

    setSubmittingState(isSubmitting) {
      AppState.formState.isSubmitting = isSubmitting
      const submitBtn = AppState.formState.submitBtn
      if (!submitBtn) return

      if (isSubmitting) {
        const originalContent = submitBtn.innerHTML
        submitBtn.setAttribute("data-original-content", originalContent)
        submitBtn.innerHTML = '<div class="loading-spinner"></div> Sending...'
        submitBtn.disabled = true
      } else {
        const originalContent = submitBtn.getAttribute("data-original-content")
        if (originalContent) {
          submitBtn.innerHTML = originalContent
        }
        submitBtn.disabled = false
        
        if (window.lucide) {
          window.lucide.createIcons()
        }
      }
    },

    resetForm() {
      if (AppState.formState.form) {
        AppState.formState.form.reset()
        
        const errorElements = AppState.formState.form.querySelectorAll(".field-error")
        errorElements.forEach((error) => error.remove())
        
        const fields = AppState.formState.form.querySelectorAll("input, textarea")
        fields.forEach((field) => {
          field.style.borderColor = ""
        })
      }
    },

    showMessage(message, type = "info") {
      
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

      
      setTimeout(() => {
        messageElement.style.transform = "translateX(0)"
      }, 100)

      
      setTimeout(() => {
        messageElement.style.transform = "translateX(100%)"
        setTimeout(() => {
          if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement)
          }
        }, 300)
      }, 5000)

      
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

  
  const App = {
    init() {
      if (AppState.isInitialized) return

      
      if (document.readyState === "loading") {
        Utils.on(document, "DOMContentLoaded", () => this.onDOMReady())
      } else {
        this.onDOMReady()
      }
    },

    onDOMReady() {
      
      this.showLoadingState()

      
      if (window.lucide) {
        window.lucide.createIcons()
      }

      
      this.initializeControllers()

      
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

      
      console.log("🚀 Jaydeep Vasoya Portfolio - Loaded Successfully!")
      console.log("📱 Flutter Developer | Mobile App Specialist")
      console.log("💼 Available for freelance projects and collaborations")
      console.log("📧 Contact: jaydeepvasoya88@gmail.com")
    },

    initializeControllers() {
      try {
        
        Navigation.init()
        
        Animations.init()
        
        Contact.init()
        
        this.initializeFeatures()
      } catch (error) {
        console.error("Error initializing controllers:", error)
      }
    },

    initializeFeatures() {
      
      this.initializeErrorHandling()
      
      this.initializeAccessibility()
    },

    initializePostLoad() {
      
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

    initializeErrorHandling() {
      
      Utils.on(window, "error", (e) => {
        console.error("Global error:", e.error)
      })

      
      Utils.on(window, "unhandledrejection", (e) => {
        console.error("Unhandled promise rejection:", e.reason)
        e.preventDefault()
      })
    },

    initializeAccessibility() {
      
      this.addSkipLink()
      
      this.initializeKeyboardNavigation()
      
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

      
      const heroSection = Utils.$("#home")
      if (heroSection) {
        heroSection.id = "main-content"
        heroSection.setAttribute("tabindex", "-1")
      }
    },

    initializeKeyboardNavigation() {
      
      Utils.on(document, "keydown", (e) => {
        if (e.key === "Escape") {
          
          if (AppState.mobileMenuOpen) {
            Navigation.closeMobileMenu()
          }
        }
      })

      
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

  
  App.init()
})()
