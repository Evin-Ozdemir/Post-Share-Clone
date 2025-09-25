const authReducer = (
  state = {
    auth: localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : null,
    userProfile: null,
    notifications: { notifications: [], unreadCount: 0 },
    allUsers: [],
  },
  action
) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("auth", JSON.stringify(action.payload));
      return { ...state, auth: action.payload };
    case "REGISTER":
      localStorage.setItem("auth", JSON.stringify(action.payload));
      return { ...state, auth: action.payload };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        auth: null,
        userProfile: null,
        notifications: { notifications: [], unreadCount: 0 },
        allUsers: [],
      };
    case "GET_USER_PROFILE":
      return { ...state, userProfile: action.payload };
    case "UPDATE_PROFILE":
      return {
        ...state,
        userProfile: action.payload,
        auth: state.auth ? { ...state.auth, user: action.payload } : null,
      };
    case "FOLLOW_USER":
      return {
        ...state,
        userProfile:
          state.userProfile?._id === action.payload.userId
            ? {
                ...state.userProfile,
                followers: action.payload.isFollowing
                  ? [...state.userProfile.followers, state.auth?.user?._id]
                  : state.userProfile.followers.filter(
                      (id) => id !== state.auth?.user?._id
                    ),
              }
            : state.userProfile,
      };
    case "GET_NOTIFICATIONS":
      return {
        ...state,
        notifications: {
          notifications: action.payload.notifications,
          unreadCount: action.payload.unreadCount,
        },
      };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: {
          notifications: state.notifications.notifications.map((notification) =>
            notification._id === action.payload
              ? { ...notification, read: true }
              : notification
          ),
          unreadCount: Math.max(0, state.notifications.unreadCount - 1),
        },
      };
    case "GET_ALL_USERS":
      return { ...state, allUsers: action.payload };
    default:
      return state;
  }
};

export default authReducer;
