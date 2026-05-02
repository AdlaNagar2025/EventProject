const doQuery = require("../query");

async function createBusinessProfile({ businessData, user }) {
  const userId = user.id;

  if (user.role === "Chief") {
    let {
      specialty, city, street, house_number,
      lat, lng, price_per_hour, experience_years,
      description, capacity, phone
    } = businessData;

    // בדיקת תקינות
    if (!specialty || !city || price_per_hour <= 0 || capacity <= 0) {
      return { success: false, message: "Missing or invalid data for Chief profile" };
    }

    const sql = `
      INSERT INTO chiefs (chief_id, phone, specialty, city, street, house_number, lat, lng, price_per_hour, experience_years, description, capacity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        phone = VALUES(phone),
        specialty = VALUES(specialty),
        city = VALUES(city),
        street = VALUES(street),
        house_number = VALUES(house_number),
        lat = VALUES(lat),
        lng = VALUES(lng),
        price_per_hour = VALUES(price_per_hour),
        experience_years = VALUES(experience_years),
        description = VALUES(description),
        capacity = VALUES(capacity);
    `;

    const values = [userId, phone, specialty, city, street, house_number, lat, lng, price_per_hour, experience_years, description, capacity];

    try {
      await doQuery(sql, values);
      return { success: true, message: "Chief profile saved/updated successfully! ✨" };
    } catch (err) {
      console.error("DB Error Chief:", err);
      return { success: false, message: "Database error while saving profile" };
    }

  } else if (user.role === "Hall_Owner") {
    let {
      hall_name, city, street, house_number,
      lat, lng, capacity, price, phone,
      email, description
    } = businessData;

    if (!hall_name || !city || price <= 0 || capacity <= 0) {
      return { success: false, message: "Missing or invalid data for Hall profile" };
    }

    const sql = `
      INSERT INTO halls (hall_id, hall_name, city, street, house_number, lat, lng, capacity, price, phone, email, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        hall_name = VALUES(hall_name),
        city = VALUES(city),
        street = VALUES(street),
        house_number = VALUES(house_number),
        lat = VALUES(lat),
        lng = VALUES(lng),
        capacity = VALUES(capacity),
        price = VALUES(price),
        phone = VALUES(phone),
        email = VALUES(email),
        description = VALUES(description);
    `;

    const values = [userId, hall_name, city, street, house_number, lat, lng, capacity, price, phone, email, description];

    try {
      await doQuery(sql, values);
      return { success: true, message: "Hall profile saved/updated successfully! ✨" };
    } catch (err) {
      console.error("DB Error Hall:", err);
      return { success: false, message: "Database error while saving profile" };
    }
  }

  return { success: false, message: "Invalid user role" };
}






async function checkStatus(providerId, role) {
  let sql = "";
  if (role === "Chief") {
    sql = `SELECT status FROM chiefs WHERE chief_id = ?`;
  } else {
    sql = `SELECT status FROM halls WHERE hall_id = ?`;
  }

  const result = await doQuery(sql, [providerId]);
  return result[0]?.status;
}



module.exports = {createBusinessProfile,checkStatus};