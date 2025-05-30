// ملف المصادقة وإدارة المستخدمين
// يحتوي على وظائف تسجيل الدخول والخروج وإدارة المستخدمين

// التحقق من تسجيل الدخول
function checkAuth() {
    // التحقق من وجود مستخدم حالي
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    const currentUser = settings.current_user;
    
    // إذا كان المستخدم في صفحة لوحة الإدارة ولم يسجل الدخول
    if (window.location.pathname.includes('/pages/') && !currentUser) {
        // توجيه المستخدم إلى صفحة تسجيل الدخول
        window.location.href = '../login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return false;
    }
    
    // تحديث اسم المستخدم في الشريط العلوي
    const userNameElement = document.getElementById('currentUserName');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.name || currentUser.username;
    }
    
    // إضافة مستمع حدث لزر تسجيل الخروج
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    
    return true;
}

// تسجيل الدخول
function login(username, password) {
    // الحصول على المستخدمين
    const users = getUsers();
    
    // البحث عن المستخدم
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // تخزين المستخدم الحالي
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        settings.current_user = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email
        };
        localStorage.setItem('settings', JSON.stringify(settings));
        
        return { success: true, user: settings.current_user };
    }
    
    return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
}

// تسجيل الخروج
function logout() {
    // حذف المستخدم الحالي
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    delete settings.current_user;
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // توجيه المستخدم إلى الصفحة الرئيسية
    window.location.href = '../index.html';
}

// إضافة مستمعات الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة البيانات
    initializeData();
    
    // التحقق من وجود نموذج تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // الحصول على بيانات النموذج
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // تسجيل الدخول
            const result = login(username, password);
            
            if (result.success) {
                // التحقق من وجود صفحة إعادة توجيه
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                
                if (redirect) {
                    window.location.href = redirect;
                } else {
                    window.location.href = 'pages/dashboard.html';
                }
            } else {
                // عرض رسالة الخطأ
                const errorMessage = document.getElementById('loginErrorMessage');
                if (errorMessage) {
                    errorMessage.textContent = result.message;
                    errorMessage.style.display = 'block';
                }
            }
        });
    }
    
    // التحقق من تسجيل الدخول في صفحات لوحة الإدارة
    if (window.location.pathname.includes('/pages/')) {
        checkAuth();
    }
    
    // إضافة مستمع حدث للوضع الليلي
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
        
        // تطبيق الوضع الليلي إذا كان مفعلاً
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        if (settings.dark_mode) {
            document.body.classList.add('dark-mode');
            updateDarkModeButton();
        }
    }
});

// تبديل الوضع الليلي
function toggleDarkMode() {
    // تبديل الوضع الليلي
    document.body.classList.toggle('dark-mode');
    
    // تحديث الإعدادات
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    settings.dark_mode = document.body.classList.contains('dark-mode');
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // تحديث زر الوضع الليلي
    updateDarkModeButton();
}

// تحديث زر الوضع الليلي
function updateDarkModeButton() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // تحديث الأيقونة
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            icon.className = isDarkMode ? 'bi bi-sun' : 'bi bi-moon';
        }
        
        // تحديث النص
        const text = darkModeToggle.querySelector('span');
        if (text) {
            text.textContent = isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي';
        }
    }
}
