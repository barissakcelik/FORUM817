// Kullanıcı durumunu kontrol et
let isLoggedIn = false
let currentUser = null

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener("DOMContentLoaded", () => {
  console.log("Sayfa yüklendi")

  // LocalStorage'dan forum verilerini yükle
  loadForumDataFromLocalStorage()

  // Yılı ayarla
  setCurrentYear()

  // Kullanıcı durumunu kontrol et
  checkUserLoginStatus()

  // Sayfaya göre içeriği yükle
  const currentPage = getCurrentPage()
  console.log("Mevcut sayfa:", currentPage)

  // Sayfa başlığını ayarla
  updatePageTitle()

  if (currentPage === "index") {
    loadCategories()
    loadRecentTopics()
    updateForumStats()
  } else if (currentPage === "category") {
    loadCategory()
  } else if (currentPage === "topic") {
    loadTopic()
  } else if (currentPage === "new-topic") {
    setupNewTopicPage()
  } else if (currentPage === "profile") {
    loadProfilePage()
  } else if (currentPage === "settings") {
    setupSettingsPage()
  } else if (currentPage === "members") {
    loadMembersPage()
  } else if (currentPage === "search") {
    setupSearchPage()
  } else if (currentPage === "messages") {
    setupMessagesPage()
  } else if (currentPage === "login") {
    setupLoginForm()
  } else if (currentPage === "register") {
    setupRegisterForm()
  } else if (currentPage === "contact") {
    setupContactForm()
  } else if (
    currentPage === "about" ||
    currentPage === "privacy" ||
    currentPage === "terms" ||
    currentPage === "rules"
  ) {
    // Statik sayfalar için özel bir işlem yok
  }

  // Form gönderimlerini işle
  setupFormSubmissions()

  // Etkileşimli butonları ayarla
  setupActionButtons()

  // Çıkış butonunu ayarla
  setupLogoutButton()

  // Kullanıcı dropdown menüsünü ayarla
  setupUserDropdown()
})

// LocalStorage'dan forum verilerini yükle
function loadForumDataFromLocalStorage() {
  const savedForumData = localStorage.getItem("forumData")
  if (savedForumData) {
    try {
      const parsedData = JSON.parse(savedForumData)
      // Sadece geçerli verileri yükle
      if (parsedData.categories) forumData.categories = parsedData.categories
      if (parsedData.topics) forumData.topics = parsedData.topics
      if (parsedData.replies) forumData.replies = parsedData.replies
      if (parsedData.members) forumData.members = parsedData.members

      console.log("Forum verileri LocalStorage'dan yüklendi")
    } catch (error) {
      console.error("Forum verileri yüklenemedi:", error)
    }
  }
}

// Sayfa başlığını güncelle
function updatePageTitle() {
  document.title = "FORUM817 - " + getPageTitle()
}

// Sayfa başlığını belirle
function getPageTitle() {
  const currentPage = getCurrentPage()

  switch (currentPage) {
    case "index":
      return "Ana Sayfa"
    case "category":
      return "Kategori"
    case "topic":
      return "Konu"
    case "new-topic":
      return "Yeni Konu"
    case "profile":
      return "Profil"
    case "settings":
      return "Ayarlar"
    case "members":
      return "Üyeler"
    case "search":
      return "Arama"
    case "messages":
      return "Mesajlar"
    case "rules":
      return "Kurallar"
    case "about":
      return "Hakkımızda"
    case "contact":
      return "İletişim"
    case "privacy":
      return "Gizlilik"
    case "terms":
      return "Kullanım Şartları"
    default:
      return "Ana Sayfa"
  }
}

// Kullanıcı dropdown menüsünü ayarla
function setupUserDropdown() {
  const dropdownToggle = document.getElementById("user-dropdown-toggle")
  const dropdownMenu = document.getElementById("user-dropdown-menu")

  if (dropdownToggle && dropdownMenu) {
    // Tıklama ile açılıp kapanmasını sağla
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      dropdownMenu.classList.toggle("show")
    })

    // Hover ile açılıp kapanmasını sağla
    dropdownToggle.addEventListener("mouseenter", () => {
      dropdownMenu.classList.add("show")
    })

    dropdownMenu.addEventListener("mouseenter", () => {
      dropdownMenu.classList.add("show")
    })

    dropdownToggle.addEventListener("mouseleave", () => {
      // Menü dışına çıkıldığında menüyü kapat
      setTimeout(() => {
        if (!dropdownToggle.matches(":hover") && !dropdownMenu.matches(":hover")) {
          dropdownMenu.classList.remove("show")
        }
      }, 200)
    })

    dropdownMenu.addEventListener("mouseleave", () => {
      // Menü dışına çıkıldığında menüyü kapat
      setTimeout(() => {
        if (!dropdownToggle.matches(":hover") && !dropdownMenu.matches(":hover")) {
          dropdownMenu.classList.remove("show")
        }
      }, 200)
    })

    // Menü dışına tıklandığında kapanmasını sağla
    document.addEventListener("click", (e) => {
      if (!dropdownMenu.contains(e.target) && !dropdownToggle.contains(e.target)) {
        dropdownMenu.classList.remove("show")
      }
    })

    // Menü içindeki öğelere tıklandığında menünün kapanmamasını sağla
    dropdownMenu.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }
}

// Kullanıcı giriş durumunu kontrol et
function checkUserLoginStatus() {
  console.log("Kullanıcı giriş durumu kontrol ediliyor")

  // LocalStorage'dan kullanıcı bilgilerini al
  const savedUser = localStorage.getItem("forumUser")

  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser)
      isLoggedIn = true

      console.log("Kullanıcı giriş yapmış:", currentUser.username)

      // Kullanıcı bilgilerini güncelle
      updateUserInterface()

      // Admin kontrolü
      checkAdminStatus()
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error)
      // Hata durumunda kullanıcı bilgilerini temizle
      localStorage.removeItem("forumUser")
      isLoggedIn = false
      currentUser = null
    }
  } else {
    console.log("Kullanıcı giriş yapmamış")
    isLoggedIn = false
    currentUser = null
    updateUserInterface()
  }
}

