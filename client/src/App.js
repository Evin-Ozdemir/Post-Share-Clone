import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./pages/home";
import { Auth } from "./pages/auth";
import Profile from "./pages/profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./redux/store";
import useToken from "./hooks/useToken";
import { Link } from "react-router-dom";
import Navbar from "./components/navbar";
import Modal from "./components/modal";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function AppContent() {
  const { token } = useToken();
  const { auth } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Redux store'dan auth durumunu kontrol et, yoksa localStorage'dan al
  const isAuthenticated = auth?.token || token?.token;

  // Check for saved dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <BrowserRouter>
        <Navbar
          onOpenModal={openModal}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Modal isOpen={isModalOpen} onClose={closeModal} />
        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        P
                      </span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      PostShare'e Hoş Geldiniz
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                      Düşüncelerinizi paylaşın, başkalarının fikirlerini
                      keşfedin ve toplulukla bağlantı kurun.
                    </p>
                    <Link
                      to="/auth"
                      className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Başlamak İçin Giriş Yapın
                    </Link>
                  </div>
                </div>
              ) : (
                <Home
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                />
              )
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
