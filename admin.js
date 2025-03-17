// Admin Panel JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Kullanıcı giriş kontrolü
  checkAdminAccess()

  // Admin paneli istatistiklerini güncelle
  updateAdminStats()

  // Admin sekmelerini ayarla
  setupAdminTabs()

  // Dashboard içeriğini yükle
  loadDashboardContent()

  // Kullanıcılar tablosunu yükle
  loadUsersTable()

  // Konular tablosunu yükle
  loadTopicsTable()

  // Kategoriler tablosunu yükle
  loadCategoriesTable()

  // Modal işlemlerini ayarla
  setupModals()
})

// Admin erişim kontrolü
function checkAdminAccess() {
  // LocalStorage'dan kullanıcı bilgilerini al
  const savedUser = localStorage.getItem("forumUser")

  if (!savedUser) {
    // Kullanıcı giriş yapmamış, ana sayfaya yönlendir
    alert("Bu sayfaya erişmek için yönetici olarak giriş yapmalısınız.")
    window.location.href = "../index.html"
    return
  }

  try {
    const currentUser = JSON.parse(savedUser)

    // Kullanıcı yönetici değilse ana sayfaya yönlendir
    if (currentUser.role !== "Yönetici") {
      alert("Bu sayfaya erişmek için yönetici yetkilerine sahip olmalısınız.")
      window.location.href = "../index.html"
      return
    }

    // Kullanıcı bilgilerini güncelle
    document.getElementById("current-username").textContent = currentUser.username
    const avatarElements = document.querySelectorAll(".user-avatar")
    avatarElements.forEach((element) => {
      element.textContent = currentUser.username.charAt(0).toUpperCase()
    })
  } catch (error) {
    console.error("Kullanıcı bilgileri alınamadı:", error)
    window.location.href = "../index.html"
  }
}

// Admin paneli istatistiklerini güncelle
function updateAdminStats() {
  // Toplam konu sayısı
  const totalTopics = forumData.topics.length
  document.getElementById("admin-total-topics").textContent = totalTopics

  // Toplam üye sayısı
  const totalMembers = forumData.members.length
  document.getElementById("admin-total-members").textContent = totalMembers

  // Bildirim sayısı (örnek olarak 0)
  document.getElementById("admin-reported-content").textContent = "0"
}

// Admin sekmelerini ayarla
function setupAdminTabs() {
  const tabButtons = document.querySelectorAll(".admin-tab")
  const tabContents = document.querySelectorAll(".admin-tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")

      // Aktif sekmeyi değiştir
      tabButtons.forEach((btn) => {
        btn.classList.remove("active")
      })
      this.classList.add("active")

      // İçeriği göster/gizle
      tabContents.forEach((content) => {
        if (content.id === tabName + "-tab") {
          content.classList.add("active")
        } else {
          content.classList.remove("active")
        }
      })
    })
  })
}

// Dashboard içeriğini yükle
function loadDashboardContent() {
  // Son etkinlikleri yükle
  loadRecentActivities()

  // Son üyeleri yükle
  loadRecentMembers()

  // Son konuları yükle
  loadRecentTopics()
}

// Son etkinlikleri yükle
function loadRecentActivities() {
  const activityList = document.getElementById("admin-activity-list")
  if (!activityList) return

  // Örnek etkinlikler
  const activities = [
    { action: "Yeni üye kaydoldu", user: "YeniUye123", time: "10 dakika önce" },
    { action: "Yeni konu oluşturuldu", user: "TechGuru", time: "30 dakika önce" },
    { action: "Kullanıcı rolü değiştirildi", user: "Admin", time: "1 saat önce" },
    { action: "Kategori eklendi", user: "Admin", time: "2 saat önce" },
    { action: "Konu silindi", user: "Moderatör", time: "3 saat önce" },
  ]

  activityList.innerHTML = ""

  activities.forEach((activity) => {
    const activityItem = document.createElement("div")
    activityItem.className = "admin-activity-item"
    activityItem.innerHTML = `
      <div class="admin-activity-content">
        <strong>${activity.user}</strong> ${activity.action}
      </div>
      <div class="admin-activity-time">${activity.time}</div>
    `
    activityList.appendChild(activityItem)
  })
}

