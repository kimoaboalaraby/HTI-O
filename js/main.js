// الملف الرئيسي للجافاسكريبت
// يحتوي على وظائف عامة وتهيئة الصفحة

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة البيانات
    initializeData();
    
    // تحديث عداد الساعات المعتمدة في الشريط العلوي
    updateCreditHoursCounter();
    
    // إضافة مستمعات الأحداث
    setupGlobalEventListeners();
    
    // تحديد الصفحة الحالية وتنفيذ الوظائف الخاصة بها
    handleCurrentPage();
});

// إضافة مستمعات الأحداث العامة
function setupGlobalEventListeners() {
    // مستمع حدث للوضع الليلي
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
    
    // مستمع حدث لتغيير حد الساعات المعتمدة
    const creditHoursLimit = document.getElementById('creditHoursLimit');
    if (creditHoursLimit) {
        creditHoursLimit.addEventListener('change', function() {
            setCreditHoursLimit(parseInt(this.value));
            updateCreditHoursCounter();
        });
        
        // تحديث قيمة القائمة المنسدلة
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        creditHoursLimit.value = settings.credit_hours_limit || 18;
    }
}

// تحديد الصفحة الحالية وتنفيذ الوظائف الخاصة بها
function handleCurrentPage() {
    const path = window.location.pathname;
    
    if (path.endsWith('index.html') || path.endsWith('/')) {
        // الصفحة الرئيسية
        setupHomePage();
    } else if (path.includes('courses.html') && !path.includes('/pages/')) {
        // صفحة المواد الدراسية
        setupCoursesPage();
    } else if (path.includes('schedule.html')) {
        // صفحة الجدول الدراسي
        setupSchedulePage();
    } else if (path.includes('login.html')) {
        // صفحة تسجيل الدخول
        setupLoginPage();
    }
}

// تهيئة الصفحة الرئيسية
function setupHomePage() {
    // عرض إحصائيات الموقع
    displaySiteStats();
    
    // عرض آخر المواد المضافة
    displayFeaturedCourses();
}

// عرض إحصائيات الموقع
function displaySiteStats() {
    const coursesCount = document.getElementById('coursesCount');
    const departmentsCount = document.getElementById('departmentsCount');
    const professorsCount = document.getElementById('professorsCount');
    
    if (coursesCount && departmentsCount && professorsCount) {
        const courses = getCourses();
        const departments = getDepartments();
        
        // حساب عدد الأساتذة الفريدين
        const professors = new Set();
        const groups = getGroups();
        groups.forEach(group => {
            professors.add(group.professor);
        });
        
        coursesCount.textContent = courses.length;
        departmentsCount.textContent = departments.length;
        professorsCount.textContent = professors.size;
    }
}

// عرض آخر المواد المضافة
function displayFeaturedCourses() {
    const featuredCoursesList = document.getElementById('featuredCoursesList');
    if (!featuredCoursesList) return;
    
    // الحصول على المواد
    const courses = getCourses();
    
    // ترتيب المواد عشوائياً
    const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());
    
    // عرض 4 مواد
    const featuredCourses = shuffledCourses.slice(0, 4);
    
    // إفراغ قائمة المواد
    featuredCoursesList.innerHTML = '';
    
    // عرض المواد
    featuredCourses.forEach(course => {
        // الحصول على اسم القسم
        const departmentName = getDepartmentName(course.department_id);
        
        // حساب عدد المجموعات
        const groupsCount = getGroupsByCourseId(course.id).length;
        
        // إنشاء بطاقة المادة
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-3 mb-4';
        card.innerHTML = `
            <div class="card h-100">
                <div class="card-header">
                    <h3 class="card-title">${course.name}</h3>
                </div>
                <div class="card-body">
                    <p class="card-text">${course.description || 'لا يوجد وصف متاح'}</p>
                    <div class="course-info">
                        <div class="course-info-item">
                            <i class="bi bi-building"></i>
                            <span>${departmentName}</span>
                        </div>
                        <div class="course-info-item">
                            <i class="bi bi-clock"></i>
                            <span>${course.credit_hours} ساعات معتمدة</span>
                        </div>
                        <div class="course-info-item">
                            <i class="bi bi-people"></i>
                            <span>${groupsCount} مجموعات</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <a href="courses.html?course=${course.id}" class="btn btn-primary">
                        <i class="bi bi-info-circle"></i>
                        تفاصيل المادة
                    </a>
                </div>
            </div>
        `;
        
        featuredCoursesList.appendChild(card);
    });
}

// تهيئة صفحة المواد الدراسية
function setupCoursesPage() {
    // عرض المواد حسب القسم
    displayCoursesByDepartment();
    
    // إضافة مستمعات الأحداث
    setupCoursesEventListeners();
}

