<template>
  <v-row class="content">
    <v-col cols="8" id="nuzlockes">
      <v-row class="title-row"></v-row>
      <v-row class="content-row">
        <v-card id="nuzlockes-card">
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            v-if="gotNuzlockes"
            :headers="headers"
            :items="nuzlockes"
            :search="search"
            :items-per-page="5"
            @click:row="checkNuzlocke($event)"
          >
            <!-- eslint-disable-next-line -->
            <template #item.baseGame="{ item }">
              {{ item.baseGame === "" ? "-" : item.baseGame }}
            </template>

            <!-- eslint-disable-next-line -->
            <template #item.status="{ item }">
              {{ item.status.toUpperCase() }}
            </template>
          </v-data-table>
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
              <router-link :to="{ name: 'new-nuzlocke' }">
                <v-btn>New nuzlocke</v-btn>
              </router-link>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-subtitle class="card-text"
              >Nuzlocke Basic Rules</v-card-subtitle
            >
            <v-card-text>
              <ul>
                <li>
                  <p class="card-text">
                    Any Pokémon that faints is considered dead, and must be
                    released or put in the Pokémon Storage System permanently
                    (or may be transferred to another game, as long as the
                    Pokémon is never able to be used again during this run)
                  </p>
                </li>
                <li>
                  <p class="card-text">
                    The player may only catch the first wild Pokémon encountered
                    in each area, and none else. If the first wild Pokémon
                    encountered faints or flees, there are no second chances. If
                    the first encounter in the area is a double battle, the
                    player is free to choose which of the two wild Pokémon they
                    would like to catch but may only catch one of them. This
                    restriction does not apply to Pokémon able to be captured
                    during static encounters, nor to Shiny Pokémon
                  </p>
                </li>
              </ul>
            </v-card-text>
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

@Component({})
export default class Nuzlockes extends Vue {
  search = "";
  nuzlockes = [] as any;
  headers = [
    { text: "Title", value: "title", align: "center", filterable: true },
    { text: "Game", value: "game", align: "center", filterable: true },
    { text: "Base game", value: "baseGame", align: "center", filterable: true },
    { text: "Status", value: "status", align: "center", filterable: true }
  ];
  gotNuzlockes = false;

  checkNuzlocke(event: any) {
    this.$router.push({ name: "nuzlocke", params: { nuzlocke_id: event._id } });
  }

  created() {
    this.getNuzlockes();
  }

  async getNuzlockes() {
    try {
      const userId = this.$store.state.user.id;
      const res = await axios.get(
        `${staticInfo.server}/user/${userId}/nuzlockes`
      );
      this.nuzlockes = res.data.nuzlockes;
      this.gotNuzlockes = true;
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
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

#nuzlockes {
  padding: 10px;
}

#nuzlockes-card {
  width: 100%;
  height: fit-content;
  padding: 10px;
}

.v-data-table::v-deep tr {
  cursor: pointer;
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
</style>
