// ملف وظائف المواد الدراسية
// يحتوي على وظائف عرض المواد وتصفيتها وإضافتها للجدول

// متغيرات عامة
let selectedGroupId = null;
let selectedCourseId = null;

// تحميل المواد عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة البيانات
    initializeData();
    
    // عرض المواد
    displayCourses();
    
    // تحديث عداد الساعات المعتمدة
    updateCreditHoursCounter();
    
    // ملء قائمة الأقسام
    populateDepartments();
    
    // إضافة مستمعات الأحداث
    setupEventListeners();
});

// عرض المواد
function displayCourses(departmentId = null, searchQuery = '') {
    const coursesList = document.getElementById('coursesList');
    const noCoursesMessage = document.getElementById('noCoursesMessage');
    
    // الحصول على المواد
    let courses = getCourses();
    
    // تصفية المواد حسب القسم
    if (departmentId && departmentId !== 'all') {
        courses = courses.filter(course => course.department_id === parseInt(departmentId));
    }
    
    // تصفية المواد حسب البحث
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        courses = courses.filter(course => course.name.toLowerCase().includes(query));
    }
    
    // الحصول على المواد المختارة
    const selectedCourses = getSelectedCourses();
    
    // إفراغ قائمة المواد
    coursesList.innerHTML = '';
    
    // عرض رسالة عند عدم وجود مواد
    if (courses.length === 0) {
        noCoursesMessage.style.display = 'block';
        return;
    } else {
        noCoursesMessage.style.display = 'none';
    }
    
    // عرض المواد
    courses.forEach(course => {
        // التحقق من أن المادة غير مختارة مسبقاً
        const isSelected = selectedCourses.some(sc => sc.course_id === course.id);
        
        // الحصول على اسم القسم
        const departmentName = getDepartmentName(course.department_id);
        
        // إنشاء بطاقة المادة
        const courseCard = document.createElement('div');
        courseCard.className = 'col-md-6 col-lg-4 mb-4 fade-in';
        
        courseCard.innerHTML = `
            <div class="card h-100 ${isSelected ? 'border-primary' : ''}">
                <div class="card-header">
                    <h3 class="card-title">${course.name}</h3>
                    <span class="badge badge-primary">${course.credit_hours} ساعات</span>
                </div>
                <div class="card-body">
                    <p class="mb-2"><strong>القسم:</strong> ${departmentName}</p>
                    <p class="mb-3">${course.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-muted">عدد المجموعات: ${getGroupsByCourseId(course.id).length}</span>
                        <button class="btn btn-${isSelected ? 'danger' : 'primary'}" data-course-id="${course.id}" ${isSelected ? 'onclick="removeCourseFromSchedule(' + course.id + ')"' : 'onclick="showGroupSelectionModal(' + course.id + ')"'}>
                            <i class="bi bi-${isSelected ? 'trash' : 'plus-circle'}"></i>
                            ${isSelected ? 'إلغاء التسجيل' : 'تسجيل المادة'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        coursesList.appendChild(courseCard);
    });
}

// ملء قائمة الأقسام
function populateDepartments() {
    const departmentFilter = document.getElementById('departmentFilter');
    const departments = getDepartments();
    
    departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department.id;
        option.textContent = department.name;
        departmentFilter.appendChild(option);
    });
}

// إضافة مستمعات الأحداث
function setupEventListeners() {
    // مستمع حدث لتغيير القسم
    const departmentFilter = document.getElementById('departmentFilter');
    departmentFilter.addEventListener('change', function() {
        const searchQuery = document.getElementById('courseSearch').value;
        displayCourses(this.value, searchQuery);
    });
    
    // مستمع حدث للبحث
    const courseSearch = document.getElementById('courseSearch');
    courseSearch.addEventListener('input', function() {
        const departmentId = document.getElementById('departmentFilter').value;
        displayCourses(departmentId, this.value);
    });
    
    // مستمع حدث لتغيير حد الساعات المعتمدة
    const creditHoursLimit = document.getElementById('creditHoursLimit');
    creditHoursLimit.addEventListener('change', function() {
        setCreditHoursLimit(parseInt(this.value));
        updateCreditHoursCounter();
    });
    
    // مستمع حدث لإغلاق النافذة المنبثقة
    const closeModalButton = document.getElementById('closeModalButton');
    closeModalButton.addEventListener('click', function() {
        closeGroupSelectionModal();
    });
    
    // مستمع حدث لتأكيد اختيار المجموعة
    const confirmGroupSelection = document.getElementById('confirmGroupSelection');
    confirmGroupSelection.addEventListener('click', function() {
        if (selectedGroupId && selectedCourseId) {
            addCourseToSchedule(selectedCourseId, selectedGroupId);
        } else {
            showModalAlert('الرجاء اختيار مجموعة');
        }
    });
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('groupSelectionModal');
        if (event.target === modal) {
            closeGroupSelectionModal();
        }
    });
}

// تحديث عداد الساعات المعتمدة
function updateCreditHoursCounter() {
    const currentCreditHours = document.getElementById('currentCreditHours');
    const limitCreditHoursDisplay = document.getElementById('limitCreditHoursDisplay');
    
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
    
    // تحديث قيمة القائمة المنسدلة
    const creditHoursLimit = document.getElementById('creditHoursLimit');
    creditHoursLimit.value = limit;
}

// عرض نافذة اختيار المجموعة
function showGroupSelectionModal(courseId) {
    // تعيين المادة المختارة
    selectedCourseId = courseId;
    selectedGroupId = null;
    
    // الحصول على المادة
    const course = getCourseById(courseId);
    
    // الحصول على مجموعات المادة
    const groups = getGroupsByCourseId(courseId);
    
    // تحديث عنوان النافذة
    const modalCourseName = document.getElementById('modalCourseName');
    modalCourseName.textContent = `اختر مجموعة لمادة: ${course.name}`;
    
    // إفراغ قائمة المجموعات
    const modalGroupsList = document.getElementById('modalGroupsList');
    modalGroupsList.innerHTML = '';
    
    // عرض المجموعات
    groups.forEach(group => {
        const groupItem = document.createElement('div');
        groupItem.className = 'card mb-2';
        groupItem.innerHTML = `
            <div class="card-body">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="groupRadio" id="group${group.id}" value="${group.id}" onchange="selectGroup(${group.id})">
                    <label class="form-check-label" for="group${group.id}">
                        <div class="d-flex justify-content-between align-items-center">
                            <span><strong>المجموعة ${group.group_name}</strong> - ${group.professor}</span>
                            <span class="badge badge-secondary">${group.schedule.day} ${group.schedule.time}</span>
                        </div>
                        <div class="text-muted mt-1">القاعة: ${group.schedule.room}</div>
                    </label>
                </div>
            </div>
        `;
        modalGroupsList.appendChild(groupItem);
    });
    
    // إخفاء رسالة الخطأ
    const modalAlert = document.getElementById('modalAlert');
    modalAlert.style.display = 'none';
    
    // عرض النافذة
    const modal = document.getElementById('groupSelectionModal');
    modal.style.display = 'block';
}

// إغلاق نافذة اختيار المجموعة
function closeGroupSelectionModal() {
    const modal = document.getElementById('groupSelectionModal');
    modal.style.display = 'none';
    
    // إعادة تعيين المتغيرات
    selectedCourseId = null;
    selectedGroupId = null;
}

// اختيار مجموعة
function selectGroup(groupId) {
    selectedGroupId = groupId;
}

// عرض رسالة خطأ في النافذة المنبثقة
function showModalAlert(message) {
    const modalAlert = document.getElementById('modalAlert');
    const modalAlertMessage = document.getElementById('modalAlertMessage');
    
    modalAlertMessage.textContent = message;
    modalAlert.style.display = 'flex';
    
    // إخفاء الرسالة بعد 3 ثوانٍ
    setTimeout(() => {
        modalAlert.style.display = 'none';
    }, 3000);
}

// إضافة مادة إلى الجدول
function addCourseToSchedule(courseId, groupId) {
    // إضافة المادة إلى المواد المختارة
    const result = addSelectedCourse(courseId, groupId);
    
    if (result.success) {
        // إغلاق النافذة المنبثقة
        closeGroupSelectionModal();
        
        // تحديث عرض المواد
        const departmentId = document.getElementById('departmentFilter').value;
        const searchQuery = document.getElementById('courseSearch').value;
        displayCourses(departmentId, searchQuery);
        
        // تحديث عداد الساعات المعتمدة
        updateCreditHoursCounter();
        
        // عرض رسالة نجاح
        showToast(result.message, 'success');
    } else {
        // عرض رسالة الخطأ
        showModalAlert(result.message);
    }
}

// إلغاء تسجيل مادة
function removeCourseFromSchedule(courseId) {
    // حذف المادة من المواد المختارة
    removeSelectedCourse(courseId);
    
    // تحديث عرض المواد
    const departmentId = document.getElementById('departmentFilter').value;
    const searchQuery = document.getElementById('courseSearch').value;
    displayCourses(departmentId, searchQuery);
    
    // تحديث عداد الساعات المعتمدة
    updateCreditHoursCounter();
    
    // عرض رسالة نجاح
    showToast('تم إلغاء تسجيل المادة بنجاح', 'success');
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
