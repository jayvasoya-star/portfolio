// Navigation Controller
const NavigationController = {
  // Mobile menu state
  mobileMenuOpen: false,

  // Initialize navigation
  init: () => {
    NavigationController.initScrollBehavior()
    NavigationController.initMobileMenu()
    NavigationController.initNavbarScroll()
    NavigationController.initResizeHandler()
  },

  // Initialize smooth scrolling
  initScrollBehavior: () => {
    // Add smooth scroll to all navigation links
    const navLinks = window.Utils.dom.querySelectorAll('a[href^="#"]')
    navLinks.forEach((link) => {
      window.Utils.events.on(link, "click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href").substring(1)
        NavigationController.scrollToSection(targetId)
      })
    })
  },

  // Scroll to section
  scrollToSection: (sectionId) => {
    const element = window.Utils.dom.getElementById(sectionId)
    if (element) {
      const { smoothScrollBehavior, smoothScrollBlock } = window.CONFIG.scroll
      window.Utils.animation.scrollToElement(element, smoothScrollBehavior, smoothScrollBlock)
    }
  },

  // Initialize mobile menu
  initMobileMenu: () => {
    const mobileMenuBtn = window.Utils.dom.getElementById("mobileMenuBtn")
    if (mobileMenuBtn) {
      window.Utils.events.on(mobileMenuBtn, "click", NavigationController.toggleMobileMenu)
    }

    // Close mobile menu when clicking on links
    const mobileMenuLinks = window.Utils.dom.querySelectorAll(".mobile-menu a")
    mobileMenuLinks.forEach((link) => {
      window.Utils.events.on(link, "click", () => {
        NavigationController.closeMobileMenu()
      })
    })

    // Close mobile menu when clicking outside
    window.Utils.events.on(document, "click", (e) => {
      const mobileMenu = window.Utils.dom.getElementById("mobileMenu")
      const mobileMenuBtn = window.Utils.dom.getElementById("mobileMenuBtn")

      if (NavigationController.mobileMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        NavigationController.closeMobileMenu()
      }
    })

    // Close mobile menu on escape key
    window.Utils.events.on(document, "keydown", (e) => {
      if (e.key === "Escape" && NavigationController.mobileMenuOpen) {
        NavigationController.closeMobileMenu()
      }
    })
  },

  // Toggle mobile menu
  toggleMobileMenu: () => {
    if (NavigationController.mobileMenuOpen) {
      NavigationController.closeMobileMenu()
    } else {
      NavigationController.openMobileMenu()
    }
  },

  // Open mobile menu
  openMobileMenu: () => {
    const mobileMenu = window.Utils.dom.getElementById("mobileMenu")
    const menuIcon = window.Utils.dom.getElementById("menuIcon")
    const closeIcon = window.Utils.dom.getElementById("closeIcon")

    NavigationController.mobileMenuOpen = true

    if (mobileMenu) window.Utils.dom.addClass(mobileMenu, "active")
    if (menuIcon) window.Utils.dom.setStyle(menuIcon, "display", "none")
    if (closeIcon) window.Utils.dom.setStyle(closeIcon, "display", "block")

    // Prevent body scroll
    window.Utils.dom.setStyle(document.body, "overflow", "hidden")
  },

  // Close mobile menu
  closeMobileMenu: () => {
    const mobileMenu = window.Utils.dom.getElementById("mobileMenu")
    const menuIcon = window.Utils.dom.getElementById("menuIcon")
    const closeIcon = window.Utils.dom.getElementById("closeIcon")

    NavigationController.mobileMenuOpen = false

    if (mobileMenu) window.Utils.dom.removeClass(mobileMenu, "active")
    if (menuIcon) window.Utils.dom.setStyle(menuIcon, "display", "block")
    if (closeIcon) window.Utils.dom.setStyle(closeIcon, "display", "none")

    // Restore body scroll
    window.Utils.dom.setStyle(document.body, "overflow", "")
  },

  // Initialize navbar scroll effect
  initNavbarScroll: () => {
    const navbar = window.Utils.dom.getElementById("navbar")
    if (!navbar) return

    const handleScroll = window.Utils.throttle(() => {
      const { navbarScrollThreshold } = window.CONFIG.scroll

      if (window.scrollY > navbarScrollThreshold) {
        window.Utils.dom.addClass(navbar, "scrolled")
      } else {
        window.Utils.dom.removeClass(navbar, "scrolled")
      }
    }, 16) // ~60fps

    window.Utils.events.on(window, "scroll", handleScroll)
  },

  // Initialize resize handler
  initResizeHandler: () => {
    const handleResize = window.Utils.debounce(() => {
      // Close mobile menu on resize to desktop
      if (window.Utils.device.isDesktop() && NavigationController.mobileMenuOpen) {
        NavigationController.closeMobileMenu()
      }

      // Update scroll indicator visibility
      const scrollIndicator = window.Utils.dom.getElementById("scrollIndicator")
      if (scrollIndicator) {
        if (window.Utils.device.isDesktop()) {
          window.Utils.dom.setStyle(scrollIndicator, "display", "block")
        } else {
          window.Utils.dom.setStyle(scrollIndicator, "display", "none")
        }
      }
    }, 250)

    window.Utils.events.on(window, "resize", handleResize)
  },
}

// Export scroll function globally for onclick handlers
window.scrollToSection = NavigationController.scrollToSection
window.toggleMobileMenu = NavigationController.toggleMobileMenu

// Export NavigationController to global scope
window.NavigationController = NavigationController
