const doQuery = require("../query");

async function getResultSearching(dataToSearch) {
  const city = dataToSearch.city || "";
  const capacity = dataToSearch.capacity || 0;
  const price = dataToSearch.price || 999999;
  const startTime = dataToSearch.startTime;
  const endTime = dataToSearch.endTime;
  const date = dataToSearch.date;

  const values = [
    date,
    startTime,
    endTime,
    city,
    capacity,
    price,
    city,
    capacity,
    price,
  ];
  console.log(city);
  console.log(capacity);
  console.log(price);

  const sql = `SELECT *, role AS provider_type 
FROM users 
WHERE id IN (
    -- ספקים שזמינים בתאריך ספציפי
    SELECT provider_id FROM availability 
    WHERE available_date = ? AND is_available = 1 AND start_time <= ? AND end_time >= ?
)
AND id IN (
    -- ספקים שהם אולמות שעונים על הקריטריונים
    SELECT hall_id FROM halls 
    WHERE city = ? AND capacity >= ?  AND price <= ?
    
    UNION -- איחוד של ה-ID בלבד
    
    -- ספקים שהם שפים שעונים על הקריטריונים
    SELECT chief_id FROM chiefs 
    WHERE city = ? AND capacity >= ? AND price_per_hour <= ?
);`;
  const result = await doQuery(sql, values);

  console.log("The Result Of Searching 🔍🔍" + result);

  return result;
}

module.exports = { getResultSearching };