// Son üyeleri yükle
function loadRecentMembers() {
  const recentMembers = document.getElementById("admin-recent-members")
  if (!recentMembers) return

  // Üyeleri tarihe göre sırala (en yeniden en eskiye)
  const sortedMembers = [...forumData.members]
    .sort((a, b) => {
      return new Date(b.joinDate) - new Date(a.joinDate)
    })
    .slice(0, 5) // Sadece son 5 üyeyi göster

  recentMembers.innerHTML = ""

  if (sortedMembers.length === 0) {
    recentMembers.innerHTML = "<p>Henüz üye bulunmuyor.</p>"
    return
  }

  const membersList = document.createElement("ul")
  membersList.className = "admin-list"

  sortedMembers.forEach((member) => {
    const memberItem = document.createElement("li")
    memberItem.className = "admin-list-item"
    memberItem.innerHTML = `
      <div class="admin-list-item-content">
        <div class="avatar ${member.isOnline ? "online" : ""}">${member.username.charAt(0).toUpperCase()}</div>
        <div class="admin-list-item-info">
          <div class="admin-list-item-name">${member.username}</div>
          <div class="admin-list-item-meta">${member.role} • ${member.joinDate}</div>
        </div>
      </div>
    `
    membersList.appendChild(memberItem)
  })

  recentMembers.appendChild(membersList)
}

// Son konuları yükle
function loadRecentTopics() {
  const recentTopics = document.getElementById("admin-recent-topics")
  if (!recentTopics) return

  // Konuları tarihe göre sırala (en yeniden en eskiye)
  const sortedTopics = [...forumData.topics]
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
    .slice(0, 5) // Sadece son 5 konuyu göster

  recentTopics.innerHTML = ""

  if (sortedTopics.length === 0) {
    recentTopics.innerHTML = "<p>Henüz konu bulunmuyor.</p>"
    return
  }

  const topicsList = document.createElement("ul")
  topicsList.className = "admin-list"

  sortedTopics.forEach((topic) => {
    const category = forumData.categories.find((c) => c.id === topic.categoryId)

    const topicItem = document.createElement("li")
    topicItem.className = "admin-list-item"
    topicItem.innerHTML = `
      <div class="admin-list-item-content">
        <div class="admin-list-item-info">
          <div class="admin-list-item-name">${topic.title}</div>
          <div class="admin-list-item-meta">
            <span>${topic.author}</span> • 
            <span>${category ? category.title : "Bilinmeyen Kategori"}</span> • 
            <span>${topic.date}</span>
          </div>
        </div>
      </div>
    `
    topicsList.appendChild(topicItem)
  })

  recentTopics.appendChild(topicsList)
}

// Kullanıcılar tablosunu yükle
function loadUsersTable() {
  const usersTableBody = document.getElementById("users-table-body")
  if (!usersTableBody) return

  // Kullanıcı arama ve filtreleme işlevlerini ayarla
  setupUserSearch()

  // Kullanıcıları yükle
  displayUsers(forumData.members)
}