// عرض المواد حسب القسم
function displayCoursesByDepartment() {
    const coursesList = document.getElementById('coursesList');
    if (!coursesList) return;
    
    // الحصول على معرف القسم من عنوان URL
    const urlParams = new URLSearchParams(window.location.search);
    const departmentId = urlParams.get('department') ? parseInt(urlParams.get('department')) : null;
    const courseId = urlParams.get('course') ? parseInt(urlParams.get('course')) : null;
    
    // الحصول على المواد
    let courses = getCourses();
    
    // تصفية المواد حسب القسم
    if (departmentId) {
        courses = courses.filter(course => course.department_id === departmentId);
        
        // تحديث عنوان الصفحة
        const departmentName = getDepartmentName(departmentId);
        const pageTitle = document.querySelector('h2');
        if (pageTitle) {
            pageTitle.textContent = `مواد ${departmentName}`;
        }
    }
    
    // إذا تم تحديد مادة معينة، عرض تفاصيلها
    if (courseId) {
        const course = getCourseById(courseId);
        if (course) {
            displayCourseDetails(course);
            return;
        }
    }
    
    // إفراغ قائمة المواد
    coursesList.innerHTML = '';
    
    // عرض المواد
    courses.forEach(course => {
        // الحصول على اسم القسم
        const departmentName = getDepartmentName(course.department_id);
        
        // الحصول على المجموعات
        const groups = getGroupsByCourseId(course.id);
        
        // إنشاء بطاقة المادة
        const card = document.createElement('div');
        card.className = 'card mb-4';
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${course.name}</h3>
                <div class="card-subtitle">${departmentName} - ${course.credit_hours} ساعات معتمدة</div>
            </div>
            <div class="card-body">
                <p class="card-text">${course.description || 'لا يوجد وصف متاح'}</p>
                
                <h4 class="mt-4">المجموعات المتاحة</h4>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>المجموعة</th>
                                <th>الأستاذ</th>
                                <th>الموعد</th>
                                <th>القاعة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="groups-${course.id}">
                            ${groups.map(group => `
                                <tr>
                                    <td>${group.group_name}</td>
                                    <td>${group.professor}</td>
                                    <td>${group.schedule.day} ${group.schedule.time}</td>
                                    <td>${group.schedule.room}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm register-button" data-course-id="${course.id}" data-group-id="${group.id}">
                                            <i class="bi bi-plus-circle"></i>
                                            تسجيل
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        coursesList.appendChild(card);
    });
    
    // عرض رسالة إذا لم تكن هناك مواد
    if (courses.length === 0) {
        coursesList.innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle"></i>
                <span>لا توجد مواد متاحة في هذا القسم</span>
            </div>
        `;
    }
}

// عرض تفاصيل مادة معينة
function displayCourseDetails(course) {
    const coursesList = document.getElementById('coursesList');
    if (!coursesList) return;
    
    // الحصول على اسم القسم
    const departmentName = getDepartmentName(course.department_id);
    
    // الحصول على المجموعات
    const groups = getGroupsByCourseId(course.id);
    
    // تحديث عنوان الصفحة
    const pageTitle = document.querySelector('h2');
    if (pageTitle) {
        pageTitle.textContent = course.name;
    }
    
    // إفراغ قائمة المواد
    coursesList.innerHTML = '';
    
    // إنشاء بطاقة تفاصيل المادة
    const card = document.createElement('div');
    card.className = 'card mb-4';
    card.innerHTML = `
        <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h3 class="card-title">${course.name}</h3>
                    <div class="card-subtitle">${departmentName} - ${course.credit_hours} ساعات معتمدة</div>
                </div>
                <a href="courses.html" class="btn btn-outline">
                    <i class="bi bi-arrow-left"></i>
                    العودة إلى قائمة المواد
                </a>
            </div>
        </div>
        <div class="card-body">
            <h4>وصف المادة</h4>
            <p class="card-text">${course.description || 'لا يوجد وصف متاح'}</p>
            
            <h4 class="mt-4">المجموعات المتاحة</h4>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>المجموعة</th>
                            <th>الأستاذ</th>
                            <th>الموعد</th>
                            <th>القاعة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="groups-${course.id}">
                        ${groups.map(group => `
                            <tr>
                                <td>${group.group_name}</td>
                                <td>${group.professor}</td>
                                <td>${group.schedule.day} ${group.schedule.time}</td>
                                <td>${group.schedule.room}</td>
                                <td>
                                    <button class="btn btn-primary btn-sm register-button" data-course-id="${course.id}" data-group-id="${group.id}">
                                        <i class="bi bi-plus-circle"></i>
                                        تسجيل
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    coursesList.appendChild(card);
}

// إضافة مستمعات الأحداث لصفحة المواد
function setupCoursesEventListeners() {
    // مستمع حدث لأزرار التسجيل
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('register-button') || event.target.closest('.register-button')) {
            const button = event.target.classList.contains('register-button') ? event.target : event.target.closest('.register-button');
            const courseId = parseInt(button.dataset.courseId);
            const groupId = parseInt(button.dataset.groupId);
            
            // تسجيل المادة
            const result = addSelectedCourse(courseId, groupId);
            
            // عرض رسالة النتيجة
            showToast(result.message, result.success ? 'success' : 'danger');
            
            // تحديث عداد الساعات المعتمدة
            updateCreditHoursCounter();
        }
    });
    
    // مستمع حدث لتصفية المواد حسب القسم
    const departmentFilter = document.getElementById('departmentFilter');
    if (departmentFilter) {
        // ملء قائمة الأقسام
        const departments = getDepartments();
        
        // إضافة خيار "جميع الأقسام"
        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = 'جميع الأقسام';
        departmentFilter.appendChild(allOption);
        
        // إضافة الأقسام
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.id;
            option.textContent = department.name;
            departmentFilter.appendChild(option);
        });
        
        // تحديد القسم الحالي
        const urlParams = new URLSearchParams(window.location.search);
        const departmentId = urlParams.get('department');
        if (departmentId) {
            departmentFilter.value = departmentId;
        }
        
        // إضافة مستمع حدث لتغيير القسم
        departmentFilter.addEventListener('change', function() {
            const departmentId = this.value;
            if (departmentId) {
                window.location.href = `courses.html?department=${departmentId}`;
            } else {
                window.location.href = 'courses.html';
            }
        });
    }
}

