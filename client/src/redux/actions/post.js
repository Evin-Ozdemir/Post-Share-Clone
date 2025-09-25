import axios from "axios";
import { toast } from "react-toastify";

export const getPostsAction =
  (page = 1, category = "all", search = "") =>
  async (dispatch) => {
    try {
      const response = await axios.get(
        `/api/post/getPosts?page=${page}&category=${category}&search=${search}`
      );
      dispatch({ type: "GET_POSTS", payload: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Postlar getirilirken hata oluştu"
      );
    }
  };

export const getPostByIdAction = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/post/${id}`);
    dispatch({ type: "GET_POST_BY_ID", payload: response.data });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Post getirilirken hata oluştu"
    );
  }
};

export const createPostAction = (postData) => async (dispatch) => {
  try {
    const response = await axios.post("/api/post/createPost", postData);
    dispatch({ type: "CREATE_POST", payload: response.data });
    
    // Post oluşturulduktan sonra post listesini yeniden yükle
    dispatch(getPostsAction(1, "all", ""));
    
    toast.success("Post başarıyla oluşturuldu!");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Post oluşturulurken hata oluştu"
    );
  }
};

export const likePostAction = (postId, userId) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/post/${postId}/like`, { userId });
    dispatch({ type: "LIKE_POST", payload: { postId, ...response.data } });
  } catch (error) {
    toast.error(error.response?.data?.message || "Beğeni işlemi başarısız");
  }
};

export const addCommentAction = (postId, commentData) => async (dispatch) => {
  try {
    const response = await axios.post(
      `/api/post/${postId}/comment`,
      commentData
    );
    dispatch({
      type: "ADD_COMMENT",
      payload: { postId, comments: response.data },
    });
    toast.success("Yorum eklendi!");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Yorum eklenirken hata oluştu"
    );
  }
};

export const likeCommentAction =
  (postId, commentId, userId) => async (dispatch) => {
    try {
      const response = await axios.post(
        `/api/post/${postId}/comment/${commentId}/like`,
        { userId }
      );
      dispatch({
        type: "LIKE_COMMENT",
        payload: { postId, commentId, ...response.data },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Yorum beğenisi başarısız");
    }
  };

export const updatePostAction = (id, postData) => async (dispatch) => {
  try {
    const response = await axios.patch(`/api/post/updatePost/${id}`, postData);
    dispatch({ type: "UPDATE_POST", payload: response.data });
    toast.success("Post güncellendi!");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Post güncellenirken hata oluştu"
    );
  }
};

export const deletePostAction = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/post/deletePost/${id}`);
    dispatch({ type: "DELETE_POST", payload: id });
    toast.success("Post silindi!");
  } catch (error) {
    toast.error(error.response?.data?.message || "Post silinirken hata oluştu");
  }
};