// Kullanıcı arama ve filtreleme
function setupUserSearch() {
  const userSearchInput = document.getElementById("user-search")
  const userSearchBtn = document.getElementById("user-search-btn")
  const userRoleFilter = document.getElementById("user-role-filter")

  if (!userSearchInput || !userSearchBtn || !userRoleFilter) return

  // Arama butonu
  userSearchBtn.addEventListener("click", filterUsers)

  // Enter tuşu ile arama
  userSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      filterUsers()
    }
  })

  // Rol filtresi değiştiğinde
  userRoleFilter.addEventListener("change", filterUsers)

  // Filtreleme fonksiyonu
  function filterUsers() {
    const searchQuery = userSearchInput.value.toLowerCase()
    const roleFilter = userRoleFilter.value

    // Filtreleme
    let filteredUsers = [...forumData.members]

    // Arama sorgusu
    if (searchQuery) {
      filteredUsers = filteredUsers.filter((user) => user.username.toLowerCase().includes(searchQuery))
    }

    // Rol filtresi
    if (roleFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) => {
        if (roleFilter === "admin") return user.role === "Yönetici"
        if (roleFilter === "moderator") return user.role === "Moderatör"
        if (roleFilter === "member") return user.role === "Üye"
        if (roleFilter === "banned") return user.status === "banned"
        return true
      })
    }

    // Sonuçları göster
    displayUsers(filteredUsers)
  }
}

