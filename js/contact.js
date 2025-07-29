// Contact Controller
const ContactController = {
  // Form state
  formState: {
    isSubmitting: false,
    form: null,
    submitBtn: null,
  },

  // Initialize contact functionality
  init: () => {
    ContactController.initContactForm()
    ContactController.initContactLinks()
  },

  // Initialize contact form
  initContactForm: () => {
    const form = window.Utils.dom.getElementById("contactForm")
    const submitBtn = window.Utils.dom.getElementById("submitBtn")

    if (!form || !submitBtn) return

    ContactController.formState.form = form
    ContactController.formState.submitBtn = submitBtn

    window.Utils.events.on(form, "submit", ContactController.handleFormSubmit)

    // Add real-time validation
    const inputs = form.querySelectorAll("input, textarea")
    inputs.forEach((input) => {
      window.Utils.events.on(input, "blur", () => ContactController.validateField(input))
      window.Utils.events.on(input, "input", () => ContactController.clearFieldError(input))
    })
  },

  // Handle form submission
  handleFormSubmit: (e) => {
    e.preventDefault()

    if (ContactController.formState.isSubmitting) return

    const formData = new FormData(ContactController.formState.form)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    // Validate form
    if (!ContactController.validateForm(data)) {
      return
    }

    ContactController.submitForm(data)
  },

  // Validate form data
  validateForm: (data) => {
    let isValid = true
    const errors = {}

    // Validate name
    if (!window.Utils.validation.isRequired(data.name)) {
      errors.name = "Name is required"
      isValid = false
    } else if (!window.Utils.validation.minLength(data.name, 2)) {
      errors.name = "Name must be at least 2 characters"
      isValid = false
    }

    // Validate email
    if (!window.Utils.validation.isRequired(data.email)) {
      errors.email = "Email is required"
      isValid = false
    } else if (!window.Utils.validation.isValidEmail(data.email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }

    // Validate subject
    if (!window.Utils.validation.isRequired(data.subject)) {
      errors.subject = "Subject is required"
      isValid = false
    } else if (!window.Utils.validation.minLength(data.subject, 5)) {
      errors.subject = "Subject must be at least 5 characters"
      isValid = false
    }

    // Validate message
    if (!window.Utils.validation.isRequired(data.message)) {
      errors.message = "Message is required"
      isValid = false
    } else if (!window.Utils.validation.minLength(data.message, 10)) {
      errors.message = "Message must be at least 10 characters"
      isValid = false
    }

    // Display errors
    if (!isValid) {
      ContactController.displayFormErrors(errors)
    }

    return isValid
  },

  // Validate individual field
  validateField: (field) => {
    const value = field.value
    const name = field.name
    let error = ""

    switch (name) {
      case "name":
        if (!window.Utils.validation.isRequired(value)) {
          error = "Name is required"
        } else if (!window.Utils.validation.minLength(value, 2)) {
          error = "Name must be at least 2 characters"
        }
        break

      case "email":
        if (!window.Utils.validation.isRequired(value)) {
          error = "Email is required"
        } else if (!window.Utils.validation.isValidEmail(value)) {
          error = "Please enter a valid email address"
        }
        break

      case "subject":
        if (!window.Utils.validation.isRequired(value)) {
          error = "Subject is required"
        } else if (!window.Utils.validation.minLength(value, 5)) {
          error = "Subject must be at least 5 characters"
        }
        break

      case "message":
        if (!window.Utils.validation.isRequired(value)) {
          error = "Message is required"
        } else if (!window.Utils.validation.minLength(value, 10)) {
          error = "Message must be at least 10 characters"
        }
        break
    }

    if (error) {
      ContactController.displayFieldError(field, error)
    } else {
      ContactController.clearFieldError(field)
    }

    return !error
  },

  // Display form errors
  displayFormErrors: (errors) => {
    Object.keys(errors).forEach((fieldName) => {
      const field = ContactController.formState.form.querySelector(`[name="${fieldName}"]`)
      if (field) {
        ContactController.displayFieldError(field, errors[fieldName])
      }
    })

    // Show general error message
    ContactController.showMessage("Please correct the errors above.", "error")
  },

  // Display field error
  displayFieldError: (field, message) => {
    ContactController.clearFieldError(field)

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

  // Clear field error
  clearFieldError: (field) => {
    const errorElement = field.parentNode.querySelector(".field-error")
    if (errorElement) {
      errorElement.remove()
    }
    field.style.borderColor = ""
  },

  // Submit form
  submitForm: (data) => {
    ContactController.setSubmittingState(true)

    try {
      const { emailTo, emailSubjectPrefix } = window.CONFIG.contact
      const emailSubject = `${emailSubjectPrefix}${window.Utils.string.cleanSpaces(data.subject)}`
      const emailBody = ContactController.createEmailBody(data)

      // Create mailto URL with CC to user's email
      const mailtoUrl = window.Utils.url.createMailtoUrl(emailTo, emailSubject, emailBody, data.email)

      // Try to open email client
      const opened = window.open(mailtoUrl, "_blank")

      if (!opened) {
        // Fallback: copy email to clipboard
        ContactController.handleEmailClientFallback()
      } else {
        ContactController.handleSubmitSuccess()
      }
    } catch (error) {
      console.error("Error opening email client:", error)
      ContactController.handleSubmitError()
    } finally {
      setTimeout(() => {
        ContactController.setSubmittingState(false)
      }, 1000)
    }
  },

  // Create email body
  createEmailBody: (data) => {
    return `Hi Jaydeep,

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

Best regards,
${data.name}`
  },

  // Handle email client fallback
  handleEmailClientFallback: () => {
    const { emailTo, clipboardMessage } = window.CONFIG.contact

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(emailTo)
        .then(() => {
          ContactController.showMessage(clipboardMessage, "info")
        })
        .catch(() => {
          ContactController.showMessage(`Could not open email client. Please email directly at: ${emailTo}`, "info")
        })
    } else {
      ContactController.showMessage(`Could not open email client. Please email directly at: ${emailTo}`, "info")
    }
  },

  // Handle submit success
  handleSubmitSuccess: () => {
    const { successMessage } = window.CONFIG.contact
    ContactController.showMessage(successMessage, "success")
    ContactController.resetForm()
  },

  // Handle submit error
  handleSubmitError: () => {
    const { errorMessage } = window.CONFIG.contact
    ContactController.showMessage(errorMessage, "error")
  },

  // Set submitting state
  setSubmittingState: (isSubmitting) => {
    ContactController.formState.isSubmitting = isSubmitting
    const submitBtn = ContactController.formState.submitBtn

    if (!submitBtn) return

    if (isSubmitting) {
      const originalContent = submitBtn.innerHTML
      submitBtn.setAttribute("data-original-content", originalContent)
      window.Utils.dom.setHTML(submitBtn, '<div class="loading-spinner"></div> Opening Email...')
      submitBtn.disabled = true
    } else {
      const originalContent = submitBtn.getAttribute("data-original-content")
      if (originalContent) {
        window.Utils.dom.setHTML(submitBtn, originalContent)
      }
      submitBtn.disabled = false

      // Reinitialize Lucide icons
      if (window.window.lucide) {
        window.window.lucide.createIcons()
      }
    }
  },

  // Reset form
  resetForm: () => {
    if (ContactController.formState.form) {
      ContactController.formState.form.reset()

      // Clear any remaining errors
      const errorElements = ContactController.formState.form.querySelectorAll(".field-error")
      errorElements.forEach((error) => error.remove())

      // Reset field styles
      const fields = ContactController.formState.form.querySelectorAll("input, textarea")
      fields.forEach((field) => {
        field.style.borderColor = ""
      })
    }
  },

  // Show message
  showMessage: (message, type = "info") => {
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
    window.Utils.events.on(messageElement, "click", () => {
      messageElement.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.parentNode.removeChild(messageElement)
        }
      }, 300)
    })
  },

  // Initialize contact links
  initContactLinks: () => {
    // Add click tracking for contact links
    const contactLinks = window.Utils.dom.querySelectorAll(".contact-card, .social-icon, .social-icon-large")
    contactLinks.forEach((link) => {
      window.Utils.events.on(link, "click", (e) => {
        const href = link.getAttribute("href")
        if (href && href.startsWith("mailto:")) {
          // Track email clicks
          console.log("Email contact clicked")
        } else if (href && href.includes("wa.me")) {
          // Track WhatsApp clicks
          console.log("WhatsApp contact clicked")
        }
      })
    })
  },
}

// Declare Utils, CONFIG, and lucide variables
window.Utils = {
  dom: {
    getElementById: (id) => document.getElementById(id),
    querySelectorAll: (selector) => document.querySelectorAll(selector),
    setHTML: (element, html) => (element.innerHTML = html),
  },
  events: {
    on: (element, event, handler) => element.addEventListener(event, handler),
  },
  validation: {
    isRequired: (value) => value.trim() !== "",
    minLength: (value, length) => value.length >= length,
    isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  },
  string: {
    cleanSpaces: (str) => str.replace(/\s+/g, " "),
  },
  url: {
    createMailtoUrl: (to, subject, body, cc) =>
      `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=${encodeURIComponent(cc)}`,
  },
}

window.CONFIG = {
  contact: {
    emailTo: "example@example.com",
    emailSubjectPrefix: "Contact Form: ",
    clipboardMessage: "Email address copied to clipboard.",
    successMessage: "Your message has been sent successfully.",
    errorMessage: "An error occurred while sending your message.",
  },
}

window.lucide = {
  createIcons: () => {
    // Placeholder for Lucide icon creation logic
  },
}

// Export ContactController to global scope
window.ContactController = ContactController
