import { useState } from "react";
import { API_URL } from "../Component/Server/Server";
import CommanInput from "../Component/CommanComponent/CommanInput";
import axios from "axios";
import Logo from "../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../ContextProvider/AlertContext";

function Registration() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    Email: "",
    Password: "",
    MobileNo: "",
    DeliveryAddress: "",
    gender: "",
    DietaryPreferences: "",
  });

  const registration = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}user/register`, formData);

      showAlert("User Registration SuccessFully", "success");
      setFormData({
        userName: "",
        Email: "",
        Password: "",
        MobileNo: "",
        DeliveryAddress: "",
        gender: "",
        DietaryPreferences: "",
      });

      // Navigation login page
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Registration failed!";
      const errDetails = error.response?.data?.errors;

      if (Array.isArray(errDetails)) {
        errDetails.forEach((msg) => toast.error(msg));
      } else {
        showAlert(errMessage, "error");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={registration}
          className="w-full max-w-md bg-white p-6 rounded-xl shadow-md"
        >
          <div className="w-full flex justify-center mb-6">
            <img
              src={Logo}
              alt="Logo"
              className="w-32 h-auto sm:w-40 md:w-48 lg:w-56 object-contain"
            />
          </div>

          <div className="flex gap-2  ">
            <div className="w-1/2">
              <CommanInput
                label="User Name"
                name="userName"
                type="text"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter User Name"
                required={true}
              />
            </div>
            <div className="w-1/2">
              <CommanInput
                label="Email"
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Enter Email"
                required={true}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <CommanInput
                label="Password"
                name="Password"
                type="text"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Enter Password"
                required={true}
              />
            </div>
            <div className="w-1/2">
              <CommanInput
                label="Mobile No"
                name="MobileNo"
                type="number"
                value={formData.MobileNo}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                required={true}
              />
            </div>
          </div>

          <CommanInput
            label="gender"
            name="gender"
            as="select"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
          />
          <CommanInput
            label="Dietary Preferences"
            name="DietaryPreferences"
            as="select"
            value={formData.DietaryPreferences}
            onChange={handleChange}
            options={[
              { value: "vegiterian", label: "Vegetarian" },
              { value: "nonVegiterian", label: "Non-Vegetarian" },
            ]}
          />
          <div>
            <CommanInput
              label="Delivery Address"
              name="DeliveryAddress"
              value={formData.DeliveryAddress}
              onChange={handleChange}
              placeholder="Enter Delivery Address"
              required={true}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[var(--color-family)] text-white py-2 rounded-full hover:bg-[var(--color-family)] transition cursor-pointer"
          >
            Submit
          </button>

          <p className="text-center py-2">
            Back to{" "}
            <Link to="/login">
              <span className="text-sm text-blue-600 hover:underline hover:text-blue-800">
                login
              </span>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Registration;
