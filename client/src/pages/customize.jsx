import React, { useContext, useState } from "react";
import Card from "../components/card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.jpeg";
import image6 from "../assets/image6.jpeg";
import authBg from "../assets/authBg.png";
import UploadCard from "../components/uploadCard";
import { userDataContext } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const {
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const navigate = useNavigate();

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#04044d] flex flex-col items-center justify-center gap-4 pt-10">
        <h1 className="text-white text-2xl text-center">
          Select your <span className="text-blue-300">Assistant Image</span>
        </h1>
        <div className="w-full max-w-[1200px] flex flex-wrap justify-center gap-6">
          <Card image={image1} />
          <Card image={image2} />
          <Card image={image3} />
          <Card image={image4} />
          <Card image={image5} />
          <Card image={image6} />
          <Card image={authBg} />
          <UploadCard />
        </div>
        {selectedImage || backendImage ? (
          <button
            className="text-blue-700 font-bold text-lg px-4 py-2 bg-white
         cursor-pointer rounded m-5"
            onClick={() => {
              navigate("/customize2");
            }}
          >
            Next
          </button>
        ) : (
          <div className="w-full h-[50px]"></div>
        )}
      </div>
    </>
  );
};

export default Customize;
