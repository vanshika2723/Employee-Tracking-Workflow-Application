import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/session");
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  // const login = async (email, password, role_type) => {
  //   const { data } = await api.post("/auth/login", {
  //     email,
  //     password,
  //     role_type,
  //   });
  //   localStorage.setItem("token", data.token);
  //   setToken(data.token);
  //   setUser(data.user);
  //   return data.user;
  // };
const login = async (identity, password, role_type) => {
   console.log({
    identity,
    password,
    role_type
  });
  const { data } = await api.post("/auth/login", {
    identity,
    password,
    role_type,
  });
console.log("LOGIN RESPONSE:", data);
  localStorage.setItem("token", data.token);
  setToken(data.token);
  setUser(data.user);

  if(data.user.role === "EMPLOYEE"){

    await api.post("/activity/start");

  }


  return data.user;
};
//  const logout = async () => {

//     try{

//         await api.post("/activity/logout");

//     }catch(error){

//         console.log(error);

//     }


//     localStorage.removeItem("token");
//     setUser(null);
//     setToken(null);

// };
const logout = async () => {

    try{

        await api.post("/activity/logout");

    }catch(error){

        console.log("Logout tracking error:",error);

    }


    localStorage.removeItem("token");

    setUser(null);

    setToken(null);

};
  const value = { user, token, loading, login, logout, refreshSession };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
