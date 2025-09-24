import React, { useContext } from "react";
import { userDataContext } from "../context/userContext";

const Card = ({ image }) => {
  const {
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const handleClick = () => {
    setSelectedImage(image);
    setBackendImage(null);
    setFrontendImage(null);
  };

  return (
    <div
      className={`w-64 h-80 bg-[#0a0a51] border-2 rounded-2xl border-blue-800
         overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:border-4
          hover:border-white cursor-pointer ${
            selectedImage == image
              ? "border-4 border-white shadow-blue-950"
              : null
          }`}
      onClick={handleClick}
    >
      <img
        src={image}
        alt="customized image"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Card;
