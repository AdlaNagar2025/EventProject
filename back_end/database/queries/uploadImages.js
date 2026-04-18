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
      index === 0 ? 1 : 0, // התמונה הראשונה במערך תקבל 1 (ראשית)
    ]);

    const sql = `INSERT INTO provider_images (provider_id,provider_type,image_path,is_main) VALUES ?`;

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
module.exports = uploadImagesToDB;
