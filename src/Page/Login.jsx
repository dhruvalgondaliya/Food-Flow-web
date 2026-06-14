import { Link, useNavigate } from "react-router-dom";
import CommanInput from "../Component/CommanComponent/CommanInput";
import { API_URL } from "../Component/Server/Server";
import Logo from "../assets/FoodFlow-login.png";
import { useState } from "react";
import axios from "axios";
import { useAlert } from "../ContextProvider/AlertContext";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}user/login`, {
        Email,
        Password,
      });
      showAlert("User Login Successfully", "success");

      // Store token in localstore
      const token = res.data.token;
      const role = res.data.user.role;
      const userId = res.data.user.id;
      const userName = res.data.user.name;
      const imageurl = res.data.user.imageurl;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("imageurl", imageurl);

      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      const errMessage = error.response?.data?.message || "Login failed!";
      const errDetails = error.response?.data?.errors;

      // If errDetails is an array or object, join or stringify it
      let finalMessage = errMessage;
      if (Array.isArray(errDetails)) {
        finalMessage += " " + errDetails.join(", ");
      } else if (typeof errDetails === "object" && errDetails !== null) {
        finalMessage += " " + Object.values(errDetails).join(", ");
      } else if (typeof errDetails === "string") {
        finalMessage += " " + errDetails;
      }

      showAlert(finalMessage, "error");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={loginUser}
          className="w-full max-w-md bg-white p-6 rounded-xl shadow-md"
        >
          <div className="w-full flex justify-center mb-6">
            <img
              src={Logo}
              alt="Logo"
              className="w-32 h-auto sm:w-40 md:w-48 object-contain"
            />
          </div>

          {/* Email Input */}
          <div>
            <CommanInput
              label="Email"
              name="Email"
              type="email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
          </div>

          {/* Password Input with Hide/Show */}
          <div className="relative">
            <CommanInput
              label="Password"
              name="Password"
              type={showPassword ? "text" : "password"}
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline hover:text-blue-800"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-[var(--color-family)] text-white py-2 rounded-full hover:bg-[var(--color-family)] transition cursor-pointer"
          >
            Login
          </button>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <Link to="/registration" className="transition">
              Don&apos;t have an account?{" "}
              <span className="text-sm text-blue-600 hover:underline hover:text-blue-800 cursor-pointer">
                Register here
              </span>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
