// ملف وظائف لوحة الإدارة
// يحتوي على وظائف إدارة المواد والمجموعات والمستخدمين

// حذف مادة مع تأكيد
function deleteCourseWithConfirmation(courseId) {
    if (confirm(`هل أنت متأكد من حذف هذه المادة؟ سيتم حذف جميع المجموعات المرتبطة بها أيضاً.`)) {
        // حذف المادة
        deleteCourse(courseId);
        
        // تحديث الصفحة الحالية
        if (window.location.pathname.includes('dashboard.html')) {
            // تحديث لوحة التحكم
            updateDashboardStats();
            renderDepartmentsChart();
            renderCreditHoursChart();
            displayRecentCourses();
            displayRecentGroups();
        } else if (window.location.pathname.includes('courses.html')) {
            // تحديث صفحة إدارة المواد
            displayAdminCourses();
        }
        
        // عرض رسالة نجاح
        showAdminToast('تم حذف المادة بنجاح', 'success');
    }
}

// حذف مجموعة مع تأكيد
function deleteGroupWithConfirmation(groupId) {
    if (confirm(`هل أنت متأكد من حذف هذه المجموعة؟`)) {
        // حذف المجموعة
        deleteGroup(groupId);
        
        // تحديث الصفحة الحالية
        if (window.location.pathname.includes('dashboard.html')) {
            // تحديث لوحة التحكم
            updateDashboardStats();
            displayRecentGroups();
        } else if (window.location.pathname.includes('groups.html')) {
            // تحديث صفحة إدارة المجموعات
            displayAdminGroups();
        }
        
        // عرض رسالة نجاح
        showAdminToast('تم حذف المجموعة بنجاح', 'success');
    }
}

// حذف مستخدم مع تأكيد
function deleteUserWithConfirmation(userId) {
    // التحقق من أن المستخدم ليس المستخدم الحالي
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        showAdminToast('لا يمكن حذف المستخدم الحالي', 'danger');
        return;
    }
    
    if (confirm(`هل أنت متأكد من حذف هذا المستخدم؟`)) {
        // حذف المستخدم
        deleteUser(userId);
        
        // تحديث صفحة إدارة المستخدمين
        if (window.location.pathname.includes('users.html')) {
            displayAdminUsers();
        }
        
        // عرض رسالة نجاح
        showAdminToast('تم حذف المستخدم بنجاح', 'success');
    }
}

// حذف مستخدم
function deleteUser(userId) {
    const users = getUsers();
    const newUsers = users.filter(user => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(newUsers));
    return true;
}

