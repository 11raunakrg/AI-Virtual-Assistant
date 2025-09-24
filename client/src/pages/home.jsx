import React, { useContext, useEffect } from "react";
import { userDataContext } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData } = useContext(userDataContext);
  const { getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log(result.data);
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Transcript : ", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        const data = await getGeminiResponse(transcript);
        console.log(data);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Recognition ended, restarting...");
      recognition.start();
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  return (
    <>
      <div
        className="w-full min-h-screen bg-gradient-to-t from-black
                to-[#050550] flex flex-col items-center
                  gap-4 pt-10 text-white relative"
      >
        <button
          className="bg-red-700 font-semibold text-xl px-4 py-2 rounded-xl
          cursor-pointer absolute right-[25px] top-[30px]"
          onClick={handleLogOut}
        >
          Logout
        </button>
        <button
          className="bg-blue-700 font-semibold text-xl px-4 py-2 rounded-xl
          cursor-pointer absolute right-[25px] top-[90px]"
          onClick={() => {
            navigate("/customize");
          }}
        >
          Customize Assistant
        </button>

        <div
          className=" mt-7 w-[70%] max-w-[400px] h-auto max-h-[500px] flex items-center
                        justify-center overflow-hidden rounded-xl shadow-lg"
        >
          <img
            src={userData?.assistantImage}
            alt="assistant image"
            className="h-[100%] object-center object-cover"
          />
        </div>
        <h1 className="text-3xl font-semibold">
          I am {userData.assistantName}
        </h1>
      </div>
    </>
  );
};

export default Home;
