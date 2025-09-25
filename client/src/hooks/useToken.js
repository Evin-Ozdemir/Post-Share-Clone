import { useState, useEffect } from "react";

const useToken = () => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        setToken(JSON.parse(authData));
      } catch (error) {
        console.error("Error parsing auth data:", error);
        setToken(null);
      }
    } else {
      setToken(null);
    }
  }, []);
  return { token };
};

export default useToken;
