# معلمي (Mualimi) 🎓
نظام إدارة تعلم (LMS) متكامل للمعلمين والطلاب مع الدعم الكامل لـ Backend و Database.

## المميزات 🌟
- **لوحة تحكم للمعلم**: إدارة المجموعات، الطلاب، إنشاء الاختبارات، وتتبع النتائج.
- **لوحة تحكم للطالب**: متابعة الاختبارات النشطة والنتائج.
- **Backend متكامل**: API قوية مبنية على Node.js و Express.
- **قاعدة بيانات**: MongoDB للتخزين الآمن والفعال للبيانات.
- **واجهة عصرية**: Bootstrap 5 و تصميم Responsive.

## المتطلبات 📋
- Node.js (v14+)
- MongoDB (محلي أو Atlas)
- npm

## كيف تبدأ؟ 🚀

### 1. التثبيت
```bash
cd Mualimi
npm install
```

### 2. إعداد قاعدة البيانات
- إذا كنت تستخدم MongoDB محلياً، تأكد من تشغيله:
  ```bash
  mongod
  ```
- أو استخدم MongoDB Atlas (السحابة)

### 3. تكوين متغيرات البيئة
تم إنشاء ملف `.env` بالفعل مع القيم الافتراضية:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mualimi
NODE_ENV=development
```

### 4. تشغيل الخادم
```bash
npm start
```
أو مع nodemon للتطوير:
```bash
npm run dev
```

### 5. الوصول للتطبيق
افتح المتصفح على:
- **الصفحة الرئيسية**: http://localhost:5000
- **API**: http://localhost:5000/api

## هيكل API 🔌

### Student Routes
- `GET /api/students` - احصل على جميع الطلاب
- `POST /api/students` - أضف طالب جديد
- `GET /api/students/:id` - احصل على بيانات طالب
- `PUT /api/students/:id` - حدّث بيانات الطالب
- `DELETE /api/students/:id` - احذف الطالب

### Teacher Routes
- `GET /api/teachers` - احصل على جميع المعلمين
- `POST /api/teachers` - أضف معلم جديد
- `GET /api/teachers/:id` - احصل على بيانات معلم

### Group Routes
- `GET /api/groups` - احصل على جميع المجموعات
- `POST /api/groups` - أنشئ مجموعة جديدة
- `POST /api/groups/:id/add-student` - أضف طالب لمجموعة

### Quiz Routes
- `GET /api/quizzes` - احصل على جميع الاختبارات
- `GET /api/quizzes/active/list` - احصل على الاختبارات النشطة
- `POST /api/quizzes` - أنشئ اختبار جديد
- `POST /api/quizzes/:id/submit` - أرسل إجابات اختبار


### Grade Routes
- `GET /api/grades` - احصل على جميع الدرجات
- `GET /api/grades/student/:studentId` - احصل على درجات الطالب
- `POST /api/grades` - أضف درجة جديدة

## هيكل المشروع 📁
```
Mualimi/
├── server.js              # خادم Express الرئيسي
├── package.json           # المكتبات والمتطلبات
├── .env                   # متغيرات البيئة
├── index.html             # الصفحة الرئيسية
├── student-dashboard.html # لوحة الطالب
├── teacher-dashboard.html # لوحة المعلم
├── config/
│   └── db.js             # إعدادات قاعدة البيانات
├── models/
│   ├── student.js        # نموذج الطالب
│   ├── teacher.js        # نموذج المعلم
│   ├── group.js          # نموذج المجموعة
│   ├── quiz.js           # نموذج الاختبار
│   └── grade.js          # نموذج الدرجة
├── routes/
│   ├── studentRoutes.js  # مسارات الطلاب
│   ├── teacherRoutes.js  # مسارات المعلمين
│   ├── quizRoutes.js     # مسارات الاختبارات
│   └── ...
├── pages/
│   ├── student/          # صفحات الطالب
│   └── teacher/          # صفحات المعلم
└── assets/
    ├── css/style.css     # الأنماط
    └── js/
        ├── api.js        # عميل API
        └── main.js       # السكريبت الرئيسي
```

## استخدام API من Frontend 🖥️
```javascript
// استخدام العميل API
const api = new MualimAPI();

// احصل على الطلاب
const students = await api.getAllStudents();

// أنشئ طالب جديد
const newStudent = await api.createStudent({
  name: 'أحمد',
  email: 'ahmed@example.com',
  age: 20,
  grade: '10'
});

// احصل على الاختبارات النشطة
const activeQuizzes = await api.getActiveQuizzes();
```

## نصائح التطوير 💡
- استخدم `npm run dev` مع nodemon للتطوير التفاعلي
- تحقق من `Network` Tab في Developer Tools لمراقبة طلبات API
- استخدم `localStorage` لحفظ بيانات الجلسة

---
Developed with ❤️ by Emad Ahmed
