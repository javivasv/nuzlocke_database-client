import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../templates/views/Home.vue";
import Info from "../templates/views/Info.vue";
import Nuzlockes from "../templates/views/Nuzlockes.vue";
import NewNuzlocke from "../templates/views/NewNuzlocke.vue";
import AddPokemon from "../templates/views/AddPokemon.vue";
import Nuzlocke from "../templates/views/Nuzlocke.vue";
import Dashboard from "../templates/views/Dashboard.vue";
import Login from "../templates/views/Login.vue";
import Register from "../templates/views/Register.vue";
import axios from "axios";
import * as staticInfo from "../utils/staticInfo";

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
        component: AddPokemon
      },
      {
        path: "/info",
        name: "info",
        component: Info
      }
    ]
  },
  {
    path: "*",
    redirect: "/login"
  }
];

async function checkAuth(to: any, from: any, next: any) {
  const isAuthenticated = await verify();

  if (isAuthenticated && (to.name === "login" || to.name === "register")) {
    next({ name: "home" });
  } else if (isAuthenticated && to.name !== "login" && to.name !== "register") {
    next();
  } else if (
    !isAuthenticated &&
    (to.name === "login" || to.name === "register")
  ) {
    next();
  } else if (
    !isAuthenticated &&
    to.name !== "login" &&
    to.name !== "register"
  ) {
    next({ name: "login" });
  }
}

async function verify() {
  try {
    await axios.get(`${staticInfo.server}/user`, {
      headers: {
        authorization: localStorage.getItem("pndb_jwt")
      }
    });

    return true;
  } catch (error) {
    return false;
  }
}

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
