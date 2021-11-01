import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../templates/views/Home.vue";
import About from "../templates/views/About.vue";
import Nuzlockes from "../templates/views/Nuzlockes.vue";
import NewNuzlocke from "../templates/views/NewNuzlocke.vue";
import Pokemon from "../templates/views/Pokemon.vue";
import Nuzlocke from "../templates/views/Nuzlocke.vue";
import Dashboard from "../templates/views/Dashboard.vue";
import Login from "../templates/views/Login.vue";
import Register from "../templates/views/Register.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    beforeEnter: checkAuth,
    name: "login",
    component: Login
  },
  {
    path: "/register",
    beforeEnter: checkAuth,
    name: "register",
    component: Register
  },
  {
    path: "/",
    beforeEnter: checkAuth,
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
        path: "/new-nuzlocke",
        name: "new-nuzlocke",
        component: NewNuzlocke
      },
      {
        path: "/nuzlocke/:nuzlocke_id",
        name: "nuzlocke",
        component: Nuzlocke
      },
      {
        path: "/nuzlocke/:nuzlocke_id/add-pokemon",
        name: "add-pokemon",
        component: Pokemon
      },
      {
        path: "/nuzlocke/:nuzlocke_id/edit-pokemon/:pokemon_id",
        name: "edit-pokemon",
        component: Pokemon
      },
      {
        path: "/about",
        name: "about",
        component: About
      }
    ]
  },
  {
    path: "*",
    redirect: "/home"
  }
];

async function checkAuth(to: any, from: any, next: any) {
  await store.dispatch("CHECK_MODE");
  const isAuthenticated = await store.dispatch("GET_AUTH");

  if (isAuthenticated) {
    if (to.name === "login" || to.name === "register" || to.path === "/") {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    if (
      to.name === "nuzlockes" ||
      to.name === "new-nuzlocke" ||
      to.name === "nuzlocke" ||
      to.name === "add-pokemon" ||
      to.path === "/"
    ) {
      next({ name: "home" });
    } else {
      next();
    }
  }
}

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
