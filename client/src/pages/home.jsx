import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import HomeCard from "../components/homeCard";
import { getPostsAction } from "../redux/actions/post";
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export const Home = ({ searchTerm, selectedCategory }) => {
  const dispatch = useDispatch();
  const { posts, totalPages, currentPage, total } = useSelector(
    (state) => state.post
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(getPostsAction(1, selectedCategory, searchTerm)).finally(() => {
      setLoading(false);
    });
  }, [dispatch, selectedCategory, searchTerm]);

  const loadMorePosts = () => {
    if (currentPage < totalPages && !loading) {
      setLoading(true);
      dispatch(
        getPostsAction(currentPage + 1, selectedCategory, searchTerm)
      ).finally(() => {
        setLoading(false);
      });
    } else {
      setHasMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Son Paylaşımlar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Topluluktan gelen en son paylaşımları keşfedin
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Toplam Post
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Toplam Beğeni
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {posts.reduce(
                    (sum, post) => sum + (post.likes?.length || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Toplam Yorum
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {posts.reduce(
                    (sum, post) => sum + (post.comments?.length || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Results Info */}
        {(searchTerm || selectedCategory !== "all") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {posts.length}
                </span>{" "}
                sonuç bulundu
                {searchTerm && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {" "}
                    "{searchTerm}" için
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {" "}
                    {selectedCategory} kategorisinde
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )}

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <InfiniteScroll
            dataLength={posts.length}
            next={loadMorePosts}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            }
            endMessage={
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Tüm postları gördünüz! 🎉
                </p>
              </div>
            }
          >
            <div className="space-y-6">
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HomeCard post={post} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </InfiniteScroll>
        ) : !loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || selectedCategory !== "all"
                ? "Arama sonucu bulunamadı"
                : "Henüz paylaşım yok"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCategory !== "all"
                ? `"${
                    searchTerm || selectedCategory
                  }" için hiçbir post bulunamadı`
                : "İlk paylaşımı yapmak için yukarıdaki butona tıklayın"}
            </p>
          </motion.div>
        ) : (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};
