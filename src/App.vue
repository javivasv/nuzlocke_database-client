<template>
  <div id="app">
    <router-view />
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ errorMsg }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {
  snackbar = false;
  timeout = 3000;
  errorMsg = "";

  mounted() {
    this.$root.$on("error", (errorMsg: string) => {
      this.errorMsg = errorMsg;
      this.snackbar = true;
    });
  }
}
</script>

<style lang="scss">
@import "styles/global.scss";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.content-row {
  position: absolute;
}

.title-row {
  height: 10% !important;
  padding-left: 10px;
  align-items: center;
}

.title {
  height: fit-content;
  padding: 10px 50px 10px 50px;
  background-color: $secondaryColor !important;
  color: white !important;
}
</style>
