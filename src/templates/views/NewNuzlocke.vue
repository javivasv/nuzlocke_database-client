<template>
  <v-row>
    <v-row class="title-row">
      <v-card class="title">NEW NUZLOCKE</v-card>
    </v-row>
    <div id="new-nuzlocke">
      <v-card id="new-nuzlocke-card">
        <v-form v-on:submit.prevent="createNuzlocke()">
          <v-container>
            <v-col>
              <v-row>
                <v-text-field v-model="title" label="Title"></v-text-field>
              </v-row>
              <v-row>
                <v-autocomplete
                  v-model="baseGame"
                  :items="games"
                  label="Base game"
                >
                </v-autocomplete>
              </v-row>
              <v-row>
                <v-text-field v-model="game" label="Game"></v-text-field>
              </v-row>
              <v-row>
                <v-textarea
                  v-model="description"
                  label="Description"
                ></v-textarea>
              </v-row>
            </v-col>
          </v-container>
        </v-form>
      </v-card>
    </div>
    <div id="info">
      <v-card id="info-card">
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
        <v-card-title>
          <v-btn @click="createNuzlocke()">Create new nuzlocke</v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <ul>
            <li>
              <p class="card-text">
                <strong>Title:</strong> The title of the playthrough
              </p>
            </li>
          </ul>
          <ul>
            <li>
              <p class="card-text">
                <strong>Base game:</strong>
                The name of the game used as the core of the game, in case of
                being a romhack
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
                Relevant information of the nuzlocke playthrough, such as extra
                rules
              </p>
            </li>
          </ul>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text
          >In case of not introducing a title and/or a game name, the base game
          will be used</v-card-text
        >
      </v-card>
    </div>
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

  created() {
    this.getGames;
  }

  async getGames() {
    try {
      const res = await axios.get("https://pokeapi.co/api/v2/generation");
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
      title: this.title
    };

    try {
      const userId = this.$store.state.user.id;
      const res = await axios.post(
        `${staticInfo.server}/user/${userId}/nuzlocke`,
        data
      );
      this.$router.push({ name: "nuzlockes" });
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  validateData() {
    if (this.baseGame === "") {
      return false;
    }

    if (this.title === "") {
      this.title = this.baseGame;
    }

    if (this.game === "") {
      this.game = this.baseGame;
    }

    return true;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

.row {
  width: 100%;
  height: 100%;
  margin: 0;
}

#new-nuzlocke {
  width: 65%;
  height: 100%;
  padding: 0 10px 10px 10px;
}

#new-nuzlocke-card,
#info-card {
  width: 100%;
  height: fit-content;
  padding: 10px;
}

#info {
  width: 35%;
  height: 100%;
  padding: 0 10px 10px 10px;
}

#info::v-deep .v-card__title {
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

a {
  text-decoration: none;
}
</style>
