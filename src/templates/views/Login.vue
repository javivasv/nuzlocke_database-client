<template>
  <v-app>
    <div
      id="login-view"
      :style="{ backgroundImage: 'url(' + background + ')' }"
    >
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
              <v-row v-if="usernameError">
                <span class="error-msg">{{ requiredErrorMsg }}</span>
              </v-row>
              <v-row class="input-row">
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                ></v-text-field>
              </v-row>
              <v-row v-if="passwordError">
                <span class="error-msg">{{ requiredErrorMsg }}</span>
              </v-row>
              <v-row id="action-row">
                <v-btn type="submit">Log in</v-btn>
              </v-row>
              <v-row id="links-row">
                <router-link :to="{ name: 'home' }">
                  <strong>Home</strong>
                </router-link>
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
  background = require("../../../public/img/isle_of_armor_landscape.png");
  username = "";
  password = "";
  usernameError = false;
  passwordError = false;
  requiredErrorMsg = "This field is required";

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
      this.$root.$emit("notification", error.response.data.msg);
    }
  }

  validateData() {
    let valid = true;
    this.usernameError = this.passwordError = false;

    if (this.username === "") {
      this.usernameError = true;
      valid = false;
    }

    if (this.password === "") {
      this.passwordError = true;
      valid = false;
    }

    return valid;
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
  background-size: cover;
}

.v-card {
  width: 30%;
}

#action-row {
  margin-top: 20px !important;
  justify-content: center;
}

.v-btn {
  background-color: $primaryColor !important;
  color: white !important;
}

#links-row {
  margin-top: 20px !important;
  justify-content: space-between;
}

a {
  text-decoration: none;
  color: $primaryColor !important;
}

.v-text-field::v-deep .v-text-field__details {
  display: none;
}
</style>
