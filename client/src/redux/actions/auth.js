import axios from "axios";
import { toast } from "react-toastify";

export const registerAction = (authData, navigate) => async (dispatch) => {
  try {
    const response = await axios.post("/api/auth/register", authData);
    dispatch({ type: "REGISTER", payload: response.data });
    toast.success("Kayıt başarılı!");
    if (navigate) navigate("/");
  } catch (error) {
    toast.error(error.response?.data?.message || "Kayıt sırasında hata oluştu");
  }
};

export const loginAction = (authData, navigate) => async (dispatch) => {
  try {
    const response = await axios.post("/api/auth/login", authData);
    dispatch({ type: "LOGIN", payload: response.data });
    toast.success("Giriş başarılı!");
    if (navigate) navigate("/");
  } catch (error) {
    toast.error(error.response?.data?.message || "Giriş sırasında hata oluştu");
  }
};

export const logoutAction = (navigate) => async (dispatch) => {
  try {
    dispatch({ type: "LOGOUT" });
    toast.success("Çıkış yapıldı!");
    if (navigate) navigate("/auth");
  } catch (error) {
    toast.error("Çıkış sırasında hata oluştu");
  }
};

export const getUserProfileAction = (userId) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/auth/profile/${userId}`);
    dispatch({ type: "GET_USER_PROFILE", payload: response.data });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Profil getirilirken hata oluştu"
    );
  }
};

export const updateProfileAction =
  (userId, profileData) => async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("username", profileData.username);
      formData.append("bio", profileData.bio);

      if (profileData.avatar) {
        formData.append("avatar", profileData.avatar);
      }

      const response = await axios.put(
        `/api/auth/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch({ type: "UPDATE_PROFILE", payload: response.data });
      toast.success("Profil güncellendi!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Profil güncellenirken hata oluştu"
      );
    }
  };

export const followUserAction = (userId, currentUserId) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/auth/follow/${userId}`, {
      userId: currentUserId,
    });
    dispatch({ type: "FOLLOW_USER", payload: { userId, ...response.data } });
    toast.success(
      response.data.isFollowing ? "Takip edildi!" : "Takipten çıkıldı!"
    );
  } catch (error) {
    toast.error(error.response?.data?.message || "Takip işlemi başarısız");
  }
};

export const getNotificationsAction = (userId) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/auth/notifications/${userId}`);
    dispatch({ type: "GET_NOTIFICATIONS", payload: response.data });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Bildirimler getirilirken hata oluştu"
    );
  }
};

export const markNotificationAsReadAction =
  (userId, notificationId) => async (dispatch) => {
    try {
      await axios.put(`/api/auth/notifications/${userId}`, { notificationId });
      dispatch({ type: "MARK_NOTIFICATION_READ", payload: notificationId });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Bildirim işaretlenirken hata oluştu"
      );
    }
  };

export const getAllUsersAction = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/auth/users");
    dispatch({ type: "GET_ALL_USERS", payload: response.data });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Kullanıcılar getirilirken hata oluştu"
    );
  }
};
