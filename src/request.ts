import axios from "axios";
import store from "./store";
const request = axios.create({
  baseURL: "http://apis.imooc.com/api/",
});

request.interceptors.request.use((config) => {
  store.commit("setLoading", true);
  store.commit("setError", { status: false, message: "" });
  config.params = { ...config.params, icode: "9189539A0CC4BC0E" };

  if (config.data instanceof FormData) {
    config.data.append("icode", "9189539A0CC4BC0E");
  } else {
    config.data = { ...config.data, icode: "9189539A0CC4BC0E" };
  }
  return config;
});
request.interceptors.response.use(
  (config) => {
    store.commit("setLoading", false);

    return config;
  },
  (e) => {
    const { error } = e.response.data;
    store.commit("setError", { status: true, message: error });
    store.commit("setLoading", false);
    throw new Error(e);
  }
);

export default request;