// Admin durumunu kontrol et
function checkAdminStatus() {
  const adminLinks = document.getElementById("admin-links")

  if (adminLinks && currentUser && currentUser.role === "Yönetici") {
    adminLinks.style.display = "block"
  }
}

// Kullanıcı arayüzünü güncelle
function updateUserInterface() {
  console.log("Kullanıcı arayüzü güncelleniyor")

  const authButtons = document.getElementById("auth-buttons")
  const userProfile = document.getElementById("user-profile")

  if (!authButtons || !userProfile) {
    console.error("auth-buttons veya user-profile elementleri bulunamadı")
    return
  }

  if (isLoggedIn && currentUser) {
    console.log("Giriş yapmış kullanıcı için arayüz güncelleniyor")

    // Giriş yapmış kullanıcı için
    authButtons.style.display = "none"
    userProfile.style.display = "block"

    // Kullanıcı adını ve avatar harfini güncelle
    const usernameElements = document.querySelectorAll(".username")
    const avatarElements = document.querySelectorAll(".user-avatar")

    console.log("Username elementleri:", usernameElements.length)
    console.log("Avatar elementleri:", avatarElements.length)

    usernameElements.forEach((element) => {
      element.textContent = currentUser.username
    })

    avatarElements.forEach((element) => {
      element.textContent = currentUser.username.charAt(0).toUpperCase()
    })

    // Yanıt formunu göster, giriş mesajını gizle
    const replyForm = document.getElementById("reply-form-card")
    const loginToReply = document.getElementById("login-to-reply")

    if (replyForm && loginToReply) {
      replyForm.style.display = "block"
      loginToReply.style.display = "none"
    }
  } else {
    console.log("Giriş yapmamış kullanıcı için arayüz güncelleniyor")

    // Giriş yapmamış kullanıcı için
    authButtons.style.display = "flex"
    userProfile.style.display = "none"

    // Yanıt formunu gizle, giriş mesajını göster
    const replyForm = document.getElementById("reply-form-card")
    const loginToReply = document.getElementById("login-to-reply")

    if (replyForm && loginToReply) {
      replyForm.style.display = "none"
      loginToReply.style.display = "block"
    }
  }
}

// Çıkış butonunu ayarla
function setupLogoutButton() {
  const logoutBtn = document.getElementById("logout-btn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Kullanıcı bilgilerini temizle
      localStorage.removeItem("forumUser")
      isLoggedIn = false
      currentUser = null

      // Kullanıcı arayüzünü güncelle
      updateUserInterface()

      // Ana sayfaya yönlendir
      window.location.href = "index.html"
    })
  }
}

// Mevcut sayfayı belirle
function getCurrentPage() {
  const path = window.location.pathname
  const filename = path.split("/").pop()

  console.log("Dosya adı:", filename)

  if (!filename || filename === "" || filename === "index.html") {
    return "index"
  } else if (filename === "category.html") {
    return "category"
  } else if (filename === "topic.html") {
    return "topic"
  } else if (filename === "new-topic.html") {
    return "new-topic"
  } else if (filename === "login.html") {
    return "login"
  } else if (filename === "register.html") {
    return "register"
  } else if (filename === "profile.html") {
    return "profile"
  } else if (filename === "settings.html") {
    return "settings"
  } else if (filename === "members.html") {
    return "members"
  } else if (filename === "search.html") {
    return "search"
  } else if (filename === "messages.html") {
    return "messages"
  } else if (filename === "rules.html") {
    return "rules"
  } else if (filename === "about.html") {
    return "about"
  } else if (filename === "contact.html") {
    return "contact"
  } else if (filename === "privacy.html") {
    return "privacy"
  } else if (filename === "terms.html") {
    return "terms"
  }

  return "unknown"
}

// Yılı ayarla
function setCurrentYear() {
  const currentYearElements = document.querySelectorAll("#current-year")
  const currentYear = new Date().getFullYear()

  currentYearElements.forEach((element) => {
    element.textContent = currentYear
  })
}

// Ana sayfadaki kategorileri yükle
function loadCategories() {
  const categoriesContainer = document.getElementById("categories-container")
  if (!categoriesContainer) return

  categoriesContainer.innerHTML = ""

  // Kategorileri konu sayısına göre sırala
  const sortedCategories = [...forumData.categories].sort((a, b) => {
    const topicsA = forumData.topics.filter((topic) => topic.categoryId === a.id).length
    const topicsB = forumData.topics.filter((topic) => topic.categoryId === b.id).length
    return topicsB - topicsA
  })

  sortedCategories.forEach((category) => {
    // Her kategori için konu sayısını hesapla
    const topicsCount = forumData.topics.filter((topic) => topic.categoryId === category.id).length

    const categoryCard = document.createElement("div")
    categoryCard.className = "category-card"
    categoryCard.innerHTML = `
      <div class="category-header">
        <h3 class="category-title">
          <a href="category.html?id=${category.id}" class="category-link">${category.title}</a>
        </h3>
        <p class="category-description">${category.description}</p>
      </div>
      <div class="category-footer">
        <span class="category-stats">${topicsCount} konu</span>
        <span class="category-stats">Son aktivite: ${category.lastActive}</span>
      </div>
    `
    categoriesContainer.appendChild(categoryCard)
  })
}

// Son konuları yükle
function loadRecentTopics() {
  const recentTopicsContainer = document.getElementById("recent-topics-container")
  if (!recentTopicsContainer) return

  recentTopicsContainer.innerHTML = ""

  // Konuları tarihe göre sırala (en yeniden en eskiye)
  const sortedTopics = [...forumData.topics]
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
    .slice(0, 4) // Sadece son 4 konuyu göster

  sortedTopics.forEach((topic) => {
    // Konu için yanıt sayısını hesapla
    const repliesCount = forumData.replies.filter((reply) => reply.topicId === topic.id).length

    // Kategori bilgisini al
    const category = forumData.categories.find((c) => c.id === topic.categoryId)

    const topicCard = document.createElement("div")
    topicCard.className = "topic-card"
    topicCard.innerHTML = `
      <div class="topic-header">
        <h3 class="topic-title">
          <a href="topic.html?id=${topic.id}" class="topic-link">${topic.title}</a>
        </h3>
        <div class="topic-category">
          <span>Kategori: <a href="category.html?id=${topic.categoryId}">${category ? category.title : "Bilinmeyen"}</a></span>
        </div>
      </div>
      <div class="topic-footer">
        <div class="topic-author">
          <div class="avatar">${topic.author.charAt(0).toUpperCase()}</div>
          <span class="author-name">${topic.author}</span>
          <span class="topic-date">${topic.date}</span>
        </div>
        <div class="topic-stats">
          <div class="stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>${repliesCount}</span>
          </div>
          <div class="stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>${topic.views}</span>
          </div>
        </div>
      </div>
    `
    recentTopicsContainer.appendChild(topicCard)
  })
}

