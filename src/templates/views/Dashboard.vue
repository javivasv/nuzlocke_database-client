<template>
  <v-app>
    <v-row>
      <div id="sidebar">
        <template>
          <v-card class="mx-auto">
            <v-navigation-drawer
              class="accent-4"
              dark
              permanent
              :style="{ backgroundImage: 'url(' + sidebarBackground + ')' }"
            >
              <v-list-item class="px-2">
                <v-list-item-title>PNDB</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list>
                <v-list-item
                  :class="active(item.link)"
                  v-for="item in sidebarItems()"
                  :key="item.title"
                  link
                  @click="redirect(item.link)"
                >
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-switch
                v-model="darkMode"
                label="Dark mode"
                @change="changeMode($event)"
                color="#ee1515"
              ></v-switch>

              <template v-slot:append>
                <v-list-item
                  v-if="isAuthenticated()"
                  class="item"
                  link
                  @click="logout()"
                >
                  <v-list-item-icon>
                    <v-icon>fa-sign-out-alt</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Log out</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-else class="item" link @click="login()">
                  <v-list-item-icon>
                    <v-icon>fa-sign-in-alt</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Log in</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-navigation-drawer>
          </v-card>
        </template>
      </div>
      <div
        id="content"
        :style="{ backgroundImage: 'url(' + background() + ')' }"
      >
        <router-view></router-view>
      </div>
    </v-row>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Dashboard extends Vue {
  sidebarBackground = require("../../../public/img/ecruteak_city_landscape_opaque.png");
  contentBackground = require("../../../public/img/pokeball_pattern_opaque.png");
  contentBackgroundDark = require("../../../public/img/pokeball_pattern_dark_opaque.png");
  logged = [
    { title: "Home", icon: "fa-home", link: "home" },
    { title: "Nuzlockes", icon: "fa-clipboard-list", link: "nuzlockes" },
    { title: "About", icon: "fa-info", link: "about" }
  ];
  notLogged = [
    { title: "Home", icon: "fa-home", link: "home" },
    { title: "About", icon: "fa-info", link: "about" }
  ];

  darkMode = false;

  mounted() {
    this.$root.$on("logout", () => {
      this.logout();
    });
  }

  active(itemName: string) {
    const routeName = this.$route.name;

    if (itemName === routeName) {
      return "active item";
    }

    if (itemName === "nuzlockes") {
      if (
        routeName === "nuzlocke" ||
        routeName === "new-nuzlocke" ||
        routeName === "add-pokemon"
      ) {
        return "active item";
      }
    }

    return "item";
  }

  redirect(to: string) {
    this.$router.push({ name: to });
  }

  logout() {
    localStorage.setItem("pndb_jwt", "");
    localStorage.setItem("pndb_user_id", "");
    localStorage.setItem("pndb_username", "");
    this.$store.state.user.id = "";
    this.$store.state.user.username = "";

    const routeName = this.$route.name;
    if (
      routeName === "nuzlockes" ||
      routeName === "new-nuzlocke" ||
      routeName === "nuzlocke" ||
      routeName === "add-pokemon"
    ) {
      this.$router.push({ name: "home" });
    }
  }

  login() {
    this.$router.push({ name: "login" });
  }

  isAuthenticated() {
    if (this.$store.state.user.id === "") {
      return false;
    } else {
      return true;
    }
  }

  sidebarItems() {
    if (this.$store.state.user.id === "") {
      return this.notLogged;
    } else {
      return this.logged;
    }
  }

  background() {
    if (this.$store.state.mode === "light") {
      return this.contentBackground;
    } else {
      return this.contentBackgroundDark;
    }
  }

  changeMode(event: any) {
    if (event) {
      this.$store.state.mode = "dark";
      localStorage.setItem("pndb_mode", "dark");
    } else {
      this.$store.state.mode = "light";
      localStorage.setItem("pndb_mode", "light");
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

.row {
  height: 100%;
}

#sidebar {
  width: 20%;
  height: 100%;
}

.v-card {
  width: 100%;
  height: 100%;
  border-radius: 0 4px 4px 0 !important;
}

.v-navigation-drawer {
  width: 100% !important;
  padding: 10%;
  background-size: cover;
}

.v-list-item {
  margin: 10px 0;
  border-radius: 4px;
}

.item:hover,
.active {
  background-color: $primaryColor !important;
}

#content {
  width: 80%;
  height: 100%;
  position: relative;
  background-repeat: repeat;
}
</style>
