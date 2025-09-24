import React, { useRef, useEffect, useContext } from "react";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { userDataContext } from "../context/userContext.jsx";

const UploadCard = () => {
  const {
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const inputImage = useRef(null);

  const handleClick = () => {
    inputImage.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
      setSelectedImage(null);
    }
  };

  return (
    <>
      <div
        className="w-64 h-80 bg-[#0a0a51] border-2 rounded-2xl border-blue-800
         overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:border-4
         hover:border-white cursor-pointer flex flex-col gap-2 justify-center items-center text-white"
        onClick={handleClick}
      >
        {frontendImage ? (
          <img
            src={frontendImage}
            alt="preview"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <>
            <MdOutlineDriveFolderUpload className="w-10 h-8" />
            <p>Upload Image</p>
          </>
        )}
      </div>

      {/* Hidden input */}
      <input
        type="file"
        accept="image/*"
        ref={inputImage}
        hidden
        onChange={handleChange}
      />
    </>
  );
};

export default UploadCard;