// Forum istatistiklerini güncelle
function updateForumStats() {
  // Toplam konu sayısı
  const totalTopics = forumData.topics.length
  const totalTopicsElement = document.getElementById("total-topics")
  if (totalTopicsElement) totalTopicsElement.textContent = totalTopics

  // Toplam yanıt sayısı
  const totalReplies = forumData.replies.length
  const totalRepliesElement = document.getElementById("total-replies")
  if (totalRepliesElement) totalRepliesElement.textContent = totalReplies

  // Toplam üye sayısı
  const totalMembers = forumData.members.length
  const totalMembersElement = document.getElementById("total-members")
  if (totalMembersElement) totalMembersElement.textContent = totalMembers

  // Çevrimiçi üye sayısı
  const onlineMembers = forumData.members.filter((member) => member.isOnline).length
  const onlineMembersElement = document.getElementById("online-members")
  if (onlineMembersElement) onlineMembersElement.textContent = onlineMembers
}

// Kategori sayfasını yükle
function loadCategory() {
  console.log("Kategori sayfası yükleniyor")

  const urlParams = new URLSearchParams(window.location.search)
  const categoryId = Number.parseInt(urlParams.get("id"))

  console.log("Kategori ID:", categoryId)

  if (!categoryId) {
    window.location.href = "index.html"
    return
  }

  // Kategori bilgilerini bul
  const category = forumData.categories.find((c) => c.id === categoryId)
  if (!category) {
    window.location.href = "index.html"
    return
  }

  console.log("Kategori bulundu:", category.title)

  // Kategori başlığı ve açıklamasını güncelle
  const categoryTitleElement = document.getElementById("category-title")
  const categoryDescriptionElement = document.getElementById("category-description")

  if (categoryTitleElement) categoryTitleElement.textContent = category.title
  if (categoryDescriptionElement) categoryDescriptionElement.textContent = category.description

  // Sayfa başlığını güncelle
  document.title = `FORUM817 - ${category.title}`

  // Yeni konu butonunu güncelle
  const newTopicBtn = document.getElementById("new-topic-btn")
  if (newTopicBtn) {
    console.log("Yeni konu butonu bulundu")

    // Butonun href özelliğini ayarla
    newTopicBtn.href = `new-topic.html?category=${categoryId}`

    // Butona tıklandığında doğru sayfaya yönlendirme
    newTopicBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Yeni konu butonuna tıklandı, yönlendiriliyor:", `new-topic.html?category=${categoryId}`)
      window.location.href = `new-topic.html?category=${categoryId}`
    })
  } else {
    console.error("Yeni konu butonu bulunamadı")
  }

  // Kategorideki konuları bul
  const topics = forumData.topics.filter((topic) => topic.categoryId === categoryId)
  const topicsContainer = document.getElementById("topics-container")
  const noTopicsMessage = document.getElementById("no-topics-message")

  if (!topicsContainer || !noTopicsMessage) {
    console.error("topics-container veya no-topics-message elementleri bulunamadı")
    return
  }

  // Konular varsa listele, yoksa mesaj göster
  if (topics.length === 0) {
    noTopicsMessage.style.display = "block"

    // İlk konu oluşturma butonunu ayarla
    const firstTopicBtn = document.getElementById("first-topic-btn")
    if (firstTopicBtn) {
      firstTopicBtn.href = `new-topic.html?category=${categoryId}`

      // Butona tıklandığında doğru sayfaya yönlendirme
      firstTopicBtn.addEventListener("click", (e) => {
        e.preventDefault()
        console.log("İlk konu butonuna tıklandı, yönlendiriliyor:", `new-topic.html?category=${categoryId}`)
        window.location.href = `new-topic.html?category=${categoryId}`
      })
    }
  } else {
    noTopicsMessage.style.display = "none"
    topicsContainer.innerHTML = ""

    topics.forEach((topic) => {
      // Konu için yanıt sayısını hesapla
      const repliesCount = forumData.replies.filter((reply) => reply.topicId === topic.id).length

      const topicCard = document.createElement("div")
      topicCard.className = "topic-card"
      topicCard.innerHTML = `
        <div class="topic-header">
          <h3 class="topic-title">
            <a href="topic.html?id=${topic.id}" class="topic-link">${topic.title}</a>
          </h3>
        </div>
        <div class="topic-footer">
          <div class="topic-author">
            <div class="avatar">${topic.author.charAt(0).toUpperCase()}</div>
            <span class="author-name">${topic.author}</span>
            <span class="topic-date">${topic.date}</span>
          </div>
          <div class="topic-stats">
            <div class="stat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>${repliesCount}</span>
            </div>
            <div class="stat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>${topic.views}</span>
            </div>
          </div>
        </div>
      `
      topicsContainer.appendChild(topicCard)
    })
  }
}

