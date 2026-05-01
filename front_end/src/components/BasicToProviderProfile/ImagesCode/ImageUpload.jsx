import React, { useEffect, useState } from "react";
import classes from "./ImageUpload.module.css";
import axios from "axios";
import ImageItem from "./ImageItem";
/**
 * ImageUpload Component
 * ---------------------
 * קומפוננטה לניהול גלריית העסק (עד 5 תמונות).
 * * תכונות עיקריות:
 * - טעינת תמונות קיימות מה-Backend לפי הרשאות (Role).
 * - העלאת תמונות חדשות בפורמט FormData עם וולידציה (סוג קובץ וגודל).
 * - ניהול תצוגה מקדימה לפני שמירה.
 * - אינטגרציה עם ImageItem להצגת כל תמונה בנפרד.
 */
export default function ImageUpload({ role, user }) {
  const [images, setImages] = useState([]); //images that the provider selesct
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState([]); //images from DB
  const MAX_IMAGES = 5;
  const totalImages = images.length + existingImages.length;

  const fetchAllImages = async () => {
    try {
      let url;
      if (role === "Chief" || role === "Hall_Owner")
        url = "http://localhost:3030/provider/MyImages";
      else
        url = `http://localhost:3030/${role.toLowercase()}/ProviderImages/${user.id}`;
      const response = await axios.get(url, { withCredentials: true });
      if (response.data.success) {
        setExistingImages(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    if (user) fetchAllImages();
  }, [user?.id, role]);

  const handleChangeImage = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (totalImages + selectedFiles.length > MAX_IMAGES) {
      alert(`Max ${MAX_IMAGES} images.`);
      return;
    }
    const validFiles = selectedFiles.filter(
      (file) => file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024,
    );
    setImages((prev) => [...prev, ...validFiles]);
  };

  const submitGallery = async () => {
    if (images.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));
      const response = await axios.post(
        "http://localhost:3030/provider/upload-gallery",
        formData,
        { withCredentials: true },
      );
      if (response.data.success) {
        setImages([]);
        fetchAllImages();
      }
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSetMain = async (path) => {
    try {
      const response = await axios.post(
        "http://localhost:3030/provider/mainImage",
        { imagePath: path },
        { withCredentials: true },
      );
      if (response.data.success) fetchAllImages();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={classes.imagediv}>
      <div className={classes.header}>
        <h3>Gallery</h3>
        <span
          className={
            totalImages >= MAX_IMAGES ? classes.limitReached : classes.counter
          }
        >
          {totalImages} / {MAX_IMAGES}
        </span>
      </div>

      <div className={classes.previewContainer}>
        {existingImages.map((img, index) => (
          <ImageItem
            key={img.image_id || index}
            img={img}
            isExisting={true}
            isMain={img.is_main === 1}
            onRemove={async () => {
              if (window.confirm("Delete?")) {
                await axios.delete(
                  `http://localhost:3030/provider/deleteImage/${img.image_path}`,
                  { withCredentials: true },
                );
                fetchAllImages();
              }
            }}
            onSetMain={handleSetMain}
          />
        ))}

        {images.map((file, index) => (
          <ImageItem
            key={`new-${index}`}
            img={file}
            isExisting={false}
            onRemove={() =>
              setImages((prev) => prev.filter((_, i) => i !== index))
            }
          />
        ))}
      </div>

      {(role === "Hall_Owner" || role === "Chief") && (
        <div className={classes.controls}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleChangeImage}
            disabled={uploading || totalImages >= MAX_IMAGES}
          />
          <button
            onClick={submitGallery}
            disabled={uploading || images.length === 0}
          >
            {uploading ? "Uploading..." : "Save Gallery"}
          </button>
        </div>
      )}
    </div>
  );
}
