import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const testImage = () => {
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const handleUpload = (e) => {
    const formdata = new FormData();
    formdata.append("file", file);
    axios
      .post("http://localhost:5000/images/uploadImage", formdata)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/images/GetImage")
      .then((res) => setImage(res.data[0].ProfileImage))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])}></input>
      <button onClick={handleUpload}>Upload</button>
      <br />
      <img src={`http://localhost:5000/Images/` + image} alt="" />
    </div>
  );
};

export default testImage;
