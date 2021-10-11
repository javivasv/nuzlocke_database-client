<template>
  <v-row class="content">
    <v-col cols="8" id="new-nuzlocke">
      <v-row class="title-row"></v-row>
      <v-row class="content-row">
        <v-card id="new-nuzlocke-card">
          <v-form v-on:submit.prevent="createNuzlocke()">
            <v-container>
              <v-col>
                <v-row>
                  <v-text-field v-model="title" label="Title"></v-text-field>
                </v-row>
                <v-row class="input-row">
                  <v-col cols="9" id="base-game-col">
                    <v-autocomplete
                      v-model="baseGame"
                      :items="games"
                      label="Base game"
                      :disabled="original"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="3" id="checkbox-col">
                    <v-checkbox
                      label="Original game"
                      v-model="original"
                      @change="selectOriginal($event)"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-row v-if="baseGameError">
                  <span class="error-msg">{{ requiredErrorMsg }}</span>
                </v-row>
                <v-row class="input-row">
                  <v-text-field v-model="game" label="Game"></v-text-field>
                </v-row>
                <v-row v-if="gameError">
                  <span class="error-msg">{{ requiredErrorMsg }}</span>
                </v-row>
                <v-row class="input-row">
                  <v-textarea
                    v-model="description"
                    label="Description"
                  ></v-textarea>
                </v-row>
              </v-col>
            </v-container>
          </v-form>
        </v-card>
      </v-row>
    </v-col>
    <v-col cols="4" class="info">
      <v-row class="title-row"></v-row>
      <v-row class="content-row">
        <v-col class="side-content-col">
          <v-card class="info-card">
            <v-fab-transition>
              <v-img
                class="pokeball"
                dark
                absolute
                top
                fab
                :src="require(`../../../public/img/pokeball.png`)"
              ></v-img>
            </v-fab-transition>
            <v-card-title>
              <v-btn @click="createNuzlocke()">Create new nuzlocke</v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <ul>
                <li>
                  <p class="card-text">
                    <strong>Title:</strong> The title of the nuzlocke
                    playthrough
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p class="card-text">
                    <strong>Base game:</strong>
                    The name of the game used as the core of the game, in case
                    of being a romhack
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p class="card-text">
                    <strong>Original game:</strong>
                    In case of being an original game not based in any previous
                    game or region
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p class="card-text">
                    <strong>Game:</strong> The name of the game
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p class="card-text">
                    <strong>Description:</strong>
                    Relevant information of the nuzlocke playthrough, such as
                    extra rules
                  </p>
                </li>
              </ul>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text
              >In case of not introducing a title and/or a game name, the base
              game will be used</v-card-text
            >
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import * as staticInfo from "../../utils/staticInfo";
import BackButton from "../components/BackButton.vue";

@Component({
  components: {
    BackButton
  }
})
export default class NewNuzlocke extends Vue {
  title = "";
  baseGame = "";
  game = "";
  description = "";
  games = staticInfo.games;
  original = false;
  gameError = false;
  baseGameError = false;
  requiredErrorMsg = "This field is required";

  created() {
    this.getGames;
  }

  async getGames() {
    try {
      await axios.get("https://pokeapi.co/api/v2/generation");
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  async createNuzlocke() {
    if (!this.validateData()) {
      return;
    }

    const data = {
      baseGame: this.baseGame,
      description: this.description,
      game: this.game,
      original: this.original,
      title: this.title
    };

    try {
      const userId = this.$store.state.user.id;
      await axios.post(`${staticInfo.server}/user/${userId}/nuzlocke`, data);
      this.$router.push({ name: "nuzlockes" });
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  validateData() {
    let valid = true;
    this.baseGameError = this.gameError = false;

    if (this.original) {
      if (this.game === "") {
        this.gameError = true;
        valid = false;
      }

      if (this.title === "") {
        this.title = this.game;
      }
    } else {
      if (this.baseGame === "") {
        this.baseGameError = true;
        valid = false;
      }

      if (this.title === "") {
        this.title = this.baseGame;
      }

      if (this.game === "") {
        this.game = this.baseGame;
      }
    }

    return valid;
  }

  selectOriginal(event: any) {
    if (event) {
      this.baseGame = "";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

.row {
  width: 100%;
  margin: 0;
}

.col {
  height: 100%;
}

#new-nuzlocke {
  padding: 10px;
}

#new-nuzlocke-card {
  width: 100%;
  height: fit-content;
  padding: 10px;
}

.info::v-deep .v-card__title {
  justify-content: center;
  margin-top: 60px;
}

.v-btn {
  background-color: $secondaryColor !important;
  color: white !important;
}

.card-text {
  color: #999999;
}

a {
  text-decoration: none;
}

#base-game-col {
  padding: 0 12px 0 0;
}

#checkbox-col {
  padding: 0 0 0 12px;
}

.v-text-field::v-deep .v-text-field__details {
  display: none;
}

.input-row {
  margin-top: 20px;
}
</style>
