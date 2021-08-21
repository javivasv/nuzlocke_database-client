<template>
  <v-row>
    <div id="nuzlockes">
      <v-card id="nuzlocke-card"></v-card>
    </div>
    <div id="rules">
      <v-card id="rules-card">
        <v-fab-transition>
          <v-img
            id="pokeball"
            dark
            absolute
            top
            fab
            :src="require(`../../../public/img/pokeball.png`)"
          ></v-img>
        </v-fab-transition>
        <v-card-title><v-btn>Create new nuzlocke</v-btn></v-card-title>
        <v-divider></v-divider>
        <v-card-subtitle class="card-text"
          >Nuzlocke Basic Rules</v-card-subtitle
        >
        <v-card-text>
          <ul>
            <li>
              <p class="card-text">
                Any Pokémon that faints is considered dead, and must be released
                or put in the Pokémon Storage System permanently (or may be
                transferred to another game, as long as the Pokémon is never
                able to be used again during this run)
              </p>
            </li>
            <li>
              <p class="card-text">
                The player may only catch the first wild Pokémon encountered in
                each area, and none else. If the first wild Pokémon encountered
                faints or flees, there are no second chances. If the first
                encounter in the area is a double battle, the player is free to
                choose which of the two wild Pokémon they would like to catch
                but may only catch one of them. This restriction does not apply
                to Pokémon able to be captured during static encounters, nor to
                Shiny Pokémon
              </p>
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </div>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

@Component({})
export default class Nuzlockes extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

.row {
  width: 100%;
  height: 100%;
  margin: 0;
}

#nuzlockes {
  width: 65%;
  height: 100%;
  padding: 5% 10px 10px 10px;
}

#nuzlocke-card,
#rules-card {
  width: 100%;
  height: fit-content;
  margin-top: 30px;
  padding: 10px;
}

#rules {
  width: 35%;
  height: 100%;
  padding: 5% 10px 10px 10px;
}

#rules::v-deep .v-card__title {
  justify-content: center;
  margin-top: 60px;
}

.v-btn {
  background-color: $secondaryColor !important;
  color: white !important;
}

#pokeball {
  height: 130px;
  width: 130px;
  position: absolute;
  margin-top: -65px;
  margin-left: auto;
  margin-right: auto;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  border-radius: 50%;
  box-shadow: 0 16px 38px -12px rgb(0 0 0 / 56%),
    0 4px 25px 0px rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(0 0 0 / 20%);
}

.card-text {
  color: #999999;
}
</style>
