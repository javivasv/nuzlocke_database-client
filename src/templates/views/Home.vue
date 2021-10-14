<template>
  <v-row class="content">
    <v-col cols="8" id="home-info">
      <v-card id="welcome-card">
        <v-card-title>
          <h2>Welcome to the Pokemon Nuzlocke DataBase!</h2>
        </v-card-title>
        <v-card-text>
          Here you can keep track of all of your pokemon nuzlocke playthroughs
        </v-card-text>
      </v-card>
      <v-card id="videos-card">
        <v-row justify="center">
          <youtube
            :video-id="videoId"
            player-height="280"
            player-width="500"
          ></youtube>
        </v-row>
        <v-row id="previews-row">
          <v-slide-group show-arrows center-active>
            <v-slide-item
              v-for="video in videos"
              :key="video.id"
              v-slot:default="{ toggle }"
              @change="selectVideo(video.id)"
            >
              <v-card class="preview" @click="toggle">
                <v-img
                  max-height="120"
                  max-width="200"
                  :src="video.thumbnail"
                ></v-img>
                <v-card-subtitle>
                  <strong>{{ video.title }}</strong>
                </v-card-subtitle>
                <v-card-text>
                  {{ video.channel }}
                </v-card-text>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="4" id="rules">
      <v-card class="info-card">
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
      <v-card class="info-card" id="secondary-rules">
        <v-card-subtitle class="card-text"
          >Other commonly used rules</v-card-subtitle
        >
        <v-card-text>
          <ul>
            <li>
              <p class="card-text">
                The player must nickname all of their Pokémon, for the sake of
                forming stronger emotional bonds
              </p>
            </li>
            <li>
              <p class="card-text">
                The "first wild Pokémon in each area" rule does not apply in an
                area until a species or evolution line is encountered that has
                not been caught yet
              </p>
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as staticInfo from "../../utils/staticInfo";
import VueYouTubeEmbed from "vue-youtube-embed";
Vue.use(VueYouTubeEmbed);

@Component({})
export default class Home extends Vue {
  videos = staticInfo.videos.sort(() => Math.random() - 0.5);
  videoId = this.videos[0].id;

  selectVideo(videoId: string) {
    this.videoId = videoId;
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

#videos-card {
  padding: 10px;
}

.v-card {
  width: 100%;
}

.v-card__title {
  justify-content: center;
}

#home-info,
#rules {
  overflow-y: auto;
}

#videos-card,
#secondary-rules {
  margin-top: 20px;
}

.card-text {
  color: #999999;
}

#previews-row {
  margin-top: 20px;
}

.preview {
  width: 200px;
  padding: 0;
  margin: 0 10px 0 10px;
  cursor: pointer;
}
</style>
