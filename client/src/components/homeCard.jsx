import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deletePostAction,
  updatePostAction,
  likePostAction,
  addCommentAction,
  likeCommentAction,
} from "../redux/actions/post";
import { followUserAction } from "../redux/actions/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  UserPlusIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const HomeCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editData, setEditData] = useState({
    title: post.title,
    description: post.description,
    category: post.category || "Genel",
    tags: post.tags?.join(", ") || "",
  });

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Az önce";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} dakika önce`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} saat önce`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} gün önce`;

    return postDate.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isLiked = post.likes?.includes(auth?.user?._id);
  const isFollowing = auth?.user?.following?.includes(
    post.user?._id || post.user
  );

  const handleLike = () => {
    if (auth?.user?._id) {
      dispatch(likePostAction(post._id, auth.user._id));
    }
  };

  const handleFollow = () => {
    if (auth?.user?._id && post.user?._id) {
      dispatch(followUserAction(post.user._id, auth.user._id));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() && auth?.user?._id) {
      dispatch(
        addCommentAction(post._id, {
          user: auth.user._id,
          text: newComment.trim(),
        })
      );
      setNewComment("");
    }
  };

  const handleLikeComment = (commentId) => {
    if (auth?.user?._id) {
      dispatch(likeCommentAction(post._id, commentId, auth.user._id));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleSave = () => {
    dispatch(updatePostAction(post._id, editData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: post.title,
      description: post.description,
      category: post.category || "Genel",
      tags: post.tags?.join(", ") || "",
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deletePostAction(post._id));
    setShowDeleteConfirm(false);
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const goToProfile = () => {
    if (post.user?._id) {
      navigate(`/profile/${post.user._id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            onClick={goToProfile}
          >
            {post.user?.avatar ? (
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-lg">
                {post.user?.username?.charAt(0)?.toUpperCase() ||
                  post.user?.charAt(0)?.toUpperCase() ||
                  "U"}
              </span>
            )}
          </div>
          <div>
            <h3
              className="font-semibold text-gray-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
              onClick={goToProfile}
            >
              {post.user?.username || post.user}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(post.date)}
            </p>
            {post.category && (
              <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mt-1">
                {post.category}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <EllipsisHorizontalIcon className="w-6 h-6" />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-10">
              {auth?.user?._id === (post.user?._id || post.user) ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Sil
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFollow}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2"
                >
                  {isFollowing ? (
                    <>
                      <UserMinusIcon className="w-4 h-4" />
                      <span>Takipten Çık</span>
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="w-4 h-4" />
                      <span>Takip Et</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Başlık"
            />
            <textarea
              name="description"
              value={editData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Açıklama"
            />
            <input
              type="text"
              name="tags"
              value={editData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Etiketler (virgülle ayırın)"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Kaydet
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {post.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {post.description}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors duration-200 ${
              isLiked
                ? "text-red-500"
                : "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            }`}
          >
            {isLiked ? (
              <HeartSolidIcon className="w-5 h-5" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
            <span className="text-sm">{post.likes?.length || 0}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
          >
            <ChatBubbleLeftIcon className="w-5 h-5" />
            <span className="text-sm">{post.comments?.length || 0}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors duration-200">
            <ShareIcon className="w-5 h-5" />
            <span className="text-sm">Paylaş</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
          >
            {/* Add Comment */}
            {auth?.user?._id && (
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Yorum yazın..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Gönder
                  </button>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {post.comments?.map((comment) => (
                <div key={comment._id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">
                      {comment.user?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {comment.text}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.date)}
                        </span>
                        <button
                          onClick={() => handleLikeComment(comment._id)}
                          className="text-xs text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                        >
                          Beğen ({comment.likes?.length || 0})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Post'u Sil
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Bu post'u silmek istediğinizden emin misiniz? Bu işlem geri
                alınamaz.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Sil
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  İptal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomeCard;
