import { createRouter, createWebHistory } from "vue-router";
import ColumnDetail from "./views/ColumnDetail.vue";
import CreatePostVue from "./views/CreatePost.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Signup from "./views/Signup.vue";
import store from "./store";
import request from "./request";
import uploader from "./views/uploader.vue";
import PostDetail from "./components/PostDetail.vue";
const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { AlreadyLogin: true },
    },
    {
      path: "/column/:id",
      name: "column",
      component: ColumnDetail,
    },
    {
      path: "/create",
      name: "create",
      component: CreatePostVue,
      meta: { requiredLogin: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
      meta: { AlreadyLogin: true },
    },
    {
      path: "/upload",
      name: "upload",
      component: uploader,
      meta: { requiredLogin: true },
    },
    {
      path: "/posts/:id",
      name: "post",
      component: PostDetail,
    },
  ],
});
router.beforeEach((to, from, next) => {
  const { user, token } = store.state;
  const { requiredLogin, AlreadyLogin } = to.meta;
  if (!user.isLogin) {
    if (token) {
      request.defaults.headers.common.Authorization = `Bearer ${token}`;
      store
        .dispatch("fetchCurrentUser")
        .then(() => {
          if (AlreadyLogin) {
            next("/");
          } else {
            next();
          }
        })
        .catch((e) => {
          console.error(e);
          store.commit("logout");
          next("login");
        });
    } else {
      if (requiredLogin) {
        next("login");
      } else {
        next();
      }
    }
  } else {
    if (AlreadyLogin) {
      next("/");
    } else {
      next();
    }
  }
});
export default router;
