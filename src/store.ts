import { Commit, createStore } from "vuex";
import request from "./request";
import { AxiosRequestConfig } from "axios";
export interface ResponseType<P = any> {
  code: number;
  msg: string;
  data: P;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

const asyncAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: "get" }
) => {
  const { data } = await request(url, config);
  commit(mutationName, data);
  return data;
};
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem("token") || "",
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false },
  },
  mutations: {
    createPost(state, newPost) {
      state.posts.push(newPost);
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list;
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data];
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list;
    },
    fetchPost(state, rawData) {
      state.posts = [rawData.data];
    },
    deletePost(state, { data }) {
      state.posts = state.posts.filter((post) => post._id !== data._id);
    },
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data };
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e;
    },
    login(state, rawData) {
      const { token } = rawData.data;
      state.token = token;
      localStorage.setItem("token", token);
      request.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    logout(state) {
      state.token = "";
      localStorage.remove("token");
      delete request.defaults.headers.common.Authorization;
    },
    updataPost(state, { data }) {
      state.posts = state.posts.map((post) => {
        if (post._id === data._id) {
          return data;
        } else {
          return post;
        }
      });
    },
  },
  actions: {
    fetchColumns({ commit }) {
      return asyncAndCommit("/columns", "fetchColumns", commit);
    },
    fetchColumn({ commit }, cid) {
      return asyncAndCommit(`/columns/${cid}`, "fetchColumn", commit);
    },
    fetchPosts({ commit }, cid) {
      return asyncAndCommit(`/columns/${cid}/posts`, "fetchPosts", commit);
    },
    fetchCurrentUser({ commit }) {
      return asyncAndCommit("/user/current", "fetchCurrentUser", commit);
    },
    login({ commit }, payload) {
      return asyncAndCommit("/user/login", "login", commit, {
        method: "post",
        data: payload,
      });
    },
    createPost({ commit }, payload) {
      return asyncAndCommit("/posts", "createPost", commit, {
        method: "post",
        data: payload,
      });
    },
    deletePost({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, "deletePost", commit, {
        method: "delete",
      });
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch("login", loginData).then(() => {
        return dispatch("fetchCurrentUser");
      });
    },
    fetchPost({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, "fetchPost", commit);
    },
    updataPost({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, "updataPost", commit, {
        method: "patch",
        data: payload,
      });
    },
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find((c) => c._id === id);
    },
    getPostsByCId: (state) => (cid: string) => {
      return state.posts.filter((post) => post.column === cid);
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.find((post) => post._id === id);
    },
  },
});

export default store;
