// ملف البيانات الرئيسي للنظام
// يحتوي على وظائف إدارة البيانات والتخزين المحلي

// تهيئة البيانات عند تحميل الصفحة
function initializeData() {
    // التحقق من وجود بيانات في التخزين المحلي
    if (!localStorage.getItem('departments')) {
        // تهيئة الأقسام
        const departments = [
            { id: 1, name: 'قسم الهندسة الطبية' },
            { id: 2, name: 'قسم الهندسة الكهربائية' },
            { id: 3, name: 'قسم الهندسة الميكانيكية' },
            { id: 4, name: 'قسم الهندسة المعمارية' },
            { id: 5, name: 'قسم علوم الحاسب' }
        ];
        localStorage.setItem('departments', JSON.stringify(departments));
    }
    
    if (!localStorage.getItem('courses')) {
        // تهيئة المواد
        const courses = [
            { id: 1, name: 'مقدمة في الهندسة الطبية', department_id: 1, credit_hours: 3, description: 'مقدمة في مبادئ الهندسة الطبية وتطبيقاتها في المجال الطبي.' },
            { id: 2, name: 'الأجهزة الطبية', department_id: 1, credit_hours: 4, description: 'دراسة الأجهزة الطبية المستخدمة في التشخيص والعلاج.' },
            { id: 3, name: 'الدوائر الكهربائية', department_id: 2, credit_hours: 3, description: 'دراسة أساسيات الدوائر الكهربائية وتطبيقاتها.' },
            { id: 4, name: 'الإلكترونيات', department_id: 2, credit_hours: 4, description: 'دراسة الإلكترونيات والدوائر المتكاملة.' },
            { id: 5, name: 'ميكانيكا المواد', department_id: 3, credit_hours: 3, description: 'دراسة خصائص المواد الميكانيكية وسلوكها تحت تأثير القوى المختلفة.' },
            { id: 6, name: 'ديناميكا حرارية', department_id: 3, credit_hours: 3, description: 'دراسة مبادئ الديناميكا الحرارية وتطبيقاتها.' },
            { id: 7, name: 'تصميم معماري', department_id: 4, credit_hours: 4, description: 'دراسة أساسيات التصميم المعماري والهندسي.' },
            { id: 8, name: 'تاريخ العمارة', department_id: 4, credit_hours: 2, description: 'دراسة تاريخ العمارة عبر العصور المختلفة.' },
            { id: 9, name: 'برمجة الحاسب', department_id: 5, credit_hours: 3, description: 'مقدمة في برمجة الحاسب باستخدام لغات البرمجة الحديثة.' },
            { id: 10, name: 'هياكل البيانات', department_id: 5, credit_hours: 3, description: 'دراسة هياكل البيانات وخوارزميات معالجتها.' }
        ];
        localStorage.setItem('courses', JSON.stringify(courses));
    }
    
    if (!localStorage.getItem('groups')) {
        // تهيئة المجموعات
        const groups = [
            { id: 1, course_id: 1, group_name: 'مجموعة 1', professor: 'د. أحمد محمد', schedule: { day: 'السبت', time: '08:00-09:30', room: 'قاعة 101' } },
            { id: 2, course_id: 1, group_name: 'مجموعة 2', professor: 'د. سارة علي', schedule: { day: 'الاثنين', time: '11:00-12:30', room: 'قاعة 102' } },
            { id: 3, course_id: 2, group_name: 'مجموعة 1', professor: 'د. محمد أحمد', schedule: { day: 'الأحد', time: '09:30-11:00', room: 'معمل 201' } },
            { id: 4, course_id: 3, group_name: 'مجموعة 1', professor: 'د. خالد عبدالله', schedule: { day: 'الثلاثاء', time: '08:00-09:30', room: 'قاعة 103' } },
            { id: 5, course_id: 3, group_name: 'مجموعة 2', professor: 'د. فاطمة محمود', schedule: { day: 'الخميس', time: '12:30-14:00', room: 'قاعة 104' } },
            { id: 6, course_id: 4, group_name: 'مجموعة 1', professor: 'د. عمر حسن', schedule: { day: 'الأربعاء', time: '14:00-15:30', room: 'معمل 202' } },
            { id: 7, course_id: 5, group_name: 'مجموعة 1', professor: 'د. نورا سعيد', schedule: { day: 'السبت', time: '11:00-12:30', room: 'قاعة 105' } },
            { id: 8, course_id: 6, group_name: 'مجموعة 1', professor: 'د. حسام علي', schedule: { day: 'الاثنين', time: '09:30-11:00', room: 'قاعة 106' } },
            { id: 9, course_id: 7, group_name: 'مجموعة 1', professor: 'د. ليلى كمال', schedule: { day: 'الأحد', time: '14:00-15:30', room: 'استوديو 301' } },
            { id: 10, course_id: 8, group_name: 'مجموعة 1', professor: 'د. كريم سامي', schedule: { day: 'الثلاثاء', time: '12:30-14:00', room: 'قاعة 107' } },
            { id: 11, course_id: 9, group_name: 'مجموعة 1', professor: 'د. سمير فؤاد', schedule: { day: 'الخميس', time: '08:00-09:30', room: 'معمل 203' } },
            { id: 12, course_id: 9, group_name: 'مجموعة 2', professor: 'د. هدى محمد', schedule: { day: 'الأربعاء', time: '11:00-12:30', room: 'معمل 204' } },
            { id: 13, course_id: 10, group_name: 'مجموعة 1', professor: 'د. طارق أحمد', schedule: { day: 'السبت', time: '15:30-17:00', room: 'معمل 205' } }
        ];
        localStorage.setItem('groups', JSON.stringify(groups));
    }
    
    if (!localStorage.getItem('users')) {
        // تهيئة المستخدمين
        const users = [
            { id: 1, username: 'admin1', password: 'pass1234', name: 'المسؤول الأول', email: 'admin1@example.com' },
            { id: 2, username: 'admin2', password: 'pass5678', name: 'المسؤول الثاني', email: 'admin2@example.com' },
            { id: 3, username: 'admin3', password: 'admin123', name: 'المسؤول الثالث', email: 'admin3@example.com' },
            { id: 4, username: 'admin4', password: 'admin456', name: 'المسؤول الرابع', email: 'admin4@example.com' },
            { id: 5, username: 'admin5', password: 'pass9012', name: 'المسؤول الخامس', email: 'admin5@example.com' },
            { id: 6, username: 'admin6', password: 'pass3456', name: 'المسؤول السادس', email: 'admin6@example.com' },
            { id: 7, username: 'admin7', password: 'admin789', name: 'المسؤول السابع', email: 'admin7@example.com' },
            { id: 8, username: 'admin8', password: 'admin012', name: 'المسؤول الثامن', email: 'admin8@example.com' },
            { id: 9, username: 'admin9', password: 'pass7890', name: 'المسؤول التاسع', email: 'admin9@example.com' },
            { id: 10, username: 'admin10', password: 'pass1230', name: 'المسؤول العاشر', email: 'admin10@example.com' }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    if (!localStorage.getItem('settings')) {
        // تهيئة الإعدادات
        const settings = {
            credit_hours_limit: 18,
            selected_courses: []
        };
        localStorage.setItem('settings', JSON.stringify(settings));
    }
}

// الحصول على الأقسام
function getDepartments() {
    return JSON.parse(localStorage.getItem('departments')) || [];
}

// الحصول على اسم القسم
function getDepartmentName(departmentId) {
    const departments = getDepartments();
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'غير معروف';
}

// الحصول على المواد
function getCourses() {
    return JSON.parse(localStorage.getItem('courses')) || [];
}

// الحصول على مادة بواسطة المعرف
function getCourseById(courseId) {
    const courses = getCourses();
    return courses.find(course => course.id === courseId);
}

// الحصول على المواد حسب القسم
function getCoursesByDepartment(departmentId) {
    const courses = getCourses();
    return courses.filter(course => course.department_id === departmentId);
}

// إضافة مادة جديدة
function addCourse(course) {
    const courses = getCourses();
    
    // إنشاء معرف جديد
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    course.id = newId;
    
    // إضافة المادة
    courses.push(course);
    localStorage.setItem('courses', JSON.stringify(courses));
    
    return course;
}

// تحديث مادة موجودة
function updateCourse(course) {
    const courses = getCourses();
    const index = courses.findIndex(c => c.id === course.id);
    
    if (index !== -1) {
        courses[index] = course;
        localStorage.setItem('courses', JSON.stringify(courses));
        return true;
    }
    
    return false;
}

// حذف مادة
function deleteCourse(courseId) {
    const courses = getCourses();
    const newCourses = courses.filter(course => course.id !== courseId);
    
    // حذف المجموعات المرتبطة بالمادة
    const groups = getGroups();
    const newGroups = groups.filter(group => group.course_id !== courseId);
    
    // حذف المادة من المواد المختارة
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    if (settings.selected_courses) {
        settings.selected_courses = settings.selected_courses.filter(sc => sc.course_id !== courseId);
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    
    localStorage.setItem('courses', JSON.stringify(newCourses));
    localStorage.setItem('groups', JSON.stringify(newGroups));
    
    return true;
}

// الحصول على المجموعات
function getGroups() {
    return JSON.parse(localStorage.getItem('groups')) || [];
}

// الحصول على مجموعة بواسطة المعرف
function getGroupById(groupId) {
    const groups = getGroups();
    return groups.find(group => group.id === groupId);
}

// الحصول على المجموعات حسب المادة
function getGroupsByCourseId(courseId) {
    const groups = getGroups();
    return groups.filter(group => group.course_id === courseId);
}

// إضافة مجموعة جديدة
function addGroup(group) {
    const groups = getGroups();
    
    // إنشاء معرف جديد
    const newId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1;
    group.id = newId;
    
    // إضافة المجموعة
    groups.push(group);
    localStorage.setItem('groups', JSON.stringify(groups));
    
    return group;
}

// تحديث مجموعة موجودة
function updateGroup(group) {
    const groups = getGroups();
    const index = groups.findIndex(g => g.id === group.id);
    
    if (index !== -1) {
        groups[index] = group;
        localStorage.setItem('groups', JSON.stringify(groups));
        return true;
    }
    
    return false;
}

// حذف مجموعة
function deleteGroup(groupId) {
    const groups = getGroups();
    const newGroups = groups.filter(group => group.id !== groupId);
    
    // حذف المجموعة من المواد المختارة
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    if (settings.selected_courses) {
        settings.selected_courses = settings.selected_courses.filter(sc => sc.group_id !== groupId);
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    
    localStorage.setItem('groups', JSON.stringify(newGroups));
    
    return true;
}

// الحصول على المستخدمين
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// الحصول على المستخدم الحالي
function getCurrentUser() {
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    return settings.current_user;
}

// الحصول على المواد المختارة
function getSelectedCourses() {
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    return settings.selected_courses || [];
}

// إضافة مادة إلى المواد المختارة
function addSelectedCourse(courseId, groupId) {
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    
    // التحقق من وجود المادة في المواد المختارة
    const existingCourse = settings.selected_courses.find(sc => sc.course_id === courseId);
    if (existingCourse) {
        return { success: false, message: 'المادة مسجلة مسبقاً' };
    }
    
    // التحقق من عدم تجاوز حد الساعات المعتمدة
    const course = getCourseById(courseId);
    if (!course) {
        return { success: false, message: 'لم يتم العثور على المادة' };
    }
    
    const totalHours = calculateTotalCreditHours();
    const limit = settings.credit_hours_limit;
    
    if (limit !== 0 && totalHours + course.credit_hours > limit) {
        return { success: false, message: `لا يمكن تسجيل المادة. ستتجاوز الحد المسموح به (${limit} ساعة)` };
    }
    
    // التحقق من عدم وجود تعارض في المواعيد
    const group = getGroupById(groupId);
    if (!group) {
        return { success: false, message: 'لم يتم العثور على المجموعة' };
    }
    
    const conflict = checkScheduleConflict(group);
    if (conflict) {
        return { success: false, message: `يوجد تعارض في المواعيد مع مادة ${conflict}` };
    }
    
    // إضافة المادة إلى المواد المختارة
    settings.selected_courses.push({
        course_id: courseId,
        group_id: groupId
    });
    
    localStorage.setItem('settings', JSON.stringify(settings));
    
    return { success: true, message: 'تم تسجيل المادة بنجاح' };
}

// إزالة مادة من المواد المختارة
function removeSelectedCourse(courseId) {
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    
    // التحقق من وجود المادة في المواد المختارة
    const index = settings.selected_courses.findIndex(sc => sc.course_id === courseId);
    if (index === -1) {
        return false;
    }
    
    // إزالة المادة من المواد المختارة
    settings.selected_courses.splice(index, 1);
    localStorage.setItem('settings', JSON.stringify(settings));
    
    return true;
}

// التحقق من وجود تعارض في المواعيد
function checkScheduleConflict(newGroup) {
    const selectedCourses = getSelectedCourses();
    
    for (const sc of selectedCourses) {
        const group = getGroupById(sc.group_id);
        if (group && group.schedule.day === newGroup.schedule.day && group.schedule.time === newGroup.schedule.time) {
            const course = getCourseById(sc.course_id);
            return course ? course.name : 'أخرى';
        }
    }
    
    return null;
}

// حساب إجمالي الساعات المعتمدة
function calculateTotalCreditHours() {
    const selectedCourses = getSelectedCourses();
    let totalHours = 0;
    
    for (const sc of selectedCourses) {
        const course = getCourseById(sc.course_id);
        if (course) {
            totalHours += course.credit_hours;
        }
    }
    
    return totalHours;
}

// تعيين حد الساعات المعتمدة
function setCreditHoursLimit(limit) {
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    settings.credit_hours_limit = limit;
    localStorage.setItem('settings', JSON.stringify(settings));
    return true;
}

// الحصول على إعدادات النظام
function getSettings() {
    return JSON.parse(localStorage.getItem('settings')) || {};
}

// توليد جداول بديلة
function generateAlternativeSchedules() {
    const selectedCourses = getSelectedCourses();
    
    // التحقق من وجود مواد مسجلة
    if (selectedCourses.length === 0) {
        return { success: false, message: 'لا توجد مواد مسجلة لتوليد جداول بديلة' };
    }
    
    // الحصول على جميع المجموعات المتاحة لكل مادة
    const courseGroups = {};
    for (const sc of selectedCourses) {
        const courseId = sc.course_id;
        const groups = getGroupsByCourseId(courseId);
        if (groups.length > 1) {
            courseGroups[courseId] = groups;
        }
    }
    
    // التحقق من وجود مواد لها مجموعات متعددة
    const coursesWithMultipleGroups = Object.keys(courseGroups);
    if (coursesWithMultipleGroups.length === 0) {
        return { success: false, message: 'لا توجد مواد لها مجموعات متعددة لتوليد جداول بديلة' };
    }
    
    // إنشاء الجداول البديلة
    const alternatives = [];
    
    // توليد حتى 3 جداول بديلة
    for (let i = 0; i < 3; i++) {
        // نسخ الجدول الحالي
        const alternativeGroups = [];
        
        // إضافة المجموعات الحالية للمواد التي ليس لها مجموعات متعددة
        for (const sc of selectedCourses) {
            if (!coursesWithMultipleGroups.includes(sc.course_id.toString())) {
                const group = getGroupById(sc.group_id);
                if (group) {
                    alternativeGroups.push(group);
                }
            }
        }
        
        // اختيار مجموعات بديلة للمواد التي لها مجموعات متعددة
        let validAlternative = true;
        
        for (const courseId of coursesWithMultipleGroups) {
            const groups = courseGroups[courseId];
            
            // اختيار مجموعة عشوائية مختلفة عن المجموعة الحالية
            const currentGroupId = selectedCourses.find(sc => sc.course_id.toString() === courseId).group_id;
            const alternativeGroups2 = groups.filter(g => g.id !== currentGroupId);
            
            if (alternativeGroups2.length === 0) {
                continue;
            }
            
            // اختيار مجموعة عشوائية
            const randomIndex = Math.floor(Math.random() * alternativeGroups2.length);
            const selectedGroup = alternativeGroups2[randomIndex];
            
            // التحقق من عدم وجود تعارض في المواعيد
            let hasConflict = false;
            for (const group of alternativeGroups) {
                if (group.schedule.day === selectedGroup.schedule.day && group.schedule.time === selectedGroup.schedule.time) {
                    hasConflict = true;
                    break;
                }
            }
            
            if (hasConflict) {
                validAlternative = false;
                break;
            }
            
            alternativeGroups.push(selectedGroup);
        }
        
        // إضافة الجدول البديل إذا كان صالحاً
        if (validAlternative && alternativeGroups.length === selectedCourses.length) {
            // التحقق من عدم تكرار الجدول البديل
            const isDuplicate = alternatives.some(alt => {
                return JSON.stringify(alt.sort((a, b) => a.id - b.id)) === JSON.stringify(alternativeGroups.sort((a, b) => a.id - b.id));
            });
            
            if (!isDuplicate) {
                alternatives.push(alternativeGroups);
            }
        }
        
        // التوقف إذا تم توليد 3 جداول بديلة
        if (alternatives.length >= 3) {
            break;
        }
    }
    
    // التحقق من وجود جداول بديلة
    if (alternatives.length === 0) {
        return { success: false, message: 'لم يتم العثور على جداول بديلة متاحة' };
    }
    
    return { success: true, alternatives };
}

// تطبيق جدول بديل
function applyAlternativeSchedule(alternativeGroups) {
    // الحصول على المواد المختارة الحالية
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    const selectedCourses = settings.selected_courses || [];
    
    // إنشاء مواد مختارة جديدة
    const newSelectedCourses = [];
    
    // إضافة المواد من الجدول البديل
    for (const group of alternativeGroups) {
        newSelectedCourses.push({
            course_id: group.course_id,
            group_id: group.id
        });
    }
    
    // تحديث المواد المختارة
    settings.selected_courses = newSelectedCourses;
    localStorage.setItem('settings', JSON.stringify(settings));
    
    return { success: true, message: 'تم تطبيق الجدول البديل بنجاح' };
}
