const doQuery = require("../query");

async function getResultSearching(dataToSearch) {
  const city = dataToSearch.city || "";
  const capacity = dataToSearch.capacity || 0;
  const price = dataToSearch.price || 999999;
  const values = [city, capacity, price, city, capacity, price];
  console.log(city);
  console.log(capacity);
  console.log(price);

  const sql = `select * , role as provider_type FROM users where id in
 (SELECT  hall_id as id FROM halls WHERE city=? AND capacity >=? AND price<=?
 UNION 
SELECT  chiefs.chief_id as id FROM chiefs WHERE city=? AND capacity >=? AND chiefs.price_per_hour<=?
);`;
  const result = await doQuery(sql, values);

  console.log("The Result Of Searching 🔍🔍" + result);

  return result;
}

module.exports = { getResultSearching };
