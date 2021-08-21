<template>
  <v-app>
    <div id="login-view">
      <v-card>
        <v-form v-on:submit.prevent="login()">
          <v-container>
            <v-col>
              <v-row>
                <v-text-field
                  v-model="username"
                  label="Username"
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                ></v-text-field>
              </v-row>

              <v-row id="action-row">
                <v-btn type="submit">Log in</v-btn>
              </v-row>

              <v-row id="register-row">
                <router-link :to="{ name: 'register' }">
                  <strong>Register</strong>
                </router-link>
              </v-row>
            </v-col>
          </v-container>
        </v-form>
      </v-card>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import * as staticInfo from "../../utils/staticInfo";

@Component
export default class Login extends Vue {
  username = "";
  password = "";

  async login() {
    if (!this.validateData()) {
      return;
    }

    const data = {
      username: this.username,
      password: this.password
    };

    try {
      const res = await axios.post(`${staticInfo.server}/login`, data);
      localStorage.setItem("pndb_jwt", res.data.token);
      localStorage.setItem("pndb_user_id", res.data.id);
      localStorage.setItem("pndb_username", this.username);
      this.$store.state.user.id = res.data.id;
      this.$store.state.user.username = this.username;
      this.$router.push({ name: "home" });
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  validateData() {
    if (this.username === "" || this.password === "") {
      return false;
    }

    return true;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

#login-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.v-card {
  width: 30%;
}

.row {
  width: 100%;
  margin: 0;
}

#action-row {
  justify-content: center;
}

.v-btn {
  background-color: $primaryColor !important;
  color: white !important;
}

#register-row {
  justify-content: flex-end;
}

a {
  text-decoration: none;
  color: $primaryColor !important;
}
</style>
