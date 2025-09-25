const postReducer = (
  state = {
    posts: [],
    currentPost: null,
    totalPages: 1,
    currentPage: 1,
    total: 0,
  },
  action
) => {
  switch (action.type) {
    case "GET_POSTS":
      return {
        ...state,
        posts: action.payload.posts || action.payload,
        totalPages: action.payload.totalPages || 1,
        currentPage: action.payload.currentPage || 1,
        total: action.payload.total || 0,
      };
    case "GET_POST_BY_ID":
      return { ...state, currentPost: action.payload };
    case "CREATE_POST":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "UPDATE_POST":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
        currentPost:
          state.currentPost?._id === action.payload._id
            ? action.payload
            : state.currentPost,
      };
    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
        currentPost:
          state.currentPost?._id === action.payload ? null : state.currentPost,
      };
    case "LIKE_POST":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload.postId
            ? { ...post, likes: action.payload.likes }
            : post
        ),
        currentPost:
          state.currentPost?._id === action.payload.postId
            ? { ...state.currentPost, likes: action.payload.likes }
            : state.currentPost,
      };
    case "ADD_COMMENT":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload.postId
            ? { ...post, comments: action.payload.comments }
            : post
        ),
        currentPost:
          state.currentPost?._id === action.payload.postId
            ? { ...state.currentPost, comments: action.payload.comments }
            : state.currentPost,
      };
    case "LIKE_COMMENT":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === action.payload.commentId
                    ? { ...comment, likes: action.payload.likes }
                    : comment
                ),
              }
            : post
        ),
        currentPost:
          state.currentPost?._id === action.payload.postId
            ? {
                ...state.currentPost,
                comments: state.currentPost.comments.map((comment) =>
                  comment._id === action.payload.commentId
                    ? { ...comment, likes: action.payload.likes }
                    : comment
                ),
              }
            : state.currentPost,
      };
    default:
      return state;
  }
};

export default postReducer;
