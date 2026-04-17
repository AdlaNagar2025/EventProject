import React, { useState } from "react";
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
        alert(response.data.message);
        setImages([]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={classes.imagediv}>
      <h3>Business Gallery</h3>
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
