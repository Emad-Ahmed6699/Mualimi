# 🚀 دليل البدء السريع - معلمي

## الخطوة الأولى: المتطلبات
- Node.js مثبت
- MongoDB (محلي على 27017 أو Atlas)

## الخطوة الثانية: التثبيت والتشغيل

```bash
# 1. انتقل لمجلد المشروع
cd Mualimi

# 2. ثبت المكتبات
npm install

# 3. شغّل الخادم
npm start
```

## الخطوة الثالثة: الوصول

افتح المتصفح على:
```
http://localhost:5000
```

## الخطوة الرابعة: تجربة التطبيق

1. **اختر نوع الحساب**: معلم أو طالب
2. **استكشف لوحة التحكم**
3. **جرّب الملاحة والمميزات**

---

## 📡 اختبار API مباشرة

استخدم Postman أو أي API Client:

### جلب جميع الطلاب:
```
GET http://localhost:5000/api/students
```

### إضافة طالب جديد:
```
POST http://localhost:5000/api/students
Body (JSON):
{
  "name": "أحمد",
  "email": "ahmed@example.com",
  "age": 20,
  "grade": "10"
}
```

### جلب الاختبارات النشطة:
```
GET http://localhost:5000/api/quizzes/active/list
```

---

## 💻 الاستخدام من JavaScript

في أي صفحة HTML:

```javascript
// جلب جميع الطلاب
const students = await api.getAllStudents();
console.log(students);

// إضافة طالب جديد
const newStudent = await api.createStudent({
  name: "فاطمة",
  email: "fatima@example.com",
  age: 19,
  grade: "10"
});

// جلب الاختبارات النشطة
const activeQuizzes = await api.getActiveQuizzes();

// تسجيل حضور
await api.markAttendance({
  student: "studentId",
  group: "groupId",
  date: new Date(),
  status: "present"
});
```

---

## 🛠️ للتطوير (مع تحديث الملفات تلقائياً)

```bash
npm run dev
```

---

## 📚 الملفات المهمة

- **server.js** - الخادم الرئيسي
- **.env** - متغيرات البيئة
- **models/** - نماذج قاعدة البيانات
- **routes/** - مسارات API
- **assets/js/api.js** - عميل API الجاهز
- **README.md** - التوثيق الكامل
- **IMPLEMENTATION_SUMMARY.md** - ملخص التطوير

---

## ❓ الأسئلة الشائعة

**س: ما هو الخطأ "Cannot find module mongoose"؟**
ج: قم بتشغيل `npm install` لتثبيت المكتبات

**س: قاعدة البيانات لا تتصل؟**
ج: تأكد من:
- MongoDB مشغل (`mongod` في terminal آخر)
- رابط MongoDB في `.env` صحيح

**س: كيف أضيف بيانات تجريبية؟**
ج: استخدم Postman أو Client API المرفق:
```javascript
await api.createStudent({...});
```

---

## 🎯 النقاط التالية

- [ ] إضافة Authentication
- [ ] إضافة Validation
- [ ] إضافة Tests
- [ ] نشر على الإنترنت (Heroku/Vercel)

---

Good luck! 🎓
