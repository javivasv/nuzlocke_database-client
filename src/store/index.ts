import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import * as staticInfo from "../utils/staticInfo";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: "",
      username: ""
    }
  },
  mutations: {},
  actions: {
    async GET_AUTH() {
      if (this.state.user.id === "") {
        if (
          localStorage.getItem("pndb_user_id") === "" ||
          localStorage.getItem("pndb_user_id") === null
        ) {
          return false;
        } else {
          try {
            await axios.get(`${staticInfo.server}/user`, {
              headers: {
                authorization: localStorage.getItem("pndb_jwt")
              }
            });

            this.state.user.id = localStorage.getItem("pndb_user_id") as any;
            this.state.user.username = localStorage.getItem(
              "pndb_username"
            ) as any;
            return true;
          } catch (error) {
            localStorage.setItem("pndb_jwt", "");
            localStorage.setItem("pndb_user_id", "");
            localStorage.setItem("pndb_username", "");
            return false;
          }
        }
      } else {
        return true;
      }
    }
  },
  modules: {}
});
