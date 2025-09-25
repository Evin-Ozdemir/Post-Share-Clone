import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPostAction } from "../redux/actions/post";
import { getAllUsersAction } from "../redux/actions/auth";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { auth, allUsers } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    user: auth?.user?._id || "",
    title: "",
    description: "",
    category: "Genel",
    tags: "",
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllUsersAction());
    }
  }, [isOpen, dispatch]);

  const categories = [
    "Genel",
    "Teknoloji",
    "Sanat",
    "Spor",
    "Müzik",
    "Film",
    "Kitap",
    "Yemek",
    "Seyahat",
    "Eğitim",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      ...formData,
    };

    dispatch(createPostAction(postData));

    // Form verilerini temizle
    setFormData({
      user: auth?.user?._id || "",
      title: "",
      description: "",
      category: "Genel",
      tags: "",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Yeni Post Paylaş
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kullanıcı
                </label>
                <select
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Kullanıcı seçin...</option>
                  {allUsers?.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Post başlığını girin..."
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  placeholder="Post açıklamasını girin..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  required
                />
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Etiketler
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="etiket1, etiket2, etiket3"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Paylaş
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