// Konu sayfasını yükle
function loadTopic() {
  const urlParams = new URLSearchParams(window.location.search)
  const topicId = Number.parseInt(urlParams.get("id"))

  if (!topicId) {
    window.location.href = "index.html"
    return
  }

  // Konu bilgilerini bul
  const topic = forumData.topics.find((t) => t.id === topicId)
  if (!topic) {
    document.body.innerHTML = `
      <div class="container text-center">
        <h1 class="page-title">Konu bulunamadı</h1>
        <a href="index.html" class="btn btn-primary">Ana Sayfaya Dön</a>
      </div>
    `
    return
  }

  // Görüntülenme sayısını artır
  topic.views++

  // LocalStorage'a kaydet
  localStorage.setItem("forumData", JSON.stringify(forumData))

  // Sayfa başlığını güncelle
  document.title = `FORUM817 - ${topic.title}`
  const topicTitleElement = document.getElementById("topic-title")
  if (topicTitleElement) topicTitleElement.textContent = topic.title

  // Kategori geri dönüş linkini güncelle
  const categoryBackLink = document.getElementById("category-back-link")
  if (categoryBackLink) {
    const linkElement = categoryBackLink.querySelector("a")
    if (linkElement) linkElement.href = `category.html?id=${topic.categoryId}`
  }

  // Ana gönderiyi yükle
  const mainPostEl = document.getElementById("main-post")
  if (mainPostEl) {
    mainPostEl.innerHTML = `
      <div class="post-header">
        <div class="post-author">
          <div class="avatar">${topic.author.charAt(0).toUpperCase()}</div>
          <div class="author-info">
            <div class="author-name">${topic.author}</div>
            <div class="author-role">${topic.authorRole}</div>
            <div class="post-date">${topic.date}</div>
          </div>
        </div>
      </div>
      <div class="post-content">
        ${topic.content.replace(/\n/g, "<br>")}
      </div>
      <div class="post-footer">
        <div class="post-actions">
          <button class="action-btn like-btn" data-likes="${topic.likes}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span>${topic.likes}</span>
          </button>
          <button class="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
            Bildir
          </button>
        </div>
        <button class="action-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Paylaş
        </button>
      </div>
    `
  }

  // Yanıtları yükle
  const replies = forumData.replies.filter((reply) => reply.topicId === topicId)
  const repliesContainer = document.getElementById("replies-container")
  const repliesTitle = document.getElementById("replies-title")

  if (repliesTitle) repliesTitle.textContent = `Yanıtlar (${replies.length})`

  if (repliesContainer) {
    repliesContainer.innerHTML = ""
    replies.forEach((reply) => {
      const replyCard = document.createElement("div")
      replyCard.className = "post-card reply"
      replyCard.innerHTML = `
        <div class="post-header">
          <div class="post-author">
            <div class="avatar">${reply.author.charAt(0).toUpperCase()}</div>
            <div class="author-info">
              <div class="author-name">${reply.author}</div>
              <div class="author-role">${reply.authorRole}</div>
              <div class="post-date">${reply.date}</div>
            </div>
          </div>
        </div>
        <div class="post-content">
          ${reply.content}
        </div>
        <div class="post-footer">
          <div class="post-actions">
            <button class="action-btn like-btn" data-likes="${reply.likes}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              <span>${reply.likes}</span>
            </button>
            <button class="action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              Bildir
            </button>
          </div>
        </div>
      `
      repliesContainer.appendChild(replyCard)
    })
  }

  // Yanıt gönderme butonunu ayarla
  const submitReplyBtn = document.getElementById("submit-reply-btn")
  if (submitReplyBtn) {
    submitReplyBtn.addEventListener("click", () => {
      if (!isLoggedIn) {
        alert("Yanıt yazabilmek için giriş yapmalısınız.")
        return
      }

      const replyTextarea = document.querySelector(".reply-textarea")
      if (!replyTextarea) return

      const replyContent = replyTextarea.value.trim()

      if (replyContent === "") {
        alert("Yanıt içeriği boş olamaz.")
        return
      }

      // Yeni yanıt oluştur
      const newReplyId = forumData.replies.length > 0 ? Math.max(...forumData.replies.map((r) => r.id)) + 1 : 1

      const newReply = {
        id: newReplyId,
        topicId: topicId,
        author: currentUser.username,
        authorRole: currentUser.role || "Üye",
        date: "Az önce",
        content: replyContent,
        likes: 0,
      }

      // Yanıtı ekle
      forumData.replies.push(newReply)

      // LocalStorage'a kaydet
      localStorage.setItem("forumData", JSON.stringify(forumData))

      // Sayfayı yenile
      alert("Yanıtınız gönderildi!")
      window.location.reload()
    })
  }
}

// Yeni konu sayfasını ayarla
function setupNewTopicPage() {
  console.log("Yeni konu sayfası ayarlanıyor")

  const urlParams = new URLSearchParams(window.location.search)
  const categoryId = Number.parseInt(urlParams.get("category"))

  console.log("Kategori ID:", categoryId)

  if (!categoryId) {
    console.error("Kategori ID bulunamadı")
    window.location.href = "index.html"
    return
  }

  // Kategori bilgilerini bul
  const category = forumData.categories.find((c) => c.id === categoryId)
  if (!category) {
    console.error("Kategori bulunamadı")
    window.location.href = "index.html"
    return
  }

  console.log("Kategori bulundu:", category.title)

  // Sayfa başlığını güncelle
  document.title = `FORUM817 - Yeni Konu: ${category.title}`

  // Geri dönüş linkini güncelle
  const categoryBackLink = document.getElementById("category-back-link")
  if (categoryBackLink) {
    const linkElement = categoryBackLink.querySelector("a")
    if (linkElement) {
      linkElement.href = `category.html?id=${categoryId}`
      linkElement.addEventListener("click", (e) => {
        e.preventDefault()
        window.location.href = `category.html?id=${categoryId}`
      })
    }
  }

  // İptal butonunu güncelle
  const cancelBtn = document.getElementById("cancel-btn")
  if (cancelBtn) {
    cancelBtn.href = `category.html?id=${categoryId}`
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault()
      window.location.href = `category.html?id=${categoryId}`
    })
  }

  // Form gönderimini işle
  const newTopicForm = document.querySelector(".new-topic-form")
  if (newTopicForm) {
    console.log("Yeni konu formu bulundu")

    newTopicForm.addEventListener("submit", (e) => {
      e.preventDefault()
      console.log("Form gönderildi")

      if (!isLoggedIn) {
        alert("Konu açabilmek için giriş yapmalısınız.")
        window.location.href = "login.html"
        return
      }

      const topicTitle = document.getElementById("topic-title").value.trim()
      const topicContent = document.getElementById("topic-content").value.trim()

      console.log("Konu başlığı:", topicTitle)
      console.log("Konu içeriği:", topicContent)

      if (topicTitle === "" || topicContent === "") {
        alert("Konu başlığı ve içeriği boş olamaz.")
        return
      }

      // Yeni konu oluştur
      const newTopicId = forumData.topics.length > 0 ? Math.max(...forumData.topics.map((t) => t.id)) + 1 : 1

      const newTopic = {
        id: newTopicId,
        categoryId: categoryId,
        title: topicTitle,
        author: currentUser.username,
        authorRole: currentUser.role || "Üye",
        date: "Az önce",
        views: 0,
        content: topicContent,
        likes: 0,
      }

      console.log("Yeni konu oluşturuldu:", newTopic)

      // Konuyu ekle
      forumData.topics.push(newTopic)

      // Kategori son aktivite zamanını güncelle
      const categoryIndex = forumData.categories.findIndex((c) => c.id === categoryId)
      if (categoryIndex !== -1) {
        forumData.categories[categoryIndex].lastActive = "Az önce"
      }

      // LocalStorage'a kaydet
      localStorage.setItem("forumData", JSON.stringify(forumData))

      alert("Konu başarıyla oluşturuldu!")
      window.location.href = `topic.html?id=${newTopicId}`
    })
  } else {
    console.error("Yeni konu formu bulunamadı")
  }
}

