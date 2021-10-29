import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import SETTINGS from "../settings";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: "",
      username: ""
    },
    mode: "light"
  },
  mutations: {},
  actions: {
    async GET_AUTH() {
      if (this.state.user.id === "") {
        if (getId()) {
          return false;
        } else {
          try {
            await axios.get(`${SETTINGS.API_BASE_PATH_DEV}/user`, {
              headers: {
                authorization: localStorage.getItem("pndb_jwt")
              }
            });

            setState();
            return true;
          } catch (error) {
            emptyStorage();
            return false;
          }
        }
      }

      return true;
    },
    CHECK_MODE() {
      if (getMode()) {
        localStorage.setItem("pndb_mode", "light");
        this.state.mode = "light";
      } else {
        this.state.mode = localStorage.getItem("pndb_mode");
      }
    }
  },
  modules: {}
});

function getId() {
  return (
    localStorage.getItem("pndb_user_id") === "" ||
    localStorage.getItem("pndb_user_id") === null
  );
}

function getMode() {
  return (
    localStorage.getItem("pndb_mode") === "" ||
    localStorage.getItem("pndb_mode") === null
  );
}

function setState() {
  this.state.user.id = localStorage.getItem("pndb_user_id") as any;
  this.state.user.username = localStorage.getItem("pndb_username") as any;
}

function emptyStorage() {
  localStorage.setItem("pndb_jwt", "");
  localStorage.setItem("pndb_user_id", "");
  localStorage.setItem("pndb_username", "");
}
