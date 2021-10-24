<template>
  <v-app>
    <div id="pdf" :style="{ backgroundImage: 'url(' + background + ')' }">
      <v-col id="container">
        <v-row id="logo" justify="center"></v-row>
        <v-row id="title" justify="center">
          <h1>{{ nuzlocke.title }}</h1>
        </v-row>
        <v-row id="game" justify="center">
          <h1>{{ nuzlocke.game }}</h1>
        </v-row>
        <v-row id="status" justify="center">
          <h1>{{ nuzlocke.status.toUpperCase() }}</h1>
        </v-row>
        <v-row id="pokemon" justify="center">
          <v-col>
            <v-card id="pokemon-card">
              <v-simple-table>
                <thead>
                  <tr>
                    <th
                      v-for="header of headers"
                      :key="header.text"
                      class="text-center"
                    >
                      {{ header.text }}
                    </th>
                  </tr>
                </thead>
                <tr
                  v-for="pokemon of nuzlocke.pokemon"
                  :key="pokemon._id"
                  :class="pokemonRowClass(pokemon.dead, pokemon.obtained)"
                >
                  <td :class="tdClass(pokemon.dead)">
                    <v-avatar size="80" tile>
                      <v-img :src="pokemon.sprite"></v-img>
                    </v-avatar>
                  </td>
                  <td :class="tdClass(pokemon.dead)">{{ pokemon.nickname }}</td>
                  <td :class="tdClass(pokemon.dead)">{{ pokemon.number }}</td>
                  <td :class="tdClass(pokemon.dead)">
                    {{ pokemon.species.toUpperCase() }}
                  </td>
                  <td :class="tdClass(pokemon.dead)">
                    {{ pokemon.location.toUpperCase() }}
                  </td>
                  <td :class="tdClass(pokemon.dead)">
                    <template v-if="pokemon.obtained === 'not'">
                      -
                    </template>
                    <template v-else-if="pokemon.obtained === 'caught'">
                      <span>
                        <v-icon
                          class="iconify"
                          data-icon="mdi:pokeball"
                        ></v-icon>
                      </span>
                    </template>
                    <template v-else>
                      <v-icon>{{ obtainedIcon(pokemon.obtained) }}</v-icon>
                    </template>
                  </td>
                </tr>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import * as staticInfo from "../../utils/staticInfo";

@Component({})
export default class PDF extends Vue {
  @Prop() private nuzlocke!: any;
  background = require("../../../public/img/pokeball_pattern_opaque.png");
  headers = [
    { text: "" },
    { text: "Nickname" },
    { text: "Number" },
    { text: "Species" },
    { text: "Location" },
    { text: "Obtained" }
  ];

  pokemonRowClass(status: Boolean, obtained: string) {
    if (obtained !== "not") {
      if (status) {
        return "dead";
      }
    } else if (obtained === "not") {
      return "not";
    }
  }

  tdClass(dead: Boolean) {
    if (dead) {
      return "opacity-dead";
    }
  }

  obtainedIcon(obtainedType: string) {
    if (obtainedType === "gifted") {
      return "fa-gift";
    } else if (obtainedType === "hatched") {
      return "fa-egg";
    } else if (obtainedType === "traded") {
      return "fa-exchange-alt";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

#pdf {
  height: 100%;
  width: 100%;
  position: relative;
  background-repeat: repeat;
  padding: 30px;
}

#container {
  padding: 0 10% 0 10%;
}

.col {
  height: 100%;
}

#pokemon-card {
  padding: 10px;
}

tr {
  background-color: #fff !important;
}

.dead {
  background-color: rgb(241, 60, 60, 0.6) !important;
}

.opacity-dead {
  opacity: 0.6;
}

.not {
  background-color: #d3d3d3 !important;
}
</style>