// Giriş formunu ayarla
function setupLoginForm() {
  console.log("Giriş formu ayarlanıyor")

  const loginForm = document.getElementById("login-form")
  if (!loginForm) {
    console.error("Giriş formu bulunamadı")
    return
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    if (!username || !password) {
      alert("Lütfen kullanıcı adı ve şifre girin.")
      return
    }

    // Kullanıcıyı bul
    const user = forumData.members.find((m) => m.username === username)

    if (!user) {
      alert("Kullanıcı adı veya şifre hatalı.")
      return
    }

    // Gerçek bir uygulamada, burada şifre doğrulaması yapılır
    // Bu demo için, kullanıcıyı giriş yapmış olarak işaretliyoruz

    // Kullanıcı bilgilerini kaydet
    currentUser = {
      username: user.username,
      role: user.role || "Üye",
    }

    isLoggedIn = true
    localStorage.setItem("forumUser", JSON.stringify(currentUser))

    console.log("Giriş başarılı:", currentUser)

    alert("Giriş başarılı!")
    window.location.href = "index.html"
  })
}

// Kayıt formunu ayarla
function setupRegisterForm() {
  console.log("Kayıt formu ayarlanıyor")

  const registerForm = document.querySelector(".auth-form")
  if (!registerForm) {
    console.error("Kayıt formu bulunamadı")
    return
  }

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Kayıt formu için basit doğrulama
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (!username || !email || !password || !confirmPassword) {
      alert("Lütfen tüm alanları doldurun.")
      return
    }

    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor!")
      return
    }

    // Kullanıcı adının benzersiz olup olmadığını kontrol et
    const existingUser = forumData.members.find((m) => m.username === username)

    if (existingUser) {
      alert("Bu kullanıcı adı zaten kullanılıyor.")
      return
    }

    // Yeni kullanıcı oluştur
    const newUserId = forumData.members.length > 0 ? Math.max(...forumData.members.map((m) => m.id)) + 1 : 1

    const newUser = {
      id: newUserId,
      username: username,
      role: "Üye",
      isOnline: true,
      joinDate: "Bugün",
      posts: 0,
      topics: 0,
    }

    // Kullanıcıyı ekle
    forumData.members.push(newUser)

    // LocalStorage'a kaydet
    localStorage.setItem("forumData", JSON.stringify(forumData))

    alert("Kayıt başarılı! Giriş yapabilirsiniz.")
    window.location.href = "login.html"
  })
}

// İletişim formunu ayarla
function setupContactForm() {
  const contactForm = document.getElementById("contact-form")
  if (!contactForm) return

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const subject = document.getElementById("subject").value
    const message = document.getElementById("message").value

    if (!name || !email || !subject || !message) {
      alert("Lütfen tüm alanları doldurun.")
      return
    }

    // Gerçek bir uygulamada, burada form verileri sunucuya gönderilir
    // Bu demo için, sadece bir başarı mesajı gösteriyoruz
    alert("Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.")
    contactForm.reset()
  })
}

// Üyeler sayfasını yükle
function loadMembersPage() {
  const membersList = document.getElementById("members-list")
  if (!membersList) return

  // Üyeleri yükle
  displayMembers(forumData.members)

  // Arama ve filtreleme işlevlerini ayarla
  setupMembersSearch()
}

// Üyeleri görüntüle
function displayMembers(members) {
  const membersList = document.getElementById("members-list")
  if (!membersList) return

  membersList.innerHTML = ""

  members.forEach((member) => {
    const memberCard = document.createElement("div")
    memberCard.className = "member-card"
    memberCard.innerHTML = `
      <div class="member-avatar">
        <div class="avatar ${member.isOnline ? "online" : ""}">${member.username.charAt(0).toUpperCase()}</div>
      </div>
      <div class="member-info">
        <h3 class="member-name">${member.username}</h3>
        <div class="member-role">${member.role}</div>
        <div class="member-joined">Üyelik: ${member.joinDate}</div>
        <div class="member-stats">
          <span class="member-stat">Konular: ${member.topics}</span>
          <span class="member-stat">Gönderiler: ${member.posts}</span>
        </div>
      </div>
    `
    membersList.appendChild(memberCard)
  })
}

