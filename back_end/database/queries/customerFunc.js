
const doQuery = require("../query");


async function getResultSearching(dataToSearch) {
    const city = dataToSearch.city || "";
    const capacity = dataToSearch.capacity || 0; 
    const price = dataToSearch.price || 999999; 

    const sql = `
      SELECT city, capacity, price , "halls" as type , halls.hall_id as id  FROM halls 
WHERE city =? AND capacity >= ? AND price <= ?
        UNION
SELECT  city, capacity, price_per_hour as price , "chiefs" as type   , chiefs.chief_id as id FROM chiefs
WHERE city =? AND capacity >= ? AND price_per_hour <= ?;
    `;

    const values = [city, capacity, price, city, capacity, price];
    
    const result = await doQuery(sql, values);
    return result;
}

module.exports={getResultSearching}