// عرض رسالة منبثقة في لوحة الإدارة
function showAdminToast(message, type = 'info') {
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

// عرض المواد في صفحة إدارة المواد
function displayAdminCourses() {
    const coursesList = document.getElementById('adminCoursesList');
    if (!coursesList) return;
    
    // الحصول على المواد
    const courses = getCourses();
    
    // إفراغ قائمة المواد
    coursesList.innerHTML = '';
    
    // عرض المواد
    courses.forEach(course => {
        // الحصول على اسم القسم
        const departmentName = getDepartmentName(course.department_id);
        
        // حساب عدد المجموعات
        const groupsCount = getGroupsByCourseId(course.id).length;
        
        // إنشاء صف المادة
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.id}</td>
            <td>${course.name}</td>
            <td>${departmentName}</td>
            <td>${course.credit_hours}</td>
            <td>${groupsCount}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="showEditCourseForm(${course.id})">
                    <i class="bi bi-pencil"></i>
                    تعديل
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCourseWithConfirmation(${course.id})">
                    <i class="bi bi-trash"></i>
                    حذف
                </button>
            </td>
        `;
        
        coursesList.appendChild(row);
    });
    
    // عرض رسالة إذا لم تكن هناك مواد
    if (courses.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" class="text-center">لا توجد مواد مضافة حتى الآن</td>
        `;
        coursesList.appendChild(row);
    }
}

// عرض المجموعات في صفحة إدارة المجموعات
function displayAdminGroups() {
    const groupsList = document.getElementById('adminGroupsList');
    if (!groupsList) return;
    
    // الحصول على المجموعات
    const groups = getGroups();
    
    // إفراغ قائمة المجموعات
    groupsList.innerHTML = '';
    
    // عرض المجموعات
    groups.forEach(group => {
        // الحصول على اسم المادة
        const course = getCourseById(group.course_id);
        const courseName = course ? course.name : 'غير معروف';
        
        // إنشاء صف المجموعة
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${group.id}</td>
            <td>${courseName}</td>
            <td>${group.group_name}</td>
            <td>${group.professor}</td>
            <td>${group.schedule.day} ${group.schedule.time}</td>
            <td>${group.schedule.room}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="showEditGroupForm(${group.id})">
                    <i class="bi bi-pencil"></i>
                    تعديل
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteGroupWithConfirmation(${group.id})">
                    <i class="bi bi-trash"></i>
                    حذف
                </button>
            </td>
        `;
        
        groupsList.appendChild(row);
    });
    
    // عرض رسالة إذا لم تكن هناك مجموعات
    if (groups.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" class="text-center">لا توجد مجموعات مضافة حتى الآن</td>
        `;
        groupsList.appendChild(row);
    }
}

// عرض المستخدمين في صفحة إدارة المستخدمين
function displayAdminUsers() {
    const usersList = document.getElementById('adminUsersList');
    if (!usersList) return;
    
    // الحصول على المستخدمين
    const users = getUsers();
    
    // الحصول على المستخدم الحالي
    const currentUser = getCurrentUser();
    
    // إفراغ قائمة المستخدمين
    usersList.innerHTML = '';
    
    // عرض المستخدمين
    users.forEach(user => {
        // إنشاء صف المستخدم
        const row = document.createElement('tr');
        
        // تحديد ما إذا كان هذا هو المستخدم الحالي
        const isCurrentUser = currentUser && currentUser.id === user.id;
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="showEditUserForm(${user.id})">
                    <i class="bi bi-pencil"></i>
                    تعديل
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUserWithConfirmation(${user.id})" ${isCurrentUser ? 'disabled' : ''}>
                    <i class="bi bi-trash"></i>
                    حذف
                </button>
            </td>
        `;
        
        usersList.appendChild(row);
    });
    
    // عرض رسالة إذا لم يكن هناك مستخدمين
    if (users.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" class="text-center">لا يوجد مستخدمين مضافين حتى الآن</td>
        `;
        usersList.appendChild(row);
    }
}

// عرض نموذج إضافة مادة جديدة
function showAddCourseForm() {
    const addCourseForm = document.getElementById('addCourseForm');
    const editCourseForm = document.getElementById('editCourseForm');
    
    if (addCourseForm && editCourseForm) {
        addCourseForm.style.display = 'block';
        editCourseForm.style.display = 'none';
    }
    
    // إعادة تعيين النموذج
    const form = document.getElementById('courseForm');
    if (form) {
        form.reset();
    }
    
    // تحديث قائمة الأقسام
    populateDepartmentsSelect();
}

// عرض نموذج تعديل مادة
function showEditCourseForm(courseId) {
    const addCourseForm = document.getElementById('addCourseForm');
    const editCourseForm = document.getElementById('editCourseForm');
    
    if (addCourseForm && editCourseForm) {
        addCourseForm.style.display = 'none';
        editCourseForm.style.display = 'block';
    }
    
    // الحصول على المادة
    const course = getCourseById(courseId);
    if (!course) {
        showAdminToast('لم يتم العثور على المادة', 'danger');
        return;
    }
    
    // ملء النموذج ببيانات المادة
    const form = document.getElementById('courseForm');
    if (form) {
        form.elements['courseId'].value = course.id;
        form.elements['courseName'].value = course.name;
        form.elements['courseDepartment'].value = course.department_id;
        form.elements['courseCreditHours'].value = course.credit_hours;
        form.elements['courseDescription'].value = course.description;
    }
    
    // تحديث قائمة الأقسام
    populateDepartmentsSelect();
    
    // التمرير إلى النموذج
    editCourseForm.scrollIntoView({ behavior: 'smooth' });
}

// ملء قائمة الأقسام في نموذج المادة
function populateDepartmentsSelect() {
    const departmentSelect = document.getElementById('courseDepartment');
    if (!departmentSelect) return;
    
    // الحصول على الأقسام
    const departments = getDepartments();
    
    // إفراغ القائمة
    departmentSelect.innerHTML = '';
    
    // إضافة خيار فارغ
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'اختر القسم';
    departmentSelect.appendChild(emptyOption);
    
    // إضافة الأقسام
    departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department.id;
        option.textContent = department.name;
        departmentSelect.appendChild(option);
    });
}

// حفظ المادة (إضافة أو تعديل)
function saveCourse(event) {
    event.preventDefault();
    
    // الحصول على بيانات النموذج
    const form = document.getElementById('courseForm');
    const courseId = form.elements['courseId'].value;
    const courseName = form.elements['courseName'].value;
    const courseDepartment = parseInt(form.elements['courseDepartment'].value);
    const courseCreditHours = parseInt(form.elements['courseCreditHours'].value);
    const courseDescription = form.elements['courseDescription'].value;
    
    // التحقق من صحة البيانات
    if (!courseName || !courseDepartment || !courseCreditHours) {
        showAdminToast('الرجاء ملء جميع الحقول المطلوبة', 'danger');
        return;
    }
    
    // إنشاء كائن المادة
    const course = {
        name: courseName,
        department_id: courseDepartment,
        credit_hours: courseCreditHours,
        description: courseDescription
    };
    
    // إضافة أو تعديل المادة
    if (courseId) {
        // تعديل مادة موجودة
        course.id = parseInt(courseId);
        updateCourse(course);
        showAdminToast('تم تعديل المادة بنجاح', 'success');
    } else {
        // إضافة مادة جديدة
        addCourse(course);
        showAdminToast('تمت إضافة المادة بنجاح', 'success');
    }
    
    // إعادة تعيين النموذج
    form.reset();
    
    // إخفاء نموذج التعديل وإظهار نموذج الإضافة
    const addCourseForm = document.getElementById('addCourseForm');
    const editCourseForm = document.getElementById('editCourseForm');
    
    if (addCourseForm && editCourseForm) {
        addCourseForm.style.display = 'block';
        editCourseForm.style.display = 'none';
    }
    
    // تحديث قائمة المواد
    displayAdminCourses();
}

// عرض نموذج إضافة مجموعة جديدة
function showAddGroupForm() {
    const addGroupForm = document.getElementById('addGroupForm');
    const editGroupForm = document.getElementById('editGroupForm');
    
    if (addGroupForm && editGroupForm) {
        addGroupForm.style.display = 'block';
        editGroupForm.style.display = 'none';
    }
    
    // إعادة تعيين النموذج
    const form = document.getElementById('groupForm');
    if (form) {
        form.reset();
    }
    
    // تحديث قائمة المواد
    populateCoursesSelect();
}

// عرض نموذج تعديل مجموعة
function showEditGroupForm(groupId) {
    const addGroupForm = document.getElementById('addGroupForm');
    const editGroupForm = document.getElementById('editGroupForm');
    
    if (addGroupForm && editGroupForm) {
        addGroupForm.style.display = 'none';
        editGroupForm.style.display = 'block';
    }
    
    // الحصول على المجموعة
    const group = getGroupById(groupId);
    if (!group) {
        showAdminToast('لم يتم العثور على المجموعة', 'danger');
        return;
    }
    
    // ملء النموذج ببيانات المجموعة
    const form = document.getElementById('groupForm');
    if (form) {
        form.elements['groupId'].value = group.id;
        form.elements['groupCourse'].value = group.course_id;
        form.elements['groupName'].value = group.group_name;
        form.elements['groupProfessor'].value = group.professor;
        form.elements['groupDay'].value = group.schedule.day;
        form.elements['groupTime'].value = group.schedule.time;
        form.elements['groupRoom'].value = group.schedule.room;
    }
    
    // تحديث قائمة المواد
    populateCoursesSelect();
    
    // التمرير إلى النموذج
    editGroupForm.scrollIntoView({ behavior: 'smooth' });
}

// ملء قائمة المواد في نموذج المجموعة
function populateCoursesSelect() {
    const courseSelect = document.getElementById('groupCourse');
    if (!courseSelect) return;
    
    // الحصول على المواد
    const courses = getCourses();
    
    // إفراغ القائمة
    courseSelect.innerHTML = '';
    
    // إضافة خيار فارغ
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'اختر المادة';
    courseSelect.appendChild(emptyOption);
    
    // إضافة المواد
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });
}