// Üyeler sayfası arama ve filtreleme
function setupMembersSearch() {
  const memberSearchInput = document.getElementById("member-search")
  const memberSearchBtn = document.getElementById("member-search-btn")
  const membersSort = document.getElementById("members-sort")
  const membersRole = document.getElementById("members-role")
  const onlineOnly = document.getElementById("online-only")

  if (!memberSearchInput || !memberSearchBtn || !membersSort || !membersRole || !onlineOnly) return

  // Arama butonu
  memberSearchBtn.addEventListener("click", filterMembers)

  // Enter tuşu ile arama
  memberSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      filterMembers()
    }
  })

  // Filtreleme seçenekleri değiştiğinde
  membersSort.addEventListener("change", filterMembers)
  membersRole.addEventListener("change", filterMembers)
  onlineOnly.addEventListener("change", filterMembers)

  // Filtreleme fonksiyonu
  function filterMembers() {
    const searchQuery = memberSearchInput.value.toLowerCase()
    const sortBy = membersSort.value
    const roleFilter = membersRole.value
    const onlineOnlyChecked = onlineOnly.checked

    // Filtreleme
    let filteredMembers = [...forumData.members]

    // Arama sorgusu
    if (searchQuery) {
      filteredMembers = filteredMembers.filter((member) => member.username.toLowerCase().includes(searchQuery))
    }

    // Rol filtresi
    if (roleFilter !== "all") {
      filteredMembers = filteredMembers.filter((member) => {
        if (roleFilter === "admin") return member.role === "Yönetici"
        if (roleFilter === "moderator") return member.role === "Moderatör"
        if (roleFilter === "member") return member.role === "Üye"
        return true
      })
    }

    // Çevrimiçi filtresi
    if (onlineOnlyChecked) {
      filteredMembers = filteredMembers.filter((member) => member.isOnline)
    }

    // Sıralama
    filteredMembers.sort((a, b) => {
      if (sortBy === "username") return a.username.localeCompare(b.username)
      if (sortBy === "join-date") return new Date(b.joinDate) - new Date(a.joinDate)
      if (sortBy === "posts") return b.posts - a.posts
      if (sortBy === "topics") return b.topics - a.topics
      return 0
    })

    // Sonuçları göster
    displayMembers(filteredMembers)
  }
}

// Arama sayfasını ayarla
function setupSearchPage() {
  const searchForm = document.getElementById("search-form")
  const searchCategorySelect = document.getElementById("search-category")

  if (!searchForm || !searchCategorySelect) return

  // Kategorileri yükle
  forumData.categories.forEach((category) => {
    const option = document.createElement("option")
    option.value = category.id
    option.textContent = category.title
    searchCategorySelect.appendChild(option)
  })

  // Arama formunu ayarla
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const searchQuery = document.getElementById("search-query").value.trim()
    const searchType = document.querySelector('input[name="searchType"]:checked').value
    const searchSort = document.getElementById("search-sort").value
    const searchCategory = document.getElementById("search-category").value

    if (!searchQuery) {
      alert("Lütfen bir arama sorgusu girin.")
      return
    }

    // Arama yap
    performSearch(searchQuery, searchType, searchSort, searchCategory)
  })
}

// Arama işlemi
function performSearch(query, type, sort, category) {
  const searchResultsList = document.getElementById("search-results-list")
  const searchPlaceholder = document.getElementById("search-placeholder")
  const noResults = document.getElementById("no-results")

  if (!searchResultsList || !searchPlaceholder || !noResults) return

  // Arama sonuçlarını göster
  searchPlaceholder.style.display = "none"
  searchResultsList.style.display = "block"
  searchResultsList.innerHTML = ""

  // Arama sonuçlarını filtrele
  let results = []

  if (type === "all" || type === "topics") {
    const topicResults = forumData.topics.filter((topic) => {
      if (category !== "all" && topic.categoryId !== Number.parseInt(category)) return false
      return (
        topic.title.toLowerCase().includes(query.toLowerCase()) ||
        topic.content.toLowerCase().includes(query.toLowerCase())
      )
    })

    results = [
      ...results,
      ...topicResults.map((topic) => ({
        type: "topic",
        id: topic.id,
        title: topic.title,
        content: topic.content,
        author: topic.author,
        date: topic.date,
        categoryId: topic.categoryId,
      })),
    ]
  }

  if (type === "all" || type === "posts") {
    const postResults = forumData.replies.filter((reply) => {
      const topic = forumData.topics.find((t) => t.id === reply.topicId)
      if (category !== "all" && topic && topic.categoryId !== Number.parseInt(category)) return false
      return reply.content.toLowerCase().includes(query.toLowerCase())
    })

    results = [
      ...results,
      ...postResults.map((reply) => {
        const topic = forumData.topics.find((t) => t.id === reply.topicId)
        return {
          type: "post",
          id: reply.id,
          topicId: reply.topicId,
          topicTitle: topic ? topic.title : "Bilinmeyen Konu",
          content: reply.content,
          author: reply.author,
          date: reply.date,
        }
      }),
    ]
  }

  if (type === "all" || type === "users") {
    const userResults = forumData.members.filter((member) =>
      member.username.toLowerCase().includes(query.toLowerCase()),
    )

    results = [
      ...results,
      ...userResults.map((member) => ({
        type: "user",
        id: member.id,
        username: member.username,
        role: member.role,
        joinDate: member.joinDate,
      })),
    ]
  }

  // Sonuçları sırala
  results.sort((a, b) => {
    if (sort === "date-desc") return new Date(b.date) - new Date(a.date)
    if (sort === "date-asc") return new Date(a.date) - new Date(b.date)
    // Diğer sıralama seçenekleri için ek mantık eklenebilir
    return 0
  })

  // Sonuçları göster
  if (results.length === 0) {
    noResults.style.display = "block"
    searchResultsList.style.display = "none"
  } else {
    noResults.style.display = "none"

    results.forEach((result) => {
      const resultItem = document.createElement("div")
      resultItem.className = "search-result-item"

      if (result.type === "topic") {
        const category = forumData.categories.find((c) => c.id === result.categoryId)
        resultItem.innerHTML = `
          <div class="result-header">
            <h3 class="result-title">
              <a href="topic.html?id=${result.id}">${result.title}</a>
            </h3>
            <div class="result-meta">
              <span class="result-type">Konu</span>
              <span class="result-category">Kategori: ${category ? category.title : "Bilinmeyen"}</span>
            </div>
          </div>
          <div class="result-content">
            ${result.content.substring(0, 150)}${result.content.length > 150 ? "..." : ""}
          </div>
          <div class="result-footer">
            <div class="result-author">${result.author}</div>
            <div class="result-date">${result.date}</div>
          </div>
        `
      } else if (result.type === "post") {
        resultItem.innerHTML = `
          <div class="result-header">
            <h3 class="result-title">
              <a href="topic.html?id=${result.topicId}">Yanıt: ${result.topicTitle}</a>
            </h3>
            <div class="result-meta">
              <span class="result-type">Gönderi</span>
            </div>
          </div>
          <div class="result-content">
            ${result.content.substring(0, 150)}${result.content.length > 150 ? "..." : ""}
          </div>
          <div class="result-footer">
            <div class="result-author">${result.author}</div>
            <div class="result-date">${result.date}</div>
          </div>
        `
      } else if (result.type === "user") {
        resultItem.innerHTML = `
          <div class="result-header">
            <h3 class="result-title">
              <a href="profile.html?username=${result.username}">${result.username}</a>
            </h3>
            <div class="result-meta">
              <span class="result-type">Kullanıcı</span>
              <span class="result-role">${result.role}</span>
            </div>
          </div>
          <div class="result-footer">
            <div class="result-joined">Üyelik: ${result.joinDate}</div>
          </div>
        `
      }

      searchResultsList.appendChild(resultItem)
    })
  }
}

