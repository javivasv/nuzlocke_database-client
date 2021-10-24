<template>
  <v-row class="content">
    <v-row id="about">
      <v-col cols="8">
        <v-card>
          <v-card-title>
            <h2>About</h2>
          </v-card-title>
          <v-card-text>
            My name is Javier Vivas and I am a Computer Engineering student
            (almost graduated) at Universidad Simón Bolívar (USB) in Caracas,
            Venezuela. I currently work as a fullstack web developer and work on
            this app in my free time.
          </v-card-text>
          <v-card-text>
            As a nuzlocke player myself (since 2020), I found it very
            uncomfortable to keep track of my nuzlockes. I decided to develop an
            app that satisfy my needs as a player and that can be as inclusive
            as possible in terms of different types of games a player can play.
            That is why it is made with the possibility to register nuzlockes of
            original games and with original pokemon.
          </v-card-text>
          <v-card-text>
            Pokemon names, sprites and regions locations are taken from
            <a href="https://pokeapi.co/docs/v2" target="_blank">PokeAPI</a>, a
            website dedicated to provide data related to Pokemon games. Nuzlocke
            rules and other information are taken from
            <a
              href="https://bulbapedia.bulbagarden.net/wiki/Main_Page"
              target="_blank"
              >Bulbapedia</a
            >.
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            <h2>Suggestions</h2>
          </v-card-title>
          <v-card-text>
            <v-form v-on:submit.prevent="sendSuggestion()">
              <v-container>
                <v-col>
                  <v-textarea
                    label="Suggestions"
                    v-model="suggestions"
                  ></v-textarea>
                  <v-btn type="submit">Send</v-btn>
                </v-col>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="info-card">
          <v-card-subtitle class="card-text">
            <strong>
              Contact
            </strong>
          </v-card-subtitle>
          <v-card-text>
            <v-row class="contact-row">
              <v-btn
                class="twitter-button"
                href="https://twitter.com/Javivasv"
                target="_blank"
                ><v-icon>fab fa-twitter</v-icon> @Javivasv</v-btn
              >
            </v-row>
            <v-row class="contact-row">
              <v-btn class="twitter-button"
                ><v-icon>fab fa-twitter</v-icon> @PNDB</v-btn
              >
            </v-row>
            <v-row class="contact-row">
              <v-btn class="github-button"
                ><v-icon>fab fa-github</v-icon> Javivasv</v-btn
              >
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row id="disclaimer">
      <v-col>
        <v-card>
          <v-card-text>
            Pokémon © 2002-2021 Pokémon. © 1995-2021 Nintendo/Creatures
            Inc./GAME FREAK inc. TM, ® and Pokémon character names are
            trademarks of Nintendo.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class About extends Vue {
  suggestions = "";

  sendSuggestion() {
    console.log("SUGGESTION");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

.row {
  width: 100%;
  margin: 0;
}

.content {
  overflow-y: auto;
}

#about {
  height: 85%;
  overflow-y: auto;
}

.container {
  padding: 0;
}

#disclaimer {
  height: 15%;
}

#disclaimer .col {
  align-self: center;
}

.v-card {
  margin: 10px 0 10px 0;
}

.v-card__title {
  justify-content: center;
}

.card-text {
  color: #999999;
}

a {
  text-decoration: none;
}

.contact-row {
  margin: 20px 0 20px 0;
  justify-content: center;
}

.twitter-button {
  color: white !important;
  background-color: #1da1f2 !important;
}

.github-button {
  color: white !important;
  background-color: #333 !important;
}

.v-icon {
  margin-right: 10px;
}
</style>
