<template>
  <v-btn @click="back()">Back</v-btn>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class BackButton extends Vue {
  back() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";
</style>
