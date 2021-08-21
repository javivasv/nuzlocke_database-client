import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../templates/views/Home.vue";
import Info from "../templates/views/Info.vue";
import Nuzlockes from "../templates/views/Nuzlockes.vue";
import NewNuzlocke from "../templates/views/NewNuzlocke.vue";
import Dashboard from "../templates/views/Dashboard.vue";
import Login from "../templates/views/Login.vue";
import Register from "../templates/views/Register.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/",
    component: Dashboard,
    children: [
      {
        path: "home",
        name: "home",
        component: Home
      },
      {
        path: "/nuzlockes",
        name: "nuzlockes",
        component: Nuzlockes
      },
      {
        path: "/info",
        name: "info",
        component: Info
      },
      {
        path: "/new-nuzlocke",
        name: "new-nuzlocke",
        component: NewNuzlocke
      }
    ]
  },
  {
    path: "*",
    redirect: "/login"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
