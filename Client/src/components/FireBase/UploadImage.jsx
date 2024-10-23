import React, { useState } from "react";
import { imageDb } from "./Config";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
const UploadImage = () => {
  const [img, setImage] = useState("");
  const uploadImage = () => {
    const imageRef = (imageDb, `files/${v4()}`);
    uploadBytes(imageRef);
  };
  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={uploadImage}>Upload Image</button>
    </div>
  );
};

export default UploadImage;