// حفظ المجموعة (إضافة أو تعديل)
function saveGroup(event) {
    event.preventDefault();
    
    // الحصول على بيانات النموذج
    const form = document.getElementById('groupForm');
    const groupId = form.elements['groupId'].value;
    const groupCourse = parseInt(form.elements['groupCourse'].value);
    const groupName = form.elements['groupName'].value;
    const groupProfessor = form.elements['groupProfessor'].value;
    const groupDay = form.elements['groupDay'].value;
    const groupTime = form.elements['groupTime'].value;
    const groupRoom = form.elements['groupRoom'].value;
    
    // التحقق من صحة البيانات
    if (!groupCourse || !groupName || !groupProfessor || !groupDay || !groupTime || !groupRoom) {
        showAdminToast('الرجاء ملء جميع الحقول المطلوبة', 'danger');
        return;
    }
    
    // إنشاء كائن المجموعة
    const group = {
        course_id: groupCourse,
        group_name: groupName,
        professor: groupProfessor,
        schedule: {
            day: groupDay,
            time: groupTime,
            room: groupRoom
        }
    };
    
    // إضافة أو تعديل المجموعة
    if (groupId) {
        // تعديل مجموعة موجودة
        group.id = parseInt(groupId);
        updateGroup(group);
        showAdminToast('تم تعديل المجموعة بنجاح', 'success');
    } else {
        // إضافة مجموعة جديدة
        addGroup(group);
        showAdminToast('تمت إضافة المجموعة بنجاح', 'success');
    }
    
    // إعادة تعيين النموذج
    form.reset();
    
    // إخفاء نموذج التعديل وإظهار نموذج الإضافة
    const addGroupForm = document.getElementById('addGroupForm');
    const editGroupForm = document.getElementById('editGroupForm');
    
    if (addGroupForm && editGroupForm) {
        addGroupForm.style.display = 'block';
        editGroupForm.style.display = 'none';
    }
    
    // تحديث قائمة المجموعات
    displayAdminGroups();
}

