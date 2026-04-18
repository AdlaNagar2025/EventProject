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
  const [existingImages, setExistingImages] = useState([]); 

  const MAX_IMAGES = 5; 
  const totalImages = images.length + existingImages.length; 



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

    if (images.length + selectedFiles.length + existingImages.length > 5) {
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
            fetchAllImages();

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





const removeImageFromDB = async (indexToRemove, pathToRemove) => {
  try {
    const response = await axios.delete(
      `http://localhost:3030/provider/deleteImage/${pathToRemove}`,
      { withCredentials: true }
    );
    if (response.data.success) {
      setExistingImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    } else {
      alert("Failed to delete image from server.");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    alert("An error occurred while deleting the image.");
  }
};


        
  return (
    <div className={classes.imagediv}>
      <div className={classes.header}>
        <h3>Business Gallery</h3>
        {/* הצגת המונה למשתמש */}
        <span className={totalImages >= MAX_IMAGES ? classes.limitReached : classes.counter}>
          {totalImages} / {MAX_IMAGES} Images
        </span>
      </div>

      <p>You can upload up to {MAX_IMAGES} high-quality images.</p>
      
      <div className={classes.previewContainer}>
        {/* תמונות מה-DB */}
        {existingImages.map((img, index) => (
          <div key={`existing-${index}`} className={classes.imageWrapper}>
            <img src={`http://localhost:3030/uploads/${img.image_path}`} alt="existing" className={classes.previewImg} />
            <button type="button" className={classes.removeBtn} onClick={() => removeImageFromDB(index, img.image_path)}>×</button>
          </div>
        ))}
        </div>

      {/* חסימת ה-Input אם הגענו למקסימום */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChangeImage}
        disabled={uploading || totalImages >= MAX_IMAGES}
        className={classes.fileInput}
      />

      {totalImages >= MAX_IMAGES && (
        <p className={classes.warningText}>You have reached the maximum limit of images.</p>
      )}

      <div className={classes.previewContainer}>
      

        {/* תצוגה מקדימה לחדשות */}
        {images.map((file, index) => (
          <div key={`new-${index}`} className={classes.imageWrapper}>
            <img src={URL.createObjectURL(file)} alt="preview" className={classes.previewImg} style={{ border: "2px solid #28a745" }} />
            <button type="button" className={classes.removeBtn} onClick={() => removeImage(index)}>×</button>
          </div>
        ))}
      </div>

      <button
        onClick={submitGallery}
        disabled={uploading || images.length === 0}
        className={classes.uploadBtn}
      >
        {uploading ? "Uploading..." : "Save New Images"}
      </button>
    </div>
  );
}
