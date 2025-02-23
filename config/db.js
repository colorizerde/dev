const mysql = require('mysql');
const util = require('util');

// إعداد الاتصال بقاعدة البيانات باستخدام الـ URL المقدم
const db = mysql.createConnection({
  host: "crossover.proxy.rlwy.net",
  user: "root",
  password: "WhFNHlpsDGfDxGgPStDYItnlHNIwlIos",
  database: "railway",
  port: 58837
});

db.connect((err) => {
  if (err) {
    console.error("❌ لم يتم الاتصال بقاعدة البيانات:", err);
    return;
  }
  console.log("✅ تم الاتصال بقاعدة البيانات بنجاح");
});

// تحويل db.query إلى Promise حتى يعمل مع async/await
db.query = util.promisify(db.query);

module.exports = db;
