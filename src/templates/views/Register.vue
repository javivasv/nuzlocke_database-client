<template>
  <v-app>
    <div id="register-view">
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
              <v-row>
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                ></v-text-field>
              </v-row>
              <v-row id="action-row">
                <v-btn type="submit">Register</v-btn>
              </v-row>
              <v-row id="login-row">
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
  username = "";
  password = "";

  async register() {
    if (!this.validateData()) {
      return;
    }

    const data = {
      username: this.username,
      password: this.password
    };

    try {
      const res = await axios.post(`${staticInfo.server}/user`, data);
      this.$router.push({ name: "login" });
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

#register-view {
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

#login-row {
  justify-content: flex-end;
}

a {
  text-decoration: none;
  color: $primaryColor !important;
}
</style>
