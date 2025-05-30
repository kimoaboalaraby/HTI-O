// ملف وظائف الجدول الدراسي
// يحتوي على وظائف عرض الجدول وتوليد الجداول البديلة والتصدير

// تحميل الجدول عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة البيانات
    initializeData();
    
    // عرض المواد المسجلة
    displayRegisteredCourses();
    
    // تحديث عداد الساعات المعتمدة
    updateCreditHoursCounter();
    
    // إضافة مستمعات الأحداث
    setupEventListeners();
});

// عرض المواد المسجلة
function displayRegisteredCourses() {
    const registeredCoursesList = document.getElementById('registeredCoursesList');
    const noCoursesMessage = document.getElementById('noCoursesMessage');
    const registeredCoursesSection = document.getElementById('registeredCoursesSection');
    const totalCreditHours = document.getElementById('totalCreditHours');
    
    // الحصول على المواد المختارة
    const selectedCourses = getSelectedCourses();
    
    // التحقق من وجود مواد مسجلة
    if (selectedCourses.length === 0) {
        noCoursesMessage.style.display = 'flex';
        registeredCoursesSection.style.display = 'none';
        return;
    } else {
        noCoursesMessage.style.display = 'none';
        registeredCoursesSection.style.display = 'block';
    }
    
    // إفراغ قائمة المواد المسجلة
    registeredCoursesList.innerHTML = '';
    
    // حساب إجمالي الساعات المعتمدة
    let totalHours = 0;
    
    // عرض المواد المسجلة
    selectedCourses.forEach(sc => {
        // الحصول على بيانات المادة والمجموعة
        const course = getCourseById(sc.course_id);
        const group = getGroupById(sc.group_id);
        
        if (course && group) {
            // إضافة الساعات المعتمدة للإجمالي
            totalHours += course.credit_hours;
            
            // إنشاء صف المادة
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${getDepartmentName(course.department_id)}</td>
                <td>${group.group_name}</td>
                <td>${group.professor}</td>
                <td>${group.schedule.day} ${group.schedule.time}</td>
                <td>${group.schedule.room}</td>
                <td>${course.credit_hours}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeCourseFromSchedule(${course.id})">
                        <i class="bi bi-trash"></i>
                        حذف
                    </button>
                </td>
            `;
            
            registeredCoursesList.appendChild(row);
        }
    });
    
    // تحديث إجمالي الساعات المعتمدة
    totalCreditHours.textContent = totalHours;
    
    // عرض الجدول الأسبوعي
    displayWeeklySchedule(selectedCourses);
}

// عرض الجدول الأسبوعي
function displayWeeklySchedule(selectedCourses) {
    // مسح جميع الخلايا
    const cells = document.querySelectorAll('[id^="cell-"]');
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.style.backgroundColor = '';
    });
    
    // الألوان المستخدمة للمواد
    const colors = [
        'rgba(59, 130, 246, 0.2)',   // أزرق فاتح
        'rgba(16, 185, 129, 0.2)',   // أخضر فاتح
        'rgba(245, 158, 11, 0.2)',   // برتقالي فاتح
        'rgba(239, 68, 68, 0.2)',    // أحمر فاتح
        'rgba(139, 92, 246, 0.2)',   // بنفسجي فاتح
        'rgba(236, 72, 153, 0.2)',   // وردي فاتح
        'rgba(20, 184, 166, 0.2)',   // فيروزي فاتح
        'rgba(249, 115, 22, 0.2)',   // برتقالي داكن فاتح
        'rgba(217, 70, 239, 0.2)',   // أرجواني فاتح
        'rgba(6, 182, 212, 0.2)'     // سماوي فاتح
    ];
    
    // عرض المواد في الجدول
    selectedCourses.forEach((sc, index) => {
        // الحصول على بيانات المادة والمجموعة
        const course = getCourseById(sc.course_id);
        const group = getGroupById(sc.group_id);
        
        if (course && group) {
            // تحديد الخلية المناسبة
            const cellId = `cell-${group.schedule.day}-${group.schedule.time}`;
            const cell = document.getElementById(cellId);
            
            if (cell) {
                // تحديد لون الخلية
                const colorIndex = index % colors.length;
                cell.style.backgroundColor = colors[colorIndex];
                
                // إضافة محتوى الخلية
                cell.innerHTML = `
                    <div style="padding: 5px;">
                        <strong>${course.name}</strong><br>
                        <small>${group.professor}</small><br>
                        <small>${group.schedule.room}</small>
                    </div>
                `;
            }
        }
    });
}

// إضافة مستمعات الأحداث
function setupEventListeners() {
    // مستمع حدث لتغيير حد الساعات المعتمدة
    const creditHoursLimit = document.getElementById('creditHoursLimit');
    creditHoursLimit.addEventListener('change', function() {
        setCreditHoursLimit(parseInt(this.value));
        updateCreditHoursCounter();
    });
    
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

// إلغاء تسجيل مادة
function removeCourseFromSchedule(courseId) {
    // حذف المادة من المواد المختارة
    removeSelectedCourse(courseId);
    
    // تحديث عرض المواد المسجلة
    displayRegisteredCourses();
    
    // تحديث عداد الساعات المعتمدة
    updateCreditHoursCounter();
    
    // عرض رسالة نجاح
    showToast('تم إلغاء تسجيل المادة بنجاح', 'success');
}

// عرض الجداول البديلة
function showAlternativeSchedules() {
    // توليد الجداول البديلة
    const result = generateAlternativeSchedules();
    
    if (!result.success) {
        showToast(result.message, 'warning');
        return;
    }
    
    // الحصول على قائمة الجداول البديلة
    const alternativesList = document.getElementById('alternativesList');
    alternativesList.innerHTML = '';
    
    // عرض الجداول البديلة
    result.alternatives.forEach((alternative, index) => {
        const alternativeCard = document.createElement('div');
        alternativeCard.className = 'card mb-3';
        
        // إنشاء عنوان البطاقة
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header d-flex justify-content-between align-items-center';
        cardHeader.innerHTML = `
            <h5 class="card-title">الجدول البديل ${index + 1}</h5>
            <button class="btn btn-primary btn-sm" onclick="applyAlternativeScheduleAndClose(${index})">
                <i class="bi bi-check-circle"></i>
                تطبيق
            </button>
        `;
        
        // إنشاء جسم البطاقة
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        // إنشاء جدول المواد
        const table = document.createElement('table');
        table.className = 'table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>المادة</th>
                    <th>المجموعة</th>
                    <th>الأستاذ</th>
                    <th>الموعد</th>
                    <th>القاعة</th>
                </tr>
            </thead>
            <tbody id="alternative-${index}-courses">
            </tbody>
        `;
        
        // إضافة المواد إلى الجدول
        const tbody = table.querySelector(`#alternative-${index}-courses`);
        alternative.forEach(group => {
            const course = getCourseById(group.course_id);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${group.group_name}</td>
                <td>${group.professor}</td>
                <td>${group.schedule.day} ${group.schedule.time}</td>
                <td>${group.schedule.room}</td>
            `;
            tbody.appendChild(row);
        });
        
        // إضافة الجدول إلى جسم البطاقة
        cardBody.appendChild(table);
        
        // إضافة العنوان والجسم إلى البطاقة
        alternativeCard.appendChild(cardHeader);
        alternativeCard.appendChild(cardBody);
        
        // إضافة البطاقة إلى قائمة الجداول البديلة
        alternativesList.appendChild(alternativeCard);
    });
    
    // تخزين الجداول البديلة في متغير عام
    window.alternativeSchedules = result.alternatives;
    
    // عرض النافذة المنبثقة
    const modal = document.getElementById('alternativesModal');
    modal.style.display = 'block';
}

// إغلاق نافذة الجداول البديلة
function closeAlternativesModal() {
    const modal = document.getElementById('alternativesModal');
    modal.style.display = 'none';
}

// تطبيق جدول بديل وإغلاق النافذة
function applyAlternativeScheduleAndClose(index) {
    // التحقق من وجود الجداول البديلة
    if (!window.alternativeSchedules || !window.alternativeSchedules[index]) {
        showToast('حدث خطأ أثناء تطبيق الجدول البديل', 'danger');
        return;
    }
    
    // تطبيق الجدول البديل
    const result = applyAlternativeSchedule(window.alternativeSchedules[index]);
    
    if (result.success) {
        // إغلاق النافذة المنبثقة
        closeAlternativesModal();
        
        // تحديث عرض المواد المسجلة
        displayRegisteredCourses();
        
        // تحديث عداد الساعات المعتمدة
        updateCreditHoursCounter();
        
        // عرض رسالة نجاح
        showToast(result.message, 'success');
    } else {
        showToast(result.message, 'danger');
    }
}

// تصدير الجدول كملف Excel
function exportScheduleToExcelFile() {
    // التحقق من وجود مواد مسجلة
    const selectedCourses = getSelectedCourses();
    if (selectedCourses.length === 0) {
        showToast('لا توجد مواد مسجلة لتصديرها', 'warning');
        return;
    }
    
    // في الإصدار الثابت، سنقوم بتنزيل ملف CSV بدلاً من Excel
    let csvContent = "المادة,القسم,المجموعة,الأستاذ,الموعد,القاعة,الساعات المعتمدة\n";
    
    selectedCourses.forEach(sc => {
        const course = getCourseById(sc.course_id);
        const group = getGroupById(sc.group_id);
        
        if (course && group) {
            csvContent += `"${course.name}","${getDepartmentName(course.department_id)}","${group.group_name}","${group.professor}","${group.schedule.day} ${group.schedule.time}","${group.schedule.room}","${course.credit_hours}"\n`;
        }
    });
    
    // إنشاء رابط تنزيل
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'جدول_المواد.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('تم تصدير الجدول بنجاح', 'success');
}

// تصدير الجدول كصورة
function exportScheduleAsImageFile() {
    // التحقق من وجود مواد مسجلة
    const selectedCourses = getSelectedCourses();
    if (selectedCourses.length === 0) {
        showToast('لا توجد مواد مسجلة لتصديرها', 'warning');
        return;
    }
    
    // في الإصدار الثابت، سنعرض رسالة توضح أن هذه الميزة تتطلب مكتبات إضافية
    showToast('تم تجهيز الجدول للتصدير كصورة. في الإصدار الكامل، سيتم تنزيل الصورة تلقائياً.', 'info');
}

// طباعة الجدول
function printScheduleTable() {
    // التحقق من وجود مواد مسجلة
    const selectedCourses = getSelectedCourses();
    if (selectedCourses.length === 0) {
        showToast('لا توجد مواد مسجلة لطباعتها', 'warning');
        return;
    }
    
    // إنشاء نافذة طباعة
    const printWindow = window.open('', '_blank');
    
    // إنشاء محتوى الطباعة
    let printContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>جدول المواد الدراسية</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: right;
                }
                th {
                    background-color: #f2f2f2;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <h1>جدول المواد الدراسية</h1>
            <table>
                <thead>
                    <tr>
                        <th>المادة</th>
                        <th>القسم</th>
                        <th>المجموعة</th>
                        <th>الأستاذ</th>
                        <th>الموعد</th>
                        <th>القاعة</th>
                        <th>الساعات المعتمدة</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // إضافة المواد إلى الجدول
    let totalHours = 0;
    selectedCourses.forEach(sc => {
        const course = getCourseById(sc.course_id);
        const group = getGroupById(sc.group_id);
        
        if (course && group) {
            totalHours += course.credit_hours;
            printContent += `
                <tr>
                    <td>${course.name}</td>
                    <td>${getDepartmentName(course.department_id)}</td>
                    <td>${group.group_name}</td>
                    <td>${group.professor}</td>
                    <td>${group.schedule.day} ${group.schedule.time}</td>
                    <td>${group.schedule.room}</td>
                    <td>${course.credit_hours}</td>
                </tr>
            `;
        }
    });
    
    // إضافة إجمالي الساعات المعتمدة
    printContent += `
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="6" style="text-align: left;"><strong>إجمالي الساعات المعتمدة:</strong></td>
                        <td><strong>${totalHours}</strong></td>
                    </tr>
                </tfoot>
            </table>
            
            <h2>جدول المحاضرات الأسبوعي</h2>
            <table>
                <thead>
                    <tr>
                        <th>الوقت / اليوم</th>
                        <th>السبت</th>
                        <th>الأحد</th>
                        <th>الاثنين</th>
                        <th>الثلاثاء</th>
                        <th>الأربعاء</th>
                        <th>الخميس</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // إضافة أوقات المحاضرات
    const times = [
        '08:00-09:30',
        '09:30-11:00',
        '11:00-12:30',
        '12:30-14:00',
        '14:00-15:30',
        '15:30-17:00'
    ];
    
    const days = [
        'السبت',
        'الأحد',
        'الاثنين',
        'الثلاثاء',
        'الأربعاء',
        'الخميس'
    ];
    
    // إنشاء مصفوفة لتخزين المواد في كل خلية
    const cellContents = {};
    
    // ملء المصفوفة بالمواد
    selectedCourses.forEach(sc => {
        const course = getCourseById(sc.course_id);
        const group = getGroupById(sc.group_id);
        
        if (course && group) {
            const cellId = `${group.schedule.day}-${group.schedule.time}`;
            cellContents[cellId] = `
                <div>
                    <strong>${course.name}</strong><br>
                    <small>${group.professor}</small><br>
                    <small>${group.schedule.room}</small>
                </div>
            `;
        }
    });
    
    // إضافة الصفوف إلى الجدول
    times.forEach(time => {
        printContent += `<tr><td>${time}</td>`;
        
        days.forEach(day => {
            const cellId = `${day}-${time}`;
            printContent += `<td>${cellContents[cellId] || ''}</td>`;
        });
        
        printContent += `</tr>`;
    });
    
    // إكمال المستند
    printContent += `
                </tbody>
            </table>
            
            <div class="footer">
                تم إنشاؤه بواسطة نظام تسجيل المواد الجامعية - ${new Date().toLocaleDateString('ar-EG')}
            </div>
        </body>
        </html>
    `;
    
    // كتابة المحتوى في نافذة الطباعة
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // طباعة النافذة بعد تحميل المحتوى
    printWindow.onload = function() {
        printWindow.print();
    };
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
