import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

// utility function (renamed correctly)
const isTokenExpired = (token) => {
  try {
    const payloadBase64 = token
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;

    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
};

const ProtectedRoute = () => {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setExpired(!token || isTokenExpired(token));
  }, []);

  if (expired) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
