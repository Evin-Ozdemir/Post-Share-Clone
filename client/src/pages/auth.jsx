import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAction, registerAction } from "../redux/actions/auth";

export const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const onChangeFunc = (e) => {
    const { name, value } = e.target;
    setAuthData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(
        loginAction(
          { email: authData.email, password: authData.password },
          navigate
        )
      );
    } else {
      dispatch(
        registerAction(
          {
            username: authData.username,
            email: authData.email,
            password: authData.password,
          },
          navigate
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Giriş Yap" : "Kayıt Ol"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                name="username"
                value={authData.username}
                onChange={onChangeFunc}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adınızı girin"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={authData.email}
              onChange={onChangeFunc}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email adresinizi girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              value={authData.password}
              onChange={onChangeFunc}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Şifrenizi girin"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </p>
      </div>
    </div>
  );
};
