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
              :style="{ backgroundImage: 'url(' + background + ')' }"
            >
              <v-list-item class="px-2">
                <v-list-item-title>PNDB</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list>
                <v-list-item v-for="item in items" :key="item.title" link>
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <template v-slot:append>
                <v-list-item link>
                  <v-list-item-icon>
                    <v-icon>fa-sign-out-alt</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Log out</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-navigation-drawer>
          </v-card>
        </template>
      </div>
      <div id="content">
        <router-view></router-view>
      </div>
    </v-row>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

@Component({})
export default class Dashboard extends Vue {
  background = require("../../../public/img/ecruteak_city_landscape_opaque.png");

  items = [
    { title: "Home", icon: "fa-home" },
    { title: "Nuzlockes", icon: "fa-clipboard-list" }
  ];
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

.row {
  width: 100%;
  height: 100%;
  margin: 0;
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

#content {
  width: 80%;
  height: 100%;
}
</style>
