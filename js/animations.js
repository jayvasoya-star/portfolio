// Animation Controller
const AnimationController = {
  // Typing animation state
  typingState: {
    currentIndex: 0,
    displayText: "",
    isDeleting: false,
    element: null,
  },

  // Initialize typing animation
  initTypingAnimation: () => {
    const element = window.Utils.dom.getElementById("typingText")
    if (!element) return

    AnimationController.typingState.element = element
    AnimationController.typeText()
  },

  // Type text animation
  typeText: () => {
    const { roles, typeSpeed, deleteSpeed, pauseTime } = window.CONFIG.typing
    const state = AnimationController.typingState
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
      window.Utils.dom.setContent(state.element, state.displayText)
    }

    const speed = state.isDeleting ? deleteSpeed : typeSpeed
    setTimeout(AnimationController.typeText, speed)
  },

  // Initialize intersection observer for scroll animations
  initScrollAnimations: () => {
    const { observerThreshold, observerRootMargin } = window.CONFIG.animations

    const observerOptions = {
      threshold: observerThreshold,
      rootMargin: observerRootMargin,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          AnimationController.animateElement(entry.target)
        }
      })
    }, observerOptions)

    // Observe sections
    const sections = window.Utils.dom.querySelectorAll("section")
    sections.forEach((section, index) => {
      // Skip first section (hero)
      if (index > 0) {
        window.Utils.dom.addClass(section, "fade-in-section")
        observer.observe(section)
      }
    })
  },

  // Animate element when it comes into view
  animateElement: (element) => {
    window.Utils.dom.addClass(element, "visible")

    // Animate child elements with stagger
    const children = element.querySelectorAll(".card, .stat-card, .skill-category")
    children.forEach((child, index) => {
      setTimeout(() => {
        window.Utils.dom.addClass(child, "animate-fade-in-up")
      }, index * 100)
    })
  },

  // Add floating elements to hero section
  addFloatingElements: () => {
    const hero = window.Utils.dom.querySelector(".hero")
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

  // Initialize hover effects
  initHoverEffects: () => {
    const cards = window.Utils.dom.querySelectorAll(".card, .stat-card, .skill-category, .contact-card")

    cards.forEach((card) => {
      window.Utils.events.on(card, "mouseenter", function () {
        window.Utils.dom.setStyle(this, "transform", "translateY(-5px) scale(1.02)")
      })

      window.Utils.events.on(card, "mouseleave", function () {
        window.Utils.dom.setStyle(this, "transform", "translateY(0) scale(1)")
      })
    })
  },

  // Initialize all animations
  init: () => {
    AnimationController.initTypingAnimation()
    AnimationController.initScrollAnimations()
    AnimationController.addFloatingElements()
    AnimationController.initHoverEffects()
  },
}

// Export AnimationController to global scope
window.AnimationController = AnimationController
