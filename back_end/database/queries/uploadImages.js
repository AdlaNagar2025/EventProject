const doQuery = require("../query");

/**
 * פונקציה השומרת את נתיבי התמונות שהועלו בבסיס הנתונים.
 * מקבלת את מזהה הספק, סוג הספק (שף/אולם) ומערך קבצים מ-Multer.
 * מגדירה אוטומטית את התמונה הראשונה כתמונה הראשית (is_main).
 */
async function uploadImagesToDB(providerId, provider_type, files) {
  if (!files || files.length === 0) {
    return {
      success: false,
      message: "No images provided for database saving",
    };
  }
  try {
    const values = files.map((file, index) => [
      providerId,
      provider_type,
      file.filename,
    ]);

    const sql = `INSERT INTO provider_images (provider_id,provider_type,image_path) VALUES ?`;

    await doQuery(sql, [values]);

    return {
      success: true,
      message: `${files.length} images saved to database successfully`,
    };
  } catch (err) {
    console.error("Database Error in uploadImagesToDB:", err);
    return {
      success: false,
      message: "Failed to link images to the provider profile in the database",
    };
  }
}

async function getAllImages(providerId) {
  const sql = `SELECT * FROM provider_images WHERE provider_id=?`;
  const result = await doQuery(sql, [providerId]);
  return result;
}

async function deleteImage(imagePath) {
  const sql = `DELETE FROM provider_images WHERE image_path = ?`;
  return await doQuery(sql, [imagePath]);
}

async function setMainImage(providerId, imagePath) {
  // 1. איפוס כל התמונות של הספק הספציפי ל-0
  const sqlReset = `UPDATE provider_images SET is_main = 0 WHERE provider_id = ?`;
  await doQuery(sqlReset, [providerId]);

  // 2. הגדרת התמונה הנבחרת ל-1
  const sqlSet = `UPDATE provider_images SET is_main = 1 WHERE image_path = ?`;
  return await doQuery(sqlSet, [imagePath]);
}

module.exports = { uploadImagesToDB, getAllImages, deleteImage, setMainImage };