// Profil sayfasını yükle
function loadProfilePage() {
  if (!isLoggedIn) {
    alert("Profil sayfasına erişmek için giriş yapmalısınız.")
    window.location.href = "login.html"
    return
  }

  // Kullanıcı bilgilerini al
  const profileUsername = document.getElementById("profile-username")
  const profileRole = document.getElementById("profile-role")
  const profileJoinedDate = document.getElementById("profile-joined-date")
  const profileAvatarLetter = document.getElementById("profile-avatar-letter")

  if (profileUsername) profileUsername.textContent = currentUser.username
  if (profileRole) profileRole.textContent = currentUser.role || "Üye"
  if (profileJoinedDate) profileJoinedDate.textContent = "1 Ocak 2023" // Örnek tarih
  if (profileAvatarLetter) profileAvatarLetter.textContent = currentUser.username.charAt(0).toUpperCase()

  // Profil sekmelerini aktif hale getir
  setupProfileTabs()

  // Kullanıcının konularını ve gönderilerini yükle
  loadUserTopics(currentUser.username)
  loadUserPosts(currentUser.username)

  // İstatistikleri yükle
  updateUserStats(currentUser.username)
}

// Profil sekmelerini ayarla
function setupProfileTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  if (!tabButtons.length || !tabContents.length) return

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Aktif sekmeyi değiştir
      tabButtons.forEach((btn) => {
        btn.classList.remove("active")
      })
      this.classList.add("active")

      // İçeriği göster/gizle
      const tabId = this.getAttribute("data-tab")
      tabContents.forEach((content) => {
        if (content.id === tabId) {
          content.classList.add("active")
        } else {
          content.classList.remove("active")
        }
      })
    })
  })

  // İlk sekmeyi aktif yap
  if (tabButtons[0] && tabContents[0]) {
    tabButtons[0].classList.add("active")
    tabContents[0].classList.add("active")
  }
}

// Kullanıcının konularını yükle
function loadUserTopics(username) {
  const userTopicsContainer = document.getElementById("user-topics-container")
  if (!userTopicsContainer) return

  const userTopics = forumData.topics.filter((topic) => topic.author === username)

  if (userTopics.length === 0) {
    userTopicsContainer.innerHTML = '<p class="no-content-message">Henüz konu bulunmuyor.</p>'
    return
  }

  userTopicsContainer.innerHTML = ""

  userTopics.forEach((topic) => {
    const category = forumData.categories.find((c) => c.id === topic.categoryId)
    const repliesCount = forumData.replies.filter((reply) => reply.topicId === topic.id).length

    const topicCard = document.createElement("div")
    topicCard.className = "topic-card"
    topicCard.innerHTML = `
      <div class="topic-header">
        <h3 class="topic-title">
          <a href="topic.html?id=${topic.id}" class="topic-link">${topic.title}</a>
        </h3>
        <div class="topic-category">
          <span>Kategori: <a href="category.html?id=${topic.categoryId}">${category ? category.title : "Bilinmeyen"}</a></span>
        </div>
      </div>
      <div class="topic-footer">
        <div class="topic-date">${topic.date}</div>
        <div class="topic-stats">
          <div class="stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>${repliesCount}</span>
          </div>
          <div class="stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>${topic.views}</span>
          </div>
        </div>
      </div>
    `
    userTopicsContainer.appendChild(topicCard)
  })
}

// Kullanıcının gönderilerini yükle
function loadUserPosts(username) {
  const userPostsContainer = document.getElementById("user-posts-container")
  if (!userPostsContainer) return

  const userReplies = forumData.replies.filter((reply) => reply.author === username)

  if (userReplies.length === 0) {
    userPostsContainer.innerHTML = '<p class="no-content-message">Henüz gönderi bulunmuyor.</p>'
    return
  }

  userPostsContainer.innerHTML = ""

  userReplies.forEach((reply) => {
    const topic = forumData.topics.find((t) => t.id === reply.topicId)

    const postCard = document.createElement("div")
    postCard.className = "post-card"
    postCard.innerHTML = `
      <div class="post-header">
        <div class="post-topic">
          <a href="topic.html?id=${reply.topicId}">${topic ? topic.title : "Bilinmeyen Konu"}</a>
        </div>
        <div class="post-date">${reply.date}</div>
      </div>
      <div class="post-content">
        ${reply.content.length > 200 ? reply.content.substring(0, 200) + "..." : reply.content}
      </div>
      <div class="post-footer">
        <div class="post-actions">
          <div class="stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span>${reply.likes}</span>
          </div>
        </div>
      </div>
    `
    userPostsContainer.appendChild(postCard)
  })
}

