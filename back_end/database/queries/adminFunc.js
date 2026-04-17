/**
 * קובץ שאילתות עבור פאנל הניהול (Admin)
 * כאן מרוכזות כל הפעולות שרק אדמין מורשה לבצע על מסד הנתונים.
 */
const doQuery = require("../query");

/**
 * שליפת רשימת כל המשתמשים במערכת.
 * מחזיר: מזהה, שם פרטי, שם משפחה, אימייל ותפקיד.
 */
async function getAllUsers() {
  const sql = `SELECT id, first_name, last_name, email, role , is_active FROM users`;
  return await doQuery(sql, []);
}

/**
 * סינון ושליפת משתמשים לפי תפקיד ספציפי (למשל: 'customer', 'Chief', 'Admin').
 * @param {string} role - התפקיד לסינון
 */
async function getUsersByRole(role) {
  const sql = `SELECT id, first_name, last_name, email, role , is_active FROM users WHERE role = ?`;
  return await doQuery(sql, [role]);
}

/**
 * שליפת כל רשימת הפרופילים מטבלת השפים (Chiefs).
 */
async function getAllChiefsProfile() {
  const sql = `SELECT * FROM chiefs`;
  return await doQuery(sql, []);
}
/**
 * שליפת כל רשימת הפרופילים מטבלת בעלי האולמות (Halls).
 */
async function getAllHallsOwnerProfile() {
  const sql = `SELECT * FROM halls`;
  return await doQuery(sql, []);
}
/**
 * שליפת רשימה מאוחדת של כל נותני השירות (שפים ואולמות) כולל הסטטוס העסקי שלהם.
 * משתמש ב-UNION ALL לביצועים אופטימליים.
 */
async function getAllServices() {
  const sql = `
SELECT users.id,users.first_name, users.email, 'Chief' AS provider_type  , chiefs.status
FROM users
INNER JOIN chiefs ON users.id = chiefs.chief_id
UNION ALL
SELECT users.id,users.first_name,  users.email, 'Hall_Owner' AS provider_type , halls.status
FROM users
INNER JOIN halls ON users.id = halls.hall_id;`;
  return await doQuery(sql, []);
}
/**
 * שליפת נותני שירות מסוננים לפי סטטוס אישור (למשל: 'pending', 'approved', 'denied').
 * @param {string} status - הסטטוס המבוקש
 */
async function getAllServicesAccordingToStatus(status) {
  const sql = `SELECT users.id,users.first_name, users.email, 'Chief' AS provider_type  , chiefs.status
FROM users
INNER JOIN chiefs ON users.id = chiefs.chief_id
where chiefs.status = ?
UNION ALL
SELECT users.id,users.first_name,  users.email, 'Hall_Owner' AS provider_type , halls.status
FROM users
INNER JOIN halls ON users.id = halls.hall_id
WHERE halls.status = ?;`;
  const result = await doQuery(sql, [status, status]);
  return result;
}

/**
 * עדכון סטטוס האישור של עסק ספציפי.
 * @param {string} type - סוג העסק ('chiefs' או 'halls')
 * @param {number} id - מזהה המשתמש (User ID)
 * @param {string} newStatus - הסטטוס החדש לעדכון
 */
async function updateBusinessStatus(type, id, newStatus) {
  const allowedTypes = ["chiefs", "halls"];
  if (!allowedTypes.includes(type)) {
    throw new Error("Invalid table name");
  }
  if (type === "chiefs") {
    const sql = `UPDATE chiefs SET status = ?  WHERE chief_id = ?`;
    return await doQuery(sql, [newStatus, id]);
  } else {
    const sql = `UPDATE halls SET status = ? WHERE hall_id = ?`;
    return await doQuery(sql, [newStatus, id]);
  }
}
/**
 * שליפת פרופיל עסקי מלא לפי מזהה משתמש. 
 * בודק קודם בטבלת שפים, ואם לא נמצא - בטבלת אולמות.
 * @param {number} id - מזהה המשתמש
 */

async function getProfile(id) {
  console.log(id)
  // חיפוש בטבלת שפים
  const sql = `SELECT * FROM chiefs WHERE chief_id=?`;
  const result = await doQuery(sql, [id]);
  
  if (result.length > 0) {
    return result[0];
  }

  // אם לא נמצא, חיפוש בטבלת אולמות
  const sql1 = `SELECT * FROM halls WHERE hall_id=?`;
  const result1 = await doQuery(sql1, [id]);
  
  return result1.length > 0 ? result1[0] : null; 
}
/**
 * השבתה או הפעלה של משתמש במערכת (Soft Delete).
 * משנה את שדה is_active בטבלת users.
 * @param {number} status - סטטוס פעיל (1) או לא פעיל (0)
 * @param {number} userId - מזהה המשתמש
 */
async function deactivateUser(status, userId) {
  const sql = `UPDATE users SET is_active = ? WHERE id = ?`;
  return await doQuery(sql, [status, userId]);
}

module.exports = {
  getAllUsers,
  getUsersByRole,
  getAllChiefsProfile,
  getAllHallsOwnerProfile,
  getProfile,
  updateBusinessStatus,
  getAllServices,
  deactivateUser,
  getAllServicesAccordingToStatus,
};
