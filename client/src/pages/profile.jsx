import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  getUserProfileAction,
  updateProfileAction,
  followUserAction,
  getNotificationsAction,
} from "../redux/actions/auth";
import { getPostsAction } from "../redux/actions/post";
import {
  UserIcon,
  PencilIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  UserMinusIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth, userProfile, notifications } = useSelector(
    (state) => state.auth
  );
  const { posts } = useSelector((state) => state.post);

  const [isEditing, setIsEditing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    avatar: null,
  });

  const isOwnProfile = auth?.user?._id === id;
  const isFollowing = auth?.user?.following?.includes(id);

  useEffect(() => {
    if (id) {
      dispatch(getUserProfileAction(id));
      dispatch(getPostsAction(1, "all", "", id)); // Get user's posts
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        username: userProfile.username || "",
        bio: userProfile.bio || "",
        avatar: null,
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (auth?.user?._id) {
      dispatch(getNotificationsAction(auth.user._id));
    }
  }, [dispatch, auth?.user?._id]);

  const handleInputChange = (e) => {
    if (e.target.name === "avatar") {
      setProfileData({
        ...profileData,
        avatar: e.target.files[0],
      });
    } else {
      setProfileData({
        ...profileData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = () => {
    dispatch(updateProfileAction(id, profileData));
    setIsEditing(false);
  };

  const handleFollow = () => {
    if (auth?.user?._id) {
      dispatch(followUserAction(id, auth.user._id));
    }
  };

  const userPosts = posts.filter(
    (post) => post.user === id || post.user?._id === id
  );

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Geri
            </button>

            {!isOwnProfile && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleFollow}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isFollowing
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              {isEditing ? (
                <div className="relative">
                  <img
                    src={
                      userProfile.avatar ||
                      `https://ui-avatars.com/api/?name=${userProfile.username}&background=3B82F6&color=fff&size=128`
                    }
                    alt={userProfile.username}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                    <PencilIcon className="w-4 h-4" />
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <img
                  src={
                    userProfile.avatar ||
                    `https://ui-avatars.com/api/?name=${userProfile.username}&background=3B82F6&color=fff&size=128`
                  }
                  alt={userProfile.username}
                  className="w-32 h-32 rounded-full object-cover"
                />
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Kullanıcı adı"
                  />
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Hakkında..."
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {userProfile.username}
                  </h1>
                  {userProfile.bio && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {userProfile.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <span>{userPosts.length} Post</span>
                    <span>{userProfile.followers?.length || 0} Takipçi</span>
                    <span>{userProfile.following?.length || 0} Takip</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!isEditing && (
              <div className="flex space-x-2">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Düzenle</span>
                    </button>
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <BellIcon className="w-4 h-4" />
                      <span>Bildirimler</span>
                      {notifications?.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {notifications.unreadCount}
                        </span>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isFollowing
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
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
        </motion.div>

        {/* Notifications Panel */}
        {showNotifications && isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Bildirimler
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notifications?.notifications?.length > 0 ? (
                notifications.notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 rounded-lg ${
                      notification.read
                        ? "bg-gray-50 dark:bg-gray-700"
                        : "bg-blue-50 dark:bg-blue-900"
                    }`}
                  >
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {notification.type === "like" && "Postunuzu beğendi"}
                      {notification.type === "comment" &&
                        "Postunuza yorum yaptı"}
                      {notification.type === "follow" &&
                        "Sizi takip etmeye başladı"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(notification.date).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Henüz bildirim yok
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Postlar ({userPosts.length})
          </h2>

          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {userProfile.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {userProfile.username}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <HeartIcon className="w-4 h-4" />
                    <span>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    <span>{post.comments?.length || 0}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Henüz post yok
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isOwnProfile
                  ? "İlk postunuzu paylaşın!"
                  : "Bu kullanıcı henüz post paylaşmamış."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
