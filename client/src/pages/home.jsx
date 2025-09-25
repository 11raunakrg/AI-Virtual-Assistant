import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData } = useContext(userDataContext);
  const { getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const [enabled, setEnabled] = useState(false);
  const [listening, setListening] = useState(false);

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  // Unlock speech synthesis after first click
  const unlockSpeech = () => {
    if (!enabled) {
      const utter = new SpeechSynthesisUtterance(" ");
      utter.volume = 0;
      synth.speak(utter);
      setEnabled(true);
    }
  };

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      // console.log(result.data);
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const speak = (text) => {
    if (!text) return;

    // Pause recognition while speaking
    isSpeakingRef.current = true;

    text = text.replace(/\n/g, " ").trim();
    const chunkSize = 200;

    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.slice(i, i + chunkSize);
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = "hi-IN";
      utterance.rate = 1;
      utterance.pitch = 1;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices.find((v) => v.lang === "hi-IN") || voices[0];
      }

      utterance.onend = () => {
        if (i + chunkSize >= text.length) {
          isSpeakingRef.current = false;
        }
      };

      synth.speak(utterance);
    }
  };

  const handleCommand = (data) => {
    const { type, userInput } = data;

    switch (type) {
      case "google_search":
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
          "_blank"
        );
        break;

      case "youtube_search":
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            userInput
          )}`,
          "_blank"
        );
        break;

      case "youtube_play":
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            userInput
          )}`,
          "_blank"
        );
        break;

      case "calculator_open":
        window.open("https://www.google.com/search?q=calculator", "_blank");
        break;

      case "instagram_open":
        window.open("https://www.instagram.com", "_blank");
        break;

      case "facebook_open":
        window.open("https://www.facebook.com", "_blank");
        break;

      case "whatsapp_open":
        window.open("https://web.whatsapp.com", "_blank");
        break;

      case "weather_show":
        window.open(
          `https://www.google.com/search?q=weather+${encodeURIComponent(
            userInput || "current location"
          )}`,
          "_blank"
        );
        break;

      default:
        console.log("Command not recognized:", type);
        break;
    }
  };

  useEffect(() => {
    if (!enabled) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;
    const isRecognizingRef = { current: false };

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          // console.log("Recognition started...");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            // console.log("Start error:", error);
          }
        }
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      // console.log("Listening...");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      // console.log("Recognition ended, restarting...");
      safeRecognition();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Transcript:", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        const data = await getGeminiResponse(transcript);
        // console.log(data);
        speak(data.response);
        handleCommand(data);
      }
    };

    // Start recognition safely
    safeRecognition();

    return () => recognition.stop();
  }, [enabled]);

  return (
    <div
      onClick={unlockSpeech}
      className="w-full min-h-screen bg-gradient-to-t from-black to-[#050550] flex flex-col items-center gap-4 pt-10 text-white relative cursor-pointer"
    >
      <button
        className="bg-red-700 font-semibold text-xl px-4 py-2 rounded-xl absolute right-[25px] top-[30px]"
        onClick={handleLogOut}
      >
        Logout
      </button>

      <button
        className="bg-blue-700 font-semibold text-xl px-4 py-2 rounded-xl absolute right-[25px] top-[90px]"
        onClick={() => navigate("/customize")}
      >
        Customize Assistant
      </button>

      <div className="mt-7 w-[70%] max-w-[400px] h-auto max-h-[500px] flex items-center justify-center overflow-hidden rounded-xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt="assistant image"
          className="h-[100%] object-center object-cover"
        />
      </div>

      <h1 className="text-3xl font-semibold">I am {userData.assistantName}</h1>

      {!enabled && (
        <p className="mt-4 text-lg text-yellow-400">
          Click anywhere to enable assistant voice
        </p>
      )}
    </div>
  );
};

export default Home;