// عرض نموذج إضافة مستخدم جديد
function showAddUserForm() {
    const addUserForm = document.getElementById('addUserForm');
    const editUserForm = document.getElementById('editUserForm');
    
    if (addUserForm && editUserForm) {
        addUserForm.style.display = 'block';
        editUserForm.style.display = 'none';
    }
    
    // إعادة تعيين النموذج
    const form = document.getElementById('userForm');
    if (form) {
        form.reset();
    }
}

// عرض نموذج تعديل مستخدم
function showEditUserForm(userId) {
    const addUserForm = document.getElementById('addUserForm');
    const editUserForm = document.getElementById('editUserForm');
    
    if (addUserForm && editUserForm) {
        addUserForm.style.display = 'none';
        editUserForm.style.display = 'block';
    }
    
    // الحصول على المستخدم
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        showAdminToast('لم يتم العثور على المستخدم', 'danger');
        return;
    }
    
    // ملء النموذج ببيانات المستخدم
    const form = document.getElementById('userForm');
    if (form) {
        form.elements['userId'].value = user.id;
        form.elements['userName'].value = user.name;
        form.elements['userUsername'].value = user.username;
        form.elements['userEmail'].value = user.email;
        // لا نملأ كلمة المرور لأسباب أمنية
    }
    
    // التمرير إلى النموذج
    editUserForm.scrollIntoView({ behavior: 'smooth' });
}

