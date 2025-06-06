# متطلبات نظام تسجيل المواد الجامعية (النسخة الثابتة)

## المتطلبات العامة
1. موقع ثابت يعمل بالكامل بدون backend (HTML/CSS/JavaScript فقط)
2. تخزين البيانات محلياً باستخدام localStorage
3. تصميم عصري واحترافي متوافق مع جميع الأجهزة
4. دعم الوضع الليلي (Dark Mode)
5. جميع الأزرار والقوائم متفاعلة 100%

## الصفحات الرئيسية
1. **الصفحة الرئيسية**: عرض نظرة عامة عن النظام
2. **صفحة المواد الدراسية**: عرض المواد المتاحة للتسجيل
3. **صفحة الجدول الدراسي**: عرض الجدول الدراسي للطالب
4. **صفحة تسجيل الدخول**: للوصول إلى لوحة الإدارة

## لوحة الإدارة
1. **لوحة المعلومات**: عرض إحصائيات وبيانات عن المواد والأقسام
2. **إدارة المواد**: إضافة، تعديل، حذف المواد
3. **إدارة المجموعات**: إضافة، تعديل، حذف مجموعات المواد

## الوظائف التفاعلية المطلوبة

### الواجهة الأمامية
1. **نظام تحديد عدد الساعات المعتمدة**:
   - قائمة في الشريط العلوي لاختيار عدد الساعات (12، 14، 18، 21، أو "حر")
   - منع تجاوز عدد الساعات المحدد عند تسجيل المواد

2. **عرض عدد الساعات المسجلة**:
   - عداد يظهر عدد الساعات المسجلة أثناء اختيار المواد

3. **زر اقتراح جداول بديلة**:
   - عرض خيارات بديلة بنفس المواد ولكن بمجموعات مختلفة

4. **تنزيل الجدول**:
   - تنزيل الجدول كملف Excel
   - تنزيل الجدول كصورة

### لوحة الإدارة
1. **إدارة المواد**:
   - إضافة مادة جديدة مع تحديد عدد الساعات المعتمدة
   - تعديل بيانات المواد الموجودة
   - حذف المواد
   - تصفية المواد حسب القسم
   - البحث عن المواد

2. **إدارة المجموعات**:
   - إضافة مجموعة جديدة
   - تعديل بيانات المجموعات
   - حذف المجموعات
   - ربط المجموعات بالمواد

3. **لوحة المعلومات**:
   - عرض إحصائيات (عدد المواد، عدد المجموعات، عدد الأقسام، متوسط الساعات المعتمدة)
   - رسوم بيانية لتوزيع المواد حسب الأقسام
   - رسوم بيانية لتوزيع الساعات المعتمدة
   - عرض آخر المواد المضافة

## بيانات النظام
1. **الأقسام**:
   - قسم الهندسة الطبية
   - قسم الهندسة الكهربائية
   - قسم الهندسة الميكانيكية
   - قسم الهندسة المعمارية
   - قسم الهندسة الكيميائية
   - قسم هندسة سيارات
   - قسم هندسة الميكاترونكس

2. **المواد**:
   - اسم المادة
   - القسم
   - عدد الساعات المعتمدة
   - الوصف
   - المجموعات المتاحة

3. **المجموعات**:
   - اسم المجموعة
   - المادة المرتبطة
   - اسم الأستاذ
   - بيانات الجدول (اليوم، الوقت، القاعة)

4. **المستخدمين**:
   - 10 حسابات مسؤولين عشوائية للدخول إلى لوحة الإدارة

## متطلبات التصميم
1. ألوان احترافية (الأزرق الجامعي، الرمادي الداكن، الأبيض النقي)
2. خطوط عصرية وواضحة مثل "Cairo" أو "Roboto"
3. أيقونات أنيقة (مكتبة Lucide)
4. قوائم منسدلة متحركة بسلاسة
5. تصميم شبكي (Grid Layout) لعرض المحتوى
6. بطاقات (Cards) لعرض المواد والجداول
7. واجهة متجاوبة تعمل على جميع الأجهزة
8. إشعارات ذكية عند تجاوز الحد المسموح من الساعات أو عند نجاح الإضافة
