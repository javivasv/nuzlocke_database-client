<template>
  <v-app :style="{ backgroundImage: 'url(' + background() + ')' }">
    <div id="pdf">
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
            <div v-for="(chunk, index) of chunks" :key="index">
              <v-card
                id="pokemon-card"
                :class="cardClass(index)"
                :dark="darkMode()"
              >
                <v-simple-table class="table">
                  <thead>
                    <tr :class="headerMode()">
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
                    v-for="pokemon of chunk"
                    :key="pokemon._id"
                    :class="pokemonRowClass(pokemon.dead, pokemon.obtained)"
                  >
                    <td :class="tdClass(pokemon.dead)">
                      <template v-if="pokemon.sprite === ''">
                        -
                      </template>
                      <template v-else>
                        <v-avatar size="80" tile>
                          <v-img eager :src="pokemon.sprite"></v-img>
                        </v-avatar>
                      </template>
                    </td>
                    <td :class="tdClass(pokemon.dead)">
                      {{ pokemon.nickname === "" ? "-" : pokemon.nickname }}
                    </td>
                    <td :class="tdClass(pokemon.dead)">{{ pokemon.number }}</td>
                    <td :class="tdClass(pokemon.dead)">
                      {{ pokemon.species.toUpperCase() }}
                    </td>
                    <td :class="tdClass(pokemon.dead)">
                      {{
                        pokemon.obtained === "not"
                          ? "-"
                          : pokemon.obtainedAs.toUpperCase()
                      }}
                    </td>
                    <td :class="tdClass(pokemon.dead)">
                      <v-row
                        class="type-row"
                        v-for="type of pokemon.types"
                        :key="type"
                        justify="center"
                      >
                        <v-card :class="`type ${type}`">{{
                          type.toUpperCase()
                        }}</v-card>
                      </v-row>
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
                          <svg
                            v-if="iconMode()"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            aria-hidden="true"
                            role="img"
                            width="24px"
                            height="24px"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2c-4.08 0-7.45 3.05-7.94 7h4.07c.44-1.73 2.01-3 3.87-3c1.86 0 3.43 1.27 3.87 3h4.07c-.49-3.95-3.86-7-7.94-7m0 16c4.08 0 7.45-3.05 7.94-7h-4.07c-.44 1.73-2.01 3-3.87 3c-1.86 0-3.43-1.27-3.87-3H4.06c.49 3.95 3.86 7 7.94 7m0-10a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2z"
                              fill="white"
                            />
                          </svg>
                          <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            aria-hidden="true"
                            role="img"
                            width="24px"
                            height="24px"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2c-4.08 0-7.45 3.05-7.94 7h4.07c.44-1.73 2.01-3 3.87-3c1.86 0 3.43 1.27 3.87 3h4.07c-.49-3.95-3.86-7-7.94-7m0 16c4.08 0 7.45-3.05 7.94-7h-4.07c-.44 1.73-2.01 3-3.87 3c-1.86 0-3.43-1.27-3.87-3H4.06c.49 3.95 3.86 7 7.94 7m0-10a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2z"
                              fill="rgba(0,0,0,.54)"
                            />
                          </svg>
                        </span>
                      </template>
                      <template v-else>
                        <v-icon>{{ obtainedIcon(pokemon.obtained) }}</v-icon>
                      </template>
                    </td>
                  </tr>
                </v-simple-table>
              </v-card>
              <div class="html2pdf__page-break" />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class PDF extends Vue {
  @Prop() private nuzlocke!: any;
  contentBackground = require("../../../public/img/pokeball_pattern_opaque.png");
  contentBackgroundDark = require("../../../public/img/pokeball_pattern_dark_opaque.png");
  headers = [
    { text: "" },
    { text: "Nickname" },
    { text: "Number" },
    { text: "Species" },
    { text: "Obtained as" },
    { text: "Types" },
    { text: "Location" },
    { text: "Obtained" }
  ];

  chunks = [] as any;

  mounted() {
    this.chunks = this.sliceIntoChunks(this.nuzlocke.pokemon);
  }

  sliceIntoChunks(pokemon: any) {
    const chunks = [];
    for (let i = 0; i < pokemon.length; i += 10) {
      const chunk = pokemon.slice(i, i + 10);
      chunks.push(chunk);
    }
    return chunks;
  }

  pokemonRowClass(status: Boolean, obtained: string) {
    if (this.$store.state.mode === "dark") {
      if (obtained !== "not") {
        if (status) {
          return "dead";
        } else {
          return "dark-row";
        }
      } else if (obtained === "not") {
        return "not";
      }
    } else {
      if (obtained !== "not") {
        if (status) {
          return "dead";
        }
      } else if (obtained === "not") {
        return "not";
      }
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

  cardClass(index: any) {
    if (index === 0) {
      return "first-card";
    } else {
      return "not-first-card";
    }
  }

  background() {
    if (this.$store.state.mode === "light") {
      return this.contentBackground;
    } else {
      return this.contentBackgroundDark;
    }
  }

  darkMode() {
    return this.$store.state.mode === "dark";
  }

  headerMode() {
    if (this.$store.state.mode === "dark") {
      return "dark-row";
    }
  }

  iconMode() {
    if (this.$store.state.mode === "dark") {
      return true;
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
}

#container {
  padding: 0 3% 0 3%;
}

.col {
  height: 100%;
}

#logo {
  margin-top: 30px !important;
}

#pokemon-card {
  padding: 10px;
}

div {
  padding: 0;
}

tr {
  background-color: #fff !important;
}

.first-card {
  margin-top: 50px;
}

.not-first-card {
  margin-top: 120px;
}

.dead {
  background-color: rgb(241, 60, 60, 0.6) !important;
}

.opacity-dead {
  opacity: 0.6;
}

.not {
  background-color: #c3c3c3 !important;
}

.dark-row {
  background-color: #424242 !important;
}

.v-data-table::v-deep th,
td {
  padding: 0 !important;
}

td {
  font-size: 0.75rem !important;
}

.type-row {
  margin: 5px 0 !important;
}
</style>
