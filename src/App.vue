<template>
  <div id="app">
    <router-view />
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ notificationMsg }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {
  snackbar = false;
  timeout = 5000;
  notificationMsg = "";

  mounted() {
    this.$root.$on("notification", (notificationMsg: string) => {
      this.notificationMsg = notificationMsg;
      this.snackbar = true;
    });
  }
}
</script>

<style lang="scss">
@import "styles/global.scss";

#html {
  overflow: hidden;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.row {
  width: 100% !important;
  margin: 0 !important;
}

.content {
  position: absolute;
}

.title-row {
  height: 10% !important;
  align-items: center;
}

.inner-view-title {
  margin-left: 20px;
}

.content-row {
  height: 90% !important;
}

.side-content-col {
  padding: 0 !important;
}

.info {
  padding: 10px !important;
  overflow-y: auto;
}

.info-card {
  width: 100%;
  padding: 10px;
}

.pokeball {
  height: 130px;
  width: 130px;
  position: absolute !important;
  margin-top: -65px;
  margin-left: auto;
  margin-right: auto;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  border-radius: 50% !important;
  box-shadow: 0 16px 38px -12px rgb(0 0 0 / 56%),
    0 4px 25px 0px rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(0 0 0 / 20%);
}

.error-msg {
  font-size: small;
  color: #ee1515;
}

.v-snack__content {
  justify-content: center !important;
}

.action-button {
  background-color: $secondaryColor !important;
}

.input-row {
  margin-top: 20px !important;
}

.v-card__title {
  justify-content: center;
}

.dark-title {
  color: #424242;
}
</style>
