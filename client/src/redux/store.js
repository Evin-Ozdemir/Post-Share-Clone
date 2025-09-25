import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reduces/auth";
import modalReducer from "./reduces/modal";
import postReducer from "./reduces/post";

const initialState = {
  auth: {
    auth: localStorage.getItem("auth")
      ? JSON.parse(localStorage.getItem("auth"))
      : null,
  },
};

const reducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
  post: postReducer,
});

const store = createStore(reducer, initialState, applyMiddleware(thunk));
export default store;
