<template>
  <v-row class="content-row">
    <div id="nuzlockes">
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
          @click:row="checkNuzlocke($event)"
        >
          <!-- eslint-disable-next-line -->
          <template #item.status="{ item }">
            {{ item.status.toUpperCase() }}
          </template>
        </v-data-table>
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
  height: 100%;
  margin: 0;
}

#nuzlockes {
  width: 65%;
  height: 100%;
  padding: 5% 10px 10px 10px;
}

#nuzlockes-card,
#info-card {
  width: 100%;
  height: fit-content;
  margin-top: 30px;
  padding: 10px;
}

.v-data-table::v-deep tr {
  cursor: pointer;
}

#info {
  width: 35%;
  height: 100%;
  padding: 5% 10px 10px 10px;
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