// حفظ المستخدم (إضافة أو تعديل)
function saveUser(event) {
    event.preventDefault();
    
    // الحصول على بيانات النموذج
    const form = document.getElementById('userForm');
    const userId = form.elements['userId'].value;
    const userName = form.elements['userName'].value;
    const userUsername = form.elements['userUsername'].value;
    const userEmail = form.elements['userEmail'].value;
    const userPassword = form.elements['userPassword'].value;
    
    // التحقق من صحة البيانات
    if (!userName || !userUsername || !userEmail) {
        showAdminToast('الرجاء ملء جميع الحقول المطلوبة', 'danger');
        return;
    }
    
    // التحقق من عدم تكرار اسم المستخدم
    const users = getUsers();
    const existingUser = users.find(u => u.username === userUsername && u.id !== parseInt(userId));
    
    if (existingUser) {
        showAdminToast('اسم المستخدم موجود مسبقاً', 'danger');
        return;
    }
    
    // إنشاء كائن المستخدم
    const user = {
        name: userName,
        username: userUsername,
        email: userEmail
    };
    
    // إضافة كلمة المرور إذا تم إدخالها
    if (userPassword) {
        user.password = userPassword;
    }
    
    // إضافة أو تعديل المستخدم
    if (userId) {
        // تعديل مستخدم موجود
        user.id = parseInt(userId);
        
        // الحصول على المستخدم الحالي
        const currentUser = users.find(u => u.id === user.id);
        
        // الاحتفاظ بكلمة المرور إذا لم يتم تغييرها
        if (!userPassword) {
            user.password = currentUser.password;
        }
        
        // تحديث المستخدم
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
            localStorage.setItem('users', JSON.stringify(users));
            
            // تحديث بيانات المستخدم الحالي إذا كان هو المستخدم الذي تم تعديله
            const currentLoggedInUser = getCurrentUser();
            if (currentLoggedInUser && currentLoggedInUser.id === user.id) {
                const settings = JSON.parse(localStorage.getItem('settings')) || {};
                settings.current_user = {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    email: user.email
                };
                localStorage.setItem('settings', JSON.stringify(settings));
                
                // تحديث اسم المستخدم في الشريط العلوي
                const userNameElement = document.getElementById('currentUserName');
                if (userNameElement) {
                    userNameElement.textContent = user.name || user.username;
                }
            }
            
            showAdminToast('تم تعديل المستخدم بنجاح', 'success');
        } else {
            showAdminToast('لم يتم العثور على المستخدم', 'danger');
        }
    } else {
        // إضافة مستخدم جديد
        if (!userPassword) {
            showAdminToast('الرجاء إدخال كلمة مرور للمستخدم الجديد', 'danger');
            return;
        }
        
        // إنشاء معرف جديد
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        user.id = newId;
        
        // إضافة المستخدم
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        
        showAdminToast('تمت إضافة المستخدم بنجاح', 'success');
    }
    
    // إعادة تعيين النموذج
    form.reset();
    
    // إخفاء نموذج التعديل وإظهار نموذج الإضافة
    const addUserForm = document.getElementById('addUserForm');
    const editUserForm = document.getElementById('editUserForm');
    
    if (addUserForm && editUserForm) {
        addUserForm.style.display = 'block';
        editUserForm.style.display = 'none';
    }
    
    // تحديث قائمة المستخدمين
    displayAdminUsers();
}

// تحميل الصفحة المناسبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    if (window.location.pathname.includes('/pages/')) {
        if (!checkAuth()) {
            return;
        }
    }
    
    // تحديد الصفحة الحالية
    if (window.location.pathname.includes('courses.html')) {
        // صفحة إدارة المواد
        displayAdminCourses();
        populateDepartmentsSelect();
        
        // إضافة مستمعات الأحداث
        const courseForm = document.getElementById('courseForm');
        if (courseForm) {
            courseForm.addEventListener('submit', saveCourse);
        }
        
        const addCourseButton = document.getElementById('addCourseButton');
        if (addCourseButton) {
            addCourseButton.addEventListener('click', showAddCourseForm);
        }
    } else if (window.location.pathname.includes('groups.html')) {
        // صفحة إدارة المجموعات
        displayAdminGroups();
        populateCoursesSelect();
        
        // إضافة مستمعات الأحداث
        const groupForm = document.getElementById('groupForm');
        if (groupForm) {
            groupForm.addEventListener('submit', saveGroup);
        }
        
        const addGroupButton = document.getElementById('addGroupButton');
        if (addGroupButton) {
            addGroupButton.addEventListener('click', showAddGroupForm);
        }
    } else if (window.location.pathname.includes('users.html')) {
        // صفحة إدارة المستخدمين
        displayAdminUsers();
        
        // إضافة مستمعات الأحداث
        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', saveUser);
        }
        
        const addUserButton = document.getElementById('addUserButton');
        if (addUserButton) {
            addUserButton.addEventListener('click', showAddUserForm);
        }
    }
});
