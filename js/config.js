// Configuration and Constants
const CONFIG = {
  // Typing animation configuration
  typing: {
    roles: ["Flutter Developer", "Mobile App Developer", "UI/UX Enthusiast", "Problem Solver"],
    typeSpeed: 100,
    deleteSpeed: 50,
    pauseTime: 2000,
  },

  // Animation configuration
  animations: {
    observerThreshold: 0.1,
    observerRootMargin: "0px 0px -50px 0px",
    transitionDuration: 600,
  },

  // Contact form configuration
  contact: {
    emailTo: "jaydeepvasoya88@gmail.com",
    emailSubjectPrefix: "Portfolio Contact: ",
    successMessage: "Email client opened successfully!",
    errorMessage: "There was an error. Please email directly at jaydeepvasoya88@gmail.com",
    clipboardMessage: "Could not open email client. Email address copied to clipboard: jaydeepvasoya88@gmail.com",
  },

  // Social media links
  social: {
    github: "https://github.com/jayvasoya-star/",
    linkedin: "https://www.linkedin.com/in/jaydeep-vasoya-634877282",
    instagram: "https://www.instagram.com/jay_vasoya_03?igsh=MTFmb3h2amYwc2gw",
    facebook: "https://www.facebook.com/share/1Vj9QvLGPx/",
    twitter: "https://x.com/JayVasoya4088?s=08",
    whatsapp: "https://wa.me/918488934088",
    email: "mailto:jaydeepvasoya88@gmail.com",
    resume: "https://drive.google.com/file/d/113GJW9eWE-hQrSLSFLTevJzdaphJIe9N/view?usp=sharing",
  },

  // Project links
  projects: {
    idleBillionaire: "https://play.google.com/store/apps/details?id=com.idle.billionaire&pcampaignid=web_share",
  },

  // Scroll behavior
  scroll: {
    navbarScrollThreshold: 50,
    smoothScrollBehavior: "smooth",
    smoothScrollBlock: "start",
  },
}

// Personal data
const PERSONAL_DATA = {
  name: "Jaydeep Vasoya",
  title: "Senior Flutter Developer",
  location: "Surat, Gujarat",
  experience: "1 year 4 months",
  bio: "I am a hardworking and ambitious professional who takes pride in my work and responsibilities. I believe in maintaining a balanced life by exploring new places, enjoying trips, and spending quality time with friends and colleagues. I consider myself an active, social, and optimistic individual who thrives on challenges and continuous growth.",
  email: "jaydeepvasoya88@gmail.com",
  phone: "+91 8488934088",
}

// Skills data
const SKILLS_DATA = [
  {
    category: "Mobile Development",
    icon: "smartphone",
    color: "blue",
    skills: ["Flutter", "Android"],
  },
  {
    category: "Programming Languages",
    icon: "code",
    color: "green",
    skills: ["Dart", "Java", "C++", "R&D"],
  },
  {
    category: "Database & Backend",
    icon: "database",
    color: "purple",
    skills: ["Firebase Database", "Firebase Firestore", "Hive", "SharedPreferences"],
  },
  {
    category: "Tools & Design",
    icon: "github",
    color: "yellow",
    skills: ["Git", "VS Code", "Android Studio", "Figma"],
  },
]

// Stats data
const STATS_DATA = [
  { icon: "code", label: "Projects Completed", value: "10+", color: "blue" },
  { icon: "smartphone", label: "Apps Developed", value: "10+", color: "green" },
  { icon: "users", label: "Happy Clients", value: "8+", color: "purple" },
  { icon: "trophy", label: "Years Experience", value: "1.4", color: "yellow" },
]

// Project data
const PROJECT_DATA = {
  title: "IDLE Billionaire - Build Business",
  description:
    "The Ultimate Business & Investment Game! Start from zero and grow your dummy money into a massive empire through smart strategy, business building, and simulated investments.",
  features: [
    "Build Virtual Businesses",
    "Simulated Stock Market Trading",
    "Virtual Real Estate Investment",
    "Risk-Free Gaming Experience",
  ],
  technologies: ["Flutter", "Dart", "Game Development", "Mobile App", "Firebase"],
  playStoreUrl: CONFIG.projects.idleBillionaire,
  imageAlt: "IDLE Billionaire Business Game",
}

// Export to global scope
window.CONFIG = CONFIG
window.PERSONAL_DATA = PERSONAL_DATA
window.SKILLS_DATA = SKILLS_DATA
window.STATS_DATA = STATS_DATA
window.PROJECT_DATA = PROJECT_DATA
