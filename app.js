const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const NotificationModel = require("./models/NotificationModel");

const userRouter = require("./router/UsersRouter");
const GlobalRoleController = require("./controllers/GlobalRoleController");

const app = express();

// إعداد التخزين للملفات المرفوعة
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      cb(null, "uploads/avatars");
    } else if (file.fieldname === "postImages") {
      cb(null, "uploads/images");
    } else if (file.fieldname === "messageImage") {
      cb(null, "uploads/messages");
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// إعدادات البرامج الوسيطة مع تسجيل الأخطاء
app.use((req, res, next) => {
  console.log(`طلب وارد: ${req.method} ${req.url}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET || "your_jwt_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// إعداد محرك العرض
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware لحساب unreadCount مع معالجة الأخطاء
app.use(async (req, res, next) => {
  try {
    if (req.session?.userId) {
      const unreadCount = await NotificationModel.getUnreadCount(req.session.userId);
      res.locals.unreadCount = unreadCount || 0;
    } else {
      res.locals.unreadCount = 0;
    }
  } catch (err) {
    console.error("خطأ في حساب unreadCount:", err.message);
    res.locals.unreadCount = 0;
  }
  next();
});

// تطبيق Middleware عالمي للتحقق من الدور مع معالجة الأخطاء
app.use((req, res, next) => {
  try {
    GlobalRoleController.setGlobalRole(req, res, next);
  } catch (err) {
    console.error("خطأ في GlobalRoleController:", err.message);
    next(err); // تمرير الخطأ للمعالجة الافتراضية
  }
});

// دمج الراوترات الأساسية
app.use("/", userRouter);


// مسار اختبار بسيط
app.get("/", (req, res) => {
  res.send("التطبيق يعمل بنجاح!");
});

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error("خطأ غير معالج:", err.stack);
  res.status(500).send("حدث خطأ داخلي في الخادم!");
});

// تصدير التطبيق لـ Vercel
module.exports = app;
