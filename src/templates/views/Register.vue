<template>
  <v-app>
    <div
      id="register-view"
      :style="{ backgroundImage: 'url(' + background + ')' }"
    >
      <v-card>
        <v-form v-on:submit.prevent="register()">
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
              <v-row class="input-row">
                <v-text-field
                  v-model="passwordConfirmation"
                  label="Password confirmation"
                  type="password"
                ></v-text-field>
              </v-row>
              <v-row v-if="passwordConfirmationError">
                <span class="error-msg">{{
                  passwordConfirmationErrorMsg
                }}</span>
              </v-row>
              <v-row id="action-row">
                <v-btn type="submit">Register</v-btn>
              </v-row>
              <v-row id="links-row">
                <router-link :to="{ name: 'home' }">
                  <strong>Home</strong>
                </router-link>
                <router-link :to="{ name: 'login' }">
                  <strong>Log in</strong>
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

@Component({})
export default class Register extends Vue {
  background = require("../../../public/img/isle_of_armor_landscape.png");
  username = "";
  password = "";
  passwordConfirmation = "";
  usernameError = false;
  passwordError = false;
  passwordConfirmationError = false;
  requiredErrorMsg = "This field is required";
  passwordConfirmationErrorMsg = "";

  async register() {
    if (!this.validateData()) {
      return;
    }

    const data = {
      username: this.username,
      password: this.password
    };

    try {
      await axios.post(`${staticInfo.server}/user`, data);
      this.$router.push({ name: "login" });
    } catch (error) {
      this.$root.$emit("notification", error.response.data.msg);
    }
  }

  validateData() {
    let valid = true;
    this.usernameError = this.passwordError = this.passwordConfirmationError = false;

    if (this.username === "") {
      this.usernameError = true;
      valid = false;
    }

    if (this.password === "") {
      this.passwordError = true;
      valid = false;
    }

    if (this.passwordConfirmation === "") {
      this.passwordConfirmationErrorMsg = this.requiredErrorMsg;
      this.passwordConfirmationError = true;
      valid = false;
    }

    if (this.password !== this.passwordConfirmation) {
      this.passwordConfirmationErrorMsg = "The passwords does not match";
      this.passwordConfirmationError = true;
      valid = false;
    }

    return valid;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

#register-view {
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
