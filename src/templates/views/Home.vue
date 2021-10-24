<template>
  <v-row class="content">
    <v-col cols="8" id="home-info">
      <v-card id="welcome-card">
        <v-card-title>
          <h2>Welcome to the Pokemon Nuzlocke DataBase!</h2>
        </v-card-title>
        <v-card-text class="card-text">
          Here you can keep track of all of your pokemon nuzlockes. You will be
          able to register a nuzlocke of a preexisting game, a romhack or a
          completely original game. You will also be able to register every
          pokemon you obtain (or not) during the run, as well as change its
          status (alive or dead), in order to keep it organized and updated.
        </v-card-text>
        <v-card-subtitle class="card-text">
          <strong>What is a Nuzlocke?</strong>
        </v-card-subtitle>
        <v-card-text class="card-text">
          A Nuzlocke is a set of rules intended to create a higher level of
          difficulty while playing the Pokémon games. Many challengers feel that
          the rules also serve the purpose of encouraging the use of Pokémon the
          player would not normally choose, and promoting closer bonds with the
          player's Pokémon. The rules are not an in-game function, but are
          self-imposed on the part of the player, and thus subject to variation.
        </v-card-text>
        <v-card-text>
          <router-link
            v-if="this.$store.state.user.id === ''"
            :to="{ name: 'login' }"
          >
            <v-btn class="action-button">LOGIN TO GET STARTED </v-btn>
          </router-link>
          <router-link v-else :to="{ name: 'new-nuzlocke' }">
            <v-btn class="action-button">CREATE NEW NUZLOCKE</v-btn>
          </router-link>
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
                  :src="thumbnailPath(video.id)"
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
        <v-card-subtitle class="card-text">
          <strong>
            Nuzlocke Basic Rules
          </strong>
        </v-card-subtitle>
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
        <v-card-subtitle class="card-text">
          <strong>Commonly accepted extra rules</strong>
        </v-card-subtitle>
        <v-card-text>
          <ul>
            <li>
              <p class="card-text">
                The two basic rules are not in effect until the player has
                gained their first Poké Balls and thus the ability to catch
                Pokémon
              </p>
            </li>
            <li>
              <p class="card-text">
                The player must nickname all of their Pokémon, for the sake of
                forming stronger emotional bonds
              </p>
            </li>
            <li>
              <p class="card-text">
                Species/Dupes Clause: The "first wild Pokémon in each area" rule
                does not apply in an area until a species or evolution line is
                encountered that has not been caught yet
              </p>
            </li>
            <li>
              <p class="card-text">
                Shiny Clause: Shiny Pokémon do not need to be released if they
                faint
              </p>
            </li>
            <li>
              <p class="card-text">
                If the player has no Pokémon that can use a field move that is
                required to continue the game, they may catch another Pokémon
                that can learn the required field move. However, this Pokémon
                cannot be used in battle for any reason, and must be released,
                permanently put into a PC box, or migrated as soon as it is no
                longer needed or if the player catches another Pokémon that can
                use this field move
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

  thumbnailPath(videoId: string) {
    return require("../../../public/video-thumbnails/" + videoId + ".png");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

.content {
  overflow-y: auto;
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

#home-info,
#rules {
  height: fit-content;
}

#videos-card,
#secondary-rules {
  margin-top: 20px;
}

#previews-row {
  margin-top: 20px;
}

.preview {
  width: 200px;
  padding: 0;
  margin: 10px;
  cursor: pointer;
}

a {
  text-decoration: none;
}
</style>
