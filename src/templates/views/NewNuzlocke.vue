<template>
  <v-row class="content">
    <v-col cols="8" id="new-nuzlocke">
      <v-row class="title-row">
        <v-btn color="white" text class="action-button" @click="back()">
          <v-icon>fa-arrow-left</v-icon>
        </v-btn>
        <h1 class="inner-view-title" :class="titleMode()">NEW NUZLOCKE</h1>
      </v-row>
      <v-row class="content-row">
        <v-card id="new-nuzlocke-card" :dark="darkMode()">
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
          <v-card class="info-card" :dark="darkMode()">
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
              <v-btn
                color="white"
                text
                class="action-button"
                @click="createNuzlocke()"
                >Create new nuzlocke</v-btn
              >
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <ul>
                <li>
                  <p><strong>Title:</strong> The title of the nuzlocke</p>
                </li>
              </ul>
              <ul>
                <li>
                  <p>
                    <strong>Base game:</strong>
                    The name of the game used as the core of the game, in case
                    of being a romhack
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p>
                    <strong>Original game:</strong>
                    In case of being an original game not based in any previous
                    game or region
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p><strong>Game:</strong> The name of the game</p>
                </li>
              </ul>
              <ul>
                <li>
                  <p>
                    <strong>Description:</strong>
                    Relevant information of the nuzlocke, such as extra rules
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
import * as service from "../../services/requests.service";
import * as constants from "../../utils/constants";

@Component({})
export default class NewNuzlocke extends Vue {
  title = "";
  baseGame = "";
  game = "";
  description = "";
  games = constants.games;
  original = false;
  gameError = false;
  baseGameError = false;
  requiredErrorMsg = "This field is required";

  createNuzlocke() {
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

    const userId = this.$store.state.user.id;
    service
      .createNuzlocke(userId, data)
      .then(() => {
        this.$root.$emit("notification", this.title + " nuzlocke created");
        this.$router.push({ name: "nuzlockes" });
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.$root.$emit("logout");
        } else {
          this.$root.$emit("notification", error.response.data.msg);
        }
      });
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

  back() {
    this.$router.push({ name: "nuzlockes" });
  }

  darkMode() {
    return this.$store.state.mode === "dark";
  }

  titleMode() {
    if (this.$store.state.mode === "dark") {
      return "dark-title";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

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
</style>
