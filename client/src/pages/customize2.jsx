import React, { useContext, useState } from "react";
import { userDataContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";

const Customize2 = () => {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );

  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/updateuser`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(result.data);
      setUserData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-t from-black
                to-[#04044d] flex flex-col items-center
                  gap-8 pt-10 relative"
    >
      <IoArrowBackSharp
        onClick={() => {
          navigate("/customize");
        }}
        className="absolute text-white top-[30px] left-[30px] w-[30px] h-auto  cursor-pointer"
      />

      <h1 className="text-3xl text-white font-bold mt-20">
        Set <span className="text-blue-500">Virtual Assistant</span> Name
      </h1>
      <input
        type="text"
        placeholder="Enter Your Virtual Assistant Name..."
        required
        className="text-xl font-semibold bg-white text-black px-5 py-4 border rounded-lg w-1/3"
        value={assistantName}
        onChange={(e) => {
          setAssistantName(e.target.value);
        }}
      />

      <button
        className="bg-green-800 text-white text-xl font-bold 
                    px-5 py-3 mt-5 rounded-xl cursor-pointer"
        onClick={() => {
          navigate("/");
          handleUpdateAssistant();
        }}
      >
        Create Assistant
      </button>
    </div>
  );
};

export default Customize2;
