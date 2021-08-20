<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

@Component({})
export default class Dashboard extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";
</style>
