import React, { useEffect, useState } from "react";
import classes from "./ImageUpload.module.css";
import axios from "axios";
/**
 * קומפוננטה להעלאת גלריית תמונות לעסק.
 * מאפשרת בחירה מרובה של קבצים, הצגת תצוגה מקדימה (Preview),
 * ושליחה לשרת בפורמט FormData.
 */
export default function ImageUpload({ user }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState([]); // תמונות שכבר קיימות ב-DB



  const fetchAllImages = async () => {
    try {
      const response = await axios.get("http://localhost:3030/provider/MyImages", {
        withCredentials: true
      });
      if (response.data.success) {
        // שמירת רשימת נתיבי התמונות מהשרת
        setExistingImages(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchAllImages();
  }, []);
  /**
   * מטפל בשינוי בקלט הקבצים ומעדכן את ה-State.
   * כולל הגבלה ל-5 תמונות כפי שהוגדר ב-Backend.
   */
  const handleChangeImage = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 5) {
      alert("You can only upload up to 5 images in total.");
      return;
    }
    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not a valid image file.`);
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max size is 2MB.`);
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);
  };

  /**
   * שליחת התמונות לשרת.
   * משתמש ב-FormData כדי להעביר קבצים בינאריים דרך Axios.
   */
  const submitGallery = async () => {
    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      images.forEach((img) => {
        formData.append("images", img);
      });

      const response = await axios.post(
        "http://localhost:3030/provider/upload-gallery",
        formData,
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        alert("Success! " + response.data.message);
        // ניקוי הכתובות מהזיכרון לפני ריקון הסטייט
        images.forEach(img => URL.revokeObjectURL(URL.createObjectURL(img)));
        setImages([]);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Server Error";
      alert("Upload failed: " + msg);
    } finally {
      setUploading(false);
    }
  };

 
  const removeImage = (indexToRemove) => {
  URL.revokeObjectURL(URL.createObjectURL(images[indexToRemove]));
  setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
};




  return (
    <div className={classes.imagediv}>
      <h3>Business Gallery</h3>
      {/* תצוגת תמונות קיימות מהשרת */}
    <div className={classes.previewContainer}>
      {existingImages.map((img, index) => (
        <div key={`existing-${index}`} className={classes.imageWrapper}>
          <img
            src={`http://localhost:3030/uploads/${img.image_path}`} // נתיב מלא לתיקיית ה-uploads בשרת
            alt="existing"
            className={classes.previewImg}
          />
          {/* כאן אפשר להוסיף כפתור מחיקה מה-DB בעתיד */}
        </div>
      ))}
    </div>
      <p>Upload up to 5 high-quality images of your service or venue.</p>
      <input
        type="file"
        multiple
        accept="image/*" // מגביל את הבחירה רק לקבצי תמונה
        onChange={handleChangeImage}
        disabled={uploading || images.length >= 5}
      />
      <div className={classes.previewContainer}>
        {images.map((file, index) => (
          <div key={index} className={classes.imageWrapper}>
            <img
              src={URL.createObjectURL(file)}
              alt={`preview ${index}`}
              className={classes.previewImg}
            />
            <button
              type="button"
              className={classes.removeBtn}
              onClick={() => removeImage(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={submitGallery}
        disabled={uploading || images.length === 0}
        className={classes.uploadBtn}
      >
        {uploading ? "Uploading..." : "Upload Gallery"}
      </button>
    </div>
  );
}
