import React, { useContext, useState } from "react";
import bgImage from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext.jsx";
import axios from "axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { serverUrl } = useContext(userDataContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter valid email");
      return;
    }

    try {
      setLoading(true);
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setError("");
      setLoading(false);
      console.log(result);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <div
      className="w-full h-[100vh] flex items-center justify-center bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000052] backdrop-blur flex flex-col items-center justify-center gap-4 p-10 shadow-lg shadow-black rounded-lg"
      >
        <h1 className="text-3xl text-white font-semibold mb-8">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <div className="w-[80%] flex flex-col gap-2 text-white">
          <h5 className="text-xl font-semibold">Name : </h5>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="text-lg font-semibold px-5 py-3 border-2 rounded-lg w-full"
          />
        </div>

        <div className="w-[80%] flex flex-col gap-2 text-white">
          <h5 className="text-xl font-semibold">Email : </h5>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="text-lg font-semibold px-5 py-3 border-2 rounded-lg w-full"
          />
        </div>

        <div className="w-[80%] flex flex-col gap-2 text-white">
          <h5 className="text-xl font-semibold ">Password : </h5>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="text-lg font-semibold px-5 py-3 border-2 rounded-lg w-full"
            />
            {showPassword ? (
              <IoEyeOff
                onClick={() => setShowPassword(false)}
                className="absolute text-white top-[15px] right-[20px] w-[25px] h-[25px] cursor-pointer"
              />
            ) : (
              <IoEye
                onClick={() => setShowPassword(true)}
                className="absolute text-white top-[15px] right-[20px] w-[25px] h-[25px] cursor-pointer"
              />
            )}
          </div>
        </div>
        {error ? (
          <div className="mt-2">
            <h3 className="text-xl text-red-700 font-semibold">{error}</h3>
          </div>
        ) : null}
        <div className="mt-5">
          <button
            onClick={handleSignUp}
            className="text-xl font-semibold text-white bg-green-800 px-4 py-2 rounded cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading.." : "Register"}
          </button>
        </div>
        <p className="text-white">
          Already have an account ?
          <span
            onClick={() => {
              navigate("/login");
            }}
            className="text-blue-300 underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