// Kullanıcıları tabloda göster
function displayUsers(users) {
  const usersTableBody = document.getElementById("users-table-body")
  if (!usersTableBody) return

  usersTableBody.innerHTML = ""

  if (users.length === 0) {
    const emptyRow = document.createElement("tr")
    emptyRow.innerHTML = `<td colspan="7" class="text-center">Kullanıcı bulunamadı.</td>`
    usersTableBody.appendChild(emptyRow)
    return
  }

  users.forEach((user) => {
    const userRow = document.createElement("tr")

    // Kullanıcı durumu
    const status = user.status === "banned" ? "banned" : "active"
    const statusBadge = `<span class="admin-badge ${status}">${status === "banned" ? "Yasaklı" : "Aktif"}</span>`

    // Son görülme
    const lastSeen = user.isOnline ? "Çevrimiçi" : user.lastSeen || "Bilinmiyor"

    userRow.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>${user.joinDate}</td>
      <td>${lastSeen}</td>
      <td>${statusBadge}</td>
      <td>
        <div class="admin-actions">
          <button class="admin-action-btn edit" data-id="${user.id}" title="Düzenle">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="admin-action-btn delete" data-id="${user.id}" title="Sil">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    `

    usersTableBody.appendChild(userRow)
  })

  // Kullanıcı düzenleme butonlarını ayarla
  setupUserEditButtons()
}

// Kullanıcı düzenleme butonlarını ayarla
function setupUserEditButtons() {
  const editButtons = document.querySelectorAll(".admin-action-btn.edit")
  const deleteButtons = document.querySelectorAll(".admin-action-btn.delete")

  // Düzenleme butonları
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const userId = Number.parseInt(this.getAttribute("data-id"))
      openEditUserModal(userId)
    })
  })

  // Silme butonları
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const userId = Number.parseInt(this.getAttribute("data-id"))
      if (confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
        deleteUser(userId)
      }
    })
  })
}

// Kullanıcı düzenleme modalını aç
function openEditUserModal(userId) {
  const modal = document.getElementById("edit-user-modal")
  const form = document.getElementById("edit-user-form")
  const userIdInput = document.getElementById("edit-user-id")
  const usernameInput = document.getElementById("edit-username")
  const roleSelect = document.getElementById("edit-user-role")
  const statusSelect = document.getElementById("edit-user-status")
  const banReasonGroup = document.getElementById("ban-reason-group")

  // Kullanıcıyı bul
  const user = forumData.members.find((u) => u.id === userId)
  if (!user) return

  // Form alanlarını doldur
  userIdInput.value = user.id
  usernameInput.value = user.username
  roleSelect.value = user.role
  statusSelect.value = user.status === "banned" ? "banned" : "active"

  // Yasaklama durumuna göre sebep alanını göster/gizle
  if (statusSelect.value === "banned") {
    banReasonGroup.style.display = "block"
    document.getElementById("ban-reason").value = user.banReason || ""
  } else {
    banReasonGroup.style.display = "none"
  }

  // Durum değiştiğinde sebep alanını göster/gizle
  statusSelect.addEventListener("change", function () {
    if (this.value === "banned") {
      banReasonGroup.style.display = "block"
    } else {
      banReasonGroup.style.display = "none"
    }
  })

  // Modalı göster
  modal.style.display = "block"

  // Form gönderimini işle
  form.onsubmit = (e) => {
    e.preventDefault()

    // Kullanıcı bilgilerini güncelle
    const updatedUser = {
      ...user,
      role: roleSelect.value,
      status: statusSelect.value,
    }

    if (statusSelect.value === "banned") {
      updatedUser.banReason = document.getElementById("ban-reason").value
    } else {
      delete updatedUser.banReason
    }

    // Kullanıcıyı güncelle
    updateUser(updatedUser)

    // Modalı kapat
    modal.style.display = "none"
  }
}

// Kullanıcıyı güncelle
function updateUser(updatedUser) {
  // Kullanıcıyı bul ve güncelle
  const userIndex = forumData.members.findIndex((u) => u.id === updatedUser.id)
  if (userIndex !== -1) {
    forumData.members[userIndex] = updatedUser

    // LocalStorage'a kaydet
    localStorage.setItem("forumData", JSON.stringify(forumData))

    // Tabloyu güncelle
    loadUsersTable()

    alert("Kullanıcı başarıyla güncellendi!")
  }
}

// Kullanıcıyı sil
function deleteUser(userId) {
  // Kullanıcıyı bul
  const userIndex = forumData.members.findIndex((u) => u.id === userId)
  if (userIndex === -1) return

  // Kullanıcı adını al
  const username = forumData.members[userIndex].username

  // Kullanıcıyı sil
  forumData.members.splice(userIndex, 1)

  // Kullanıcının konularını ve yanıtlarını sil
  forumData.topics = forumData.topics.filter((topic) => topic.author !== username)
  forumData.replies = forumData.replies.filter((reply) => reply.author !== username)

  // LocalStorage'a kaydet
  localStorage.setItem("forumData", JSON.stringify(forumData))

  // Tabloyu güncelle
  loadUsersTable()

  alert("Kullanıcı başarıyla silindi!")
}

// Konular tablosunu yükle
function loadTopicsTable() {
  const topicsTableBody = document.getElementById("topics-table-body")
  if (!topicsTableBody) return

  // Kategori filtresini doldur
  const categoryFilter = document.getElementById("topic-category-filter")
  if (categoryFilter) {
    categoryFilter.innerHTML = '<option value="all">Tüm Kategoriler</option>'
    forumData.categories.forEach((category) => {
      categoryFilter.innerHTML += `<option value="${category.id}">${category.title}</option>`
    })
  }

  // Konu arama ve filtreleme işlevlerini ayarla
  setupTopicSearch()

  // Konuları yükle
  displayTopics(forumData.topics)
}

// Konu arama ve filtreleme
function setupTopicSearch() {
  const topicSearchInput = document.getElementById("topic-search")
  const topicSearchBtn = document.getElementById("topic-search-btn")
  const topicCategoryFilter = document.getElementById("topic-category-filter")

  if (!topicSearchInput || !topicSearchBtn || !topicCategoryFilter) return

  // Arama butonu
  topicSearchBtn.addEventListener("click", filterTopics)

  // Enter tuşu ile arama
  topicSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      filterTopics()
    }
  })

  // Kategori filtresi değiştiğinde
  topicCategoryFilter.addEventListener("change", filterTopics)

  // Filtreleme fonksiyonu
  function filterTopics() {
    const searchQuery = topicSearchInput.value.toLowerCase()
    const categoryFilter = topicCategoryFilter.value

    // Filtreleme
    let filteredTopics = [...forumData.topics]

    // Arama sorgusu
    if (searchQuery) {
      filteredTopics = filteredTopics.filter(
        (topic) => topic.title.toLowerCase().includes(searchQuery) || topic.content.toLowerCase().includes(searchQuery),
      )
    }

    // Kategori filtresi
    if (categoryFilter !== "all") {
      filteredTopics = filteredTopics.filter((topic) => topic.categoryId === Number.parseInt(categoryFilter))
    }

    // Sonuçları göster
    displayTopics(filteredTopics)
  }
}

// Konuları tabloda göster
function displayTopics(topics) {
  const topicsTableBody = document.getElementById("topics-table-body")
  if (!topicsTableBody) return

  topicsTableBody.innerHTML = ""

  if (topics.length === 0) {
    const emptyRow = document.createElement("tr")
    emptyRow.innerHTML = `<td colspan="8" class="text-center">Konu bulunamadı.</td>`
    topicsTableBody.appendChild(emptyRow)
    return
  }

  topics.forEach((topic) => {
    const topicRow = document.createElement("tr")

    // Kategori adını bul
    const category = forumData.categories.find((c) => c.id === topic.categoryId)
    const categoryName = category ? category.title : "Bilinmeyen"

    // Yanıt sayısını hesapla
    const repliesCount = forumData.replies.filter((reply) => reply.topicId === topic.id).length

    topicRow.innerHTML = `
      <td>${topic.id}</td>
      <td><a href="../topic.html?id=${topic.id}" target="_blank">${topic.title}</a></td>
      <td>${topic.author}</td>
      <td>${categoryName}</td>
      <td>${topic.date}</td>
      <td>${repliesCount}</td>
      <td>${topic.views}</td>
      <td>
        <div class="admin-actions">
          <button class="admin-action-btn edit" data-id="${topic.id}" title="Düzenle">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="admin-action-btn delete" data-id="${topic.id}" title="Sil">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    `

    topicsTableBody.appendChild(topicRow)
  })

  // Konu düzenleme butonlarını ayarla
  setupTopicEditButtons()
}

// Konu düzenleme butonlarını ayarla
function setupTopicEditButtons() {
  const editButtons = document.querySelectorAll("#topics-table-body .admin-action-btn.edit")
  const deleteButtons = document.querySelectorAll("#topics-table-body .admin-action-btn.delete")

  // Düzenleme butonları
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const topicId = Number.parseInt(this.getAttribute("data-id"))
      window.location.href = `../topic.html?id=${topicId}&edit=true`
    })
  })

  // Silme butonları
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const topicId = Number.parseInt(this.getAttribute("data-id"))
      openDeleteTopicModal(topicId)
    })
  })
}

// Konu silme modalını aç
function openDeleteTopicModal(topicId) {
  const modal = document.getElementById("delete-topic-modal")
  const confirmBtn = document.getElementById("confirm-delete-topic")

  // Modalı göster
  modal.style.display = "block"

  // Onay butonuna tıklandığında
  confirmBtn.onclick = () => {
    deleteTopic(topicId)
    modal.style.display = "none"
  }
}

// Konuyu sil
function deleteTopic(topicId) {
  // Konuyu bul
  const topicIndex = forumData.topics.findIndex((t) => t.id === topicId)
  if (topicIndex === -1) return

  // Konuyu sil
  forumData.topics.splice(topicIndex, 1)

  // Konuya ait yanıtları sil
  forumData.replies = forumData.replies.filter((reply) => reply.topicId !== topicId)

  // LocalStorage'a kaydet
  localStorage.setItem("forumData", JSON.stringify(forumData))

  // Tabloyu güncelle
  loadTopicsTable()

  alert("Konu başarıyla silindi!")
}

// Kategoriler tablosunu yükle
function loadCategoriesTable() {
  const categoriesTableBody = document.getElementById("categories-table-body")
  if (!categoriesTableBody) return

  categoriesTableBody.innerHTML = ""

  if (forumData.categories.length === 0) {
    const emptyRow = document.createElement("tr")
    emptyRow.innerHTML = `<td colspan="6" class="text-center">Kategori bulunamadı.</td>`
    categoriesTableBody.appendChild(emptyRow)
    return
  }

  forumData.categories.forEach((category) => {
    const categoryRow = document.createElement("tr")

    // Kategori için konu sayısını hesapla
    const topicsCount = forumData.topics.filter((topic) => topic.categoryId === category.id).length

    categoryRow.innerHTML = `
      <td>${category.id}</td>
      <td>${category.title}</td>
      <td>${category.description}</td>
      <td>${topicsCount}</td>
      <td>${category.lastActive}</td>
      <td>
        <div class="admin-actions">
          <button class="admin-action-btn edit" data-id="${category.id}" title="Düzenle">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="admin-action-btn delete" data-id="${category.id}" title="Sil">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    `

    categoriesTableBody.appendChild(categoryRow)
  })

  // Kategori düzenleme butonlarını ayarla
  setupCategoryEditButtons()

  // Yeni kategori ekleme butonunu ayarla
  const addCategoryBtn = document.getElementById("add-category-btn")
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", openAddCategoryModal)
  }
}

// Kategori düzenleme butonlarını ayarla
function setupCategoryEditButtons() {
  const editButtons = document.querySelectorAll("#categories-table-body .admin-action-btn.edit")
  const deleteButtons = document.querySelectorAll("#categories-table-body .admin-action-btn.delete")

  // Düzenleme butonları
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const categoryId = Number.parseInt(this.getAttribute("data-id"))
      openEditCategoryModal(categoryId)
    })
  })

  // Silme butonları
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const categoryId = Number.parseInt(this.getAttribute("data-id"))
      if (
        confirm(
          "Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve kategoriye ait tüm konular da silinecektir.",
        )
      ) {
        deleteCategory(categoryId)
      }
    })
  })
}

// Kategori ekleme modalını aç
function openAddCategoryModal() {
  const modal = document.getElementById("category-modal")
  const modalTitle = document.getElementById("category-modal-title")
  const form = document.getElementById("category-form")
  const categoryIdInput = document.getElementById("category-id")
  const categoryTitleInput = document.getElementById("category-title")
  const categoryDescriptionInput = document.getElementById("category-description")

  // Modal başlığını ayarla
  modalTitle.textContent = "Yeni Kategori"

  // Form alanlarını temizle
  categoryIdInput.value = ""
  categoryTitleInput.value = ""
  categoryDescriptionInput.value = ""

  // Modalı göster
  modal.style.display = "block"

  // Form gönderimini işle
  form.onsubmit = (e) => {
    e.preventDefault()

    // Yeni kategori oluştur
    const newCategoryId = forumData.categories.length > 0 ? Math.max(...forumData.categories.map((c) => c.id)) + 1 : 1

    const newCategory = {
      id: newCategoryId,
      title: categoryTitleInput.value,
      description: categoryDescriptionInput.value,
      lastActive: "Henüz aktivite yok",
    }

    // Kategoriyi ekle
    forumData.categories.push(newCategory)

    // LocalStorage'a kaydet
    localStorage.setItem("forumData", JSON.stringify(forumData))

    // Tabloyu güncelle
    loadCategoriesTable()

    // Modalı kapat
    modal.style.display = "none"

    alert("Kategori başarıyla eklendi!")
  }
}

// Kategori düzenleme modalını aç
function openEditCategoryModal(categoryId) {
  const modal = document.getElementById("category-modal")
  const modalTitle = document.getElementById("category-modal-title")
  const form = document.getElementById("category-form")
  const categoryIdInput = document.getElementById("category-id")
  const categoryTitleInput = document.getElementById("category-title")
  const categoryDescriptionInput = document.getElementById("category-description")

  // Kategoriyi bul
  const category = forumData.categories.find((c) => c.id === categoryId)
  if (!category) return

  // Modal başlığını ayarla
  modalTitle.textContent = "Kategori Düzenle"

  // Form alanlarını doldur
  categoryIdInput.value = category.id
  categoryTitleInput.value = category.title
  categoryDescriptionInput.value = category.description

  // Modalı göster
  modal.style.display = "block"

  // Form gönderimini işle
  form.onsubmit = (e) => {
    e.preventDefault()

    // Kategori bilgilerini güncelle
    const updatedCategory = {
      ...category,
      title: categoryTitleInput.value,
      description: categoryDescriptionInput.value,
    }

    // Kategoriyi güncelle
    const categoryIndex = forumData.categories.findIndex((c) => c.id === categoryId)
    if (categoryIndex !== -1) {
      forumData.categories[categoryIndex] = updatedCategory

      // LocalStorage'a kaydet
      localStorage.setItem("forumData", JSON.stringify(forumData))

      // Tabloyu güncelle
      loadCategoriesTable()

      alert("Kategori başarıyla güncellendi!")
    }

    // Modalı kapat
    modal.style.display = "none"
  }
}

// Kategoriyi sil
function deleteCategory(categoryId) {
  // Kategoriyi bul
  const categoryIndex = forumData.categories.findIndex((c) => c.id === categoryId)
  if (categoryIndex === -1) return

  // Kategoriyi sil
  forumData.categories.splice(categoryIndex, 1)

  // Kategoriye ait konuları bul
  const topicIds = forumData.topics.filter((topic) => topic.categoryId === categoryId).map((topic) => topic.id)

  // Kategoriye ait konuları sil
  forumData.topics = forumData.topics.filter((topic) => topic.categoryId !== categoryId)

  // Konulara ait yanıtları sil
  forumData.replies = forumData.replies.filter((reply) => !topicIds.includes(reply.topicId))

  // LocalStorage'a kaydet
  localStorage.setItem("forumData", JSON.stringify(forumData))

  // Tabloyu güncelle
  loadCategoriesTable()

  alert("Kategori başarıyla silindi!")
}

// Modal işlemlerini ayarla
function setupModals() {
  // Kullanıcı düzenleme modalı
  const editUserModal = document.getElementById("edit-user-modal")
  const closeEditUserModal = document.getElementById("close-edit-user-modal")
  const cancelEditUser = document.getElementById("cancel-edit-user")

  if (closeEditUserModal) {
    closeEditUserModal.onclick = () => {
      editUserModal.style.display = "none"
    }
  }

  if (cancelEditUser) {
    cancelEditUser.onclick = () => {
      editUserModal.style.display = "none"
    }
  }

  // Kategori modalı
  const categoryModal = document.getElementById("category-modal")
  const closeCategoryModal = document.getElementById("close-category-modal")
  const cancelCategory = document.getElementById("cancel-category")

  if (closeCategoryModal) {
    closeCategoryModal.onclick = () => {
      categoryModal.style.display = "none"
    }
  }

  if (cancelCategory) {
    cancelCategory.onclick = () => {
      categoryModal.style.display = "none"
    }
  }

  // Konu silme modalı
  const deleteTopicModal = document.getElementById("delete-topic-modal")
  const closeDeleteTopicModal = document.getElementById("close-delete-topic-modal")
  const cancelDeleteTopic = document.getElementById("cancel-delete-topic")

  if (closeDeleteTopicModal) {
    closeDeleteTopicModal.onclick = () => {
      deleteTopicModal.style.display = "none"
    }
  }

  if (cancelDeleteTopic) {
    cancelDeleteTopic.onclick = () => {
      deleteTopicModal.style.display = "none"
    }
  }

  // Modalların dışına tıklandığında kapatma
  window.onclick = (event) => {
    if (event.target === editUserModal) {
      editUserModal.style.display = "none"
    }
    if (event.target === categoryModal) {
      categoryModal.style.display = "none"
    }
    if (event.target === deleteTopicModal) {
      deleteTopicModal.style.display = "none"
    }
  }
}