// Kullanıcı istatistiklerini güncelle
function updateUserStats(username) {
  const userTopicsCount = document.getElementById("user-topics-count")
  const userPostsCount = document.getElementById("user-posts-count")
  const userLikesCount = document.getElementById("user-likes-count")

  if (!userTopicsCount || !userPostsCount || !userLikesCount) return

  // Konu sayısı
  const topicsCount = forumData.topics.filter((topic) => topic.author === username).length
  userTopicsCount.textContent = topicsCount

  // Gönderi sayısı
  const postsCount = forumData.replies.filter((reply) => reply.author === username).length
  userPostsCount.textContent = postsCount

  // Beğeni sayısı
  let likesCount = 0

  // Konulardaki beğeniler
  forumData.topics.forEach((topic) => {
    if (topic.author === username) {
      likesCount += topic.likes
    }
  })

  // Yanıtlardaki beğeniler
  forumData.replies.forEach((reply) => {
    if (reply.author === username) {
      likesCount += reply.likes
    }
  })

  userLikesCount.textContent = likesCount
}

// Ayarlar sayfasını ayarla
function setupSettingsPage() {
  if (!isLoggedIn) {
    alert("Ayarlar sayfasına erişmek için giriş yapmalısınız.")
    window.location.href = "login.html"
    return
  }

  // Ayarlar sekmelerini ayarla
  const navItems = document.querySelectorAll(".settings-nav-item")
  const tabContents = document.querySelectorAll(".settings-tab")

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")

      // Aktif sekmeyi değiştir
      navItems.forEach((navItem) => {
        navItem.classList.remove("active")
      })
      this.classList.add("active")

      // İçeriği göster/gizle
      tabContents.forEach((content) => {
        if (content.id === `${tabName}-tab`) {
          content.classList.add("active")
        } else {
          content.classList.remove("active")
        }
      })
    })
  })

  // Form gönderimlerini işle
  const settingsForms = document.querySelectorAll(".settings-form")

  settingsForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      if (!isLoggedIn) {
        alert("Ayarları değiştirmek için giriş yapmalısınız.")
        return
      }

      // Form verilerini al
      const formData = new FormData(form)
      const formId = form.id

      // Profil ayarları formu
      if (formId === "profile-form") {
        const bio = formData.get("bio")
        const location = formData.get("location")
        const website = formData.get("website")

        // Kullanıcı bilgilerini güncelle
        if (!currentUser.profile) {
          currentUser.profile = {}
        }

        currentUser.profile.bio = bio
        currentUser.profile.location = location
        currentUser.profile.website = website

        // LocalStorage'a kaydet
        localStorage.setItem("forumUser", JSON.stringify(currentUser))

        alert("Profil ayarları kaydedildi!")
      }
      // Hesap ayarları formu
      else if (formId === "account-form") {
        const email = formData.get("email")

        // Kullanıcı bilgilerini güncelle
        if (email) {
          currentUser.email = email
        }

        // LocalStorage'a kaydet
        localStorage.setItem("forumUser", JSON.stringify(currentUser))

        alert("Hesap ayarları kaydedildi!")
      }
      // Şifre değiştirme formu
      else if (formId === "password-form") {
        const currentPassword = formData.get("currentPassword")
        const newPassword = formData.get("password")
        const confirmPassword = formData.get("confirmPassword")

        if (!currentPassword || !newPassword || !confirmPassword) {
          alert("Lütfen tüm alanları doldurun.")
          return
        }

        if (newPassword !== confirmPassword) {
          alert("Yeni şifreler eşleşmiyor!")
          return
        }

        // Gerçek bir uygulamada, burada mevcut şifre doğrulaması yapılır
        // Bu demo için, şifre değişikliğini kabul ediyoruz

        alert("Şifreniz başarıyla değiştirildi!")
        form.reset()
      }
      // Bildirim ayarları formu
      else if (formId === "notifications-form") {
        const emailNotifications = formData.get("emailNotifications") === "on"
        const mentionNotifications = formData.get("mentionNotifications") === "on"
        const replyNotifications = formData.get("replyNotifications") === "on"

        // Kullanıcı bilgilerini güncelle
        if (!currentUser.preferences) {
          currentUser.preferences = {}
        }

        currentUser.preferences.emailNotifications = emailNotifications
        currentUser.preferences.mentionNotifications = mentionNotifications
        currentUser.preferences.replyNotifications = replyNotifications

        // LocalStorage'a kaydet
        localStorage.setItem("forumUser", JSON.stringify(currentUser))

        alert("Bildirim ayarları kaydedildi!")
      }
      // Gizlilik ayarları formu
      else if (formId === "privacy-form") {
        const profileVisibility = formData.get("profileVisibility")
        const onlineStatus = formData.get("onlineStatus") === "on"

        // Kullanıcı bilgilerini güncelle
        if (!currentUser.privacy) {
          currentUser.privacy = {}
        }

        currentUser.privacy.profileVisibility = profileVisibility
        currentUser.privacy.showOnlineStatus = onlineStatus

        // LocalStorage'a kaydet
        localStorage.setItem("forumUser", JSON.stringify(currentUser))

        alert("Gizlilik ayarları kaydedildi!")
      }
    })
  })
}

// Form gönderimlerini işle
function setupFormSubmissions() {
  // Bu fonksiyon, sayfaya özgü form işlemleri dışındaki genel form işlemlerini ele alabilir
}

// Etkileşimli butonları ayarla
function setupActionButtons() {
  // Beğeni butonları
  const likeButtons = document.querySelectorAll(".like-btn")
  likeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (!isLoggedIn) {
        alert("Beğenmek için giriş yapmalısınız.")
        return
      }

      const likesSpan = this.querySelector("span")
      let likes = Number.parseInt(this.getAttribute("data-likes"))

      if (this.classList.contains("active")) {
        // Beğeniyi kaldır
        likes--
        this.classList.remove("active")
      } else {
        // Beğen
        likes++
        this.classList.add("active")
      }

      this.setAttribute("data-likes", likes)
      likesSpan.textContent = likes

      // Gerçek bir uygulamada, burada beğeni veritabanına kaydedilir
    })
  })
}

// Mesajlar sayfasını ayarla
function setupMessagesPage() {
  if (!isLoggedIn) {
    alert("Mesajlar sayfasına erişmek için giriş yapmalısınız.")
    window.location.href = "login.html"
    return
  }

  // Mesajlar sayfası için gerekli işlemler burada yapılabilir
  // Bu demo için, mesajlar özelliği tam olarak uygulanmamıştır
}