// تهيئة صفحة الجدول الدراسي
function setupSchedulePage() {
    // عرض المواد المسجلة
    displayRegisteredCourses();
    
    // إضافة مستمعات الأحداث
    setupScheduleEventListeners();
}

// إضافة مستمعات الأحداث لصفحة الجدول الدراسي
function setupScheduleEventListeners() {
    // مستمع حدث لزر اقتراح جداول بديلة
    const suggestAlternativesBtn = document.getElementById('suggestAlternativesBtn');
    if (suggestAlternativesBtn) {
        suggestAlternativesBtn.addEventListener('click', showAlternativeSchedules);
    }
    
    // مستمع حدث لإغلاق نافذة الجداول البديلة
    const closeAlternativesModalButton = document.getElementById('closeAlternativesModalButton');
    if (closeAlternativesModalButton) {
        closeAlternativesModalButton.addEventListener('click', function() {
            closeAlternativesModal();
        });
    }
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('alternativesModal');
        if (event.target === modal) {
            closeAlternativesModal();
        }
    });
    
    // مستمع حدث لزر تصدير الجدول
    const exportDropdown = document.getElementById('exportDropdown');
    if (exportDropdown) {
        exportDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = document.querySelector('.dropdown-menu');
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            } else {
                dropdownMenu.style.display = 'block';
            }
        });
    }
    
    // مستمعات أحداث لخيارات التصدير
    const exportAsExcel = document.getElementById('exportAsExcel');
    if (exportAsExcel) {
        exportAsExcel.addEventListener('click', function(e) {
            e.preventDefault();
            exportScheduleToExcelFile();
        });
    }
    
    const exportAsImage = document.getElementById('exportAsImage');
    if (exportAsImage) {
        exportAsImage.addEventListener('click', function(e) {
            e.preventDefault();
            exportScheduleAsImageFile();
        });
    }
    
    const printSchedule = document.getElementById('printSchedule');
    if (printSchedule) {
        printSchedule.addEventListener('click', function(e) {
            e.preventDefault();
            printScheduleTable();
        });
    }
    
    // إخفاء قائمة التصدير عند النقر في أي مكان آخر
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            const dropdownMenu = document.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.display = 'none';
            }
        }
    });
}

// تهيئة صفحة تسجيل الدخول
function setupLoginPage() {
    // التحقق من وجود مستخدم حالي
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    const currentUser = settings.current_user;
    
    if (currentUser) {
        // توجيه المستخدم إلى لوحة التحكم
        window.location.href = 'pages/dashboard.html';
    }
}

// تحديث عداد الساعات المعتمدة
function updateCreditHoursCounter() {
    const currentCreditHours = document.getElementById('currentCreditHours');
    const limitCreditHoursDisplay = document.getElementById('limitCreditHoursDisplay');
    
    if (!currentCreditHours || !limitCreditHoursDisplay) return;
    
    // حساب إجمالي الساعات المعتمدة
    const totalHours = calculateTotalCreditHours();
    
    // الحصول على حد الساعات المعتمدة
    const settings = getSettings();
    const limit = settings.credit_hours_limit;
    
    // تحديث العداد
    currentCreditHours.textContent = totalHours;
    limitCreditHoursDisplay.textContent = limit === 0 ? 'حر' : limit;
    
    // تغيير لون العداد حسب الحالة
    if (limit !== 0 && totalHours > limit) {
        currentCreditHours.classList.remove('badge-primary');
        currentCreditHours.classList.add('badge-danger');
    } else {
        currentCreditHours.classList.remove('badge-danger');
        currentCreditHours.classList.add('badge-primary');
    }
}

// عرض رسالة منبثقة
function showToast(message, type = 'info') {
    // إنشاء عنصر الرسالة
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.style.minWidth = '300px';
    toast.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    
    // إضافة أيقونة حسب النوع
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'danger') icon = 'x-circle';
    
    toast.innerHTML = `
        <div class="d-flex align-items-center gap-2">
            <i class="bi bi-${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // إضافة الرسالة إلى الصفحة
    document.body.appendChild(toast);
    
    // عرض الرسالة بتأثير متحرك
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // إخفاء الرسالة بعد 3 ثوانٍ
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        
        // حذف الرسالة من الصفحة بعد انتهاء التأثير
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}
