<template>
  <v-row class="content">
    <v-col cols="8" id="nuzlockes">
      <v-row class="title-row">
        <h1>NUZLOCKES</h1>
      </v-row>
      <v-row class="content-row">
        <v-card id="nuzlockes-card">
          <v-card-title>
            <v-row id="card-title-row">
              <v-col class="card-title-col" cols="8">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col class="card-title-col" cols="4">
                <v-btn
                  class="delete-button"
                  v-if="!showDeleteButton"
                  @click="showDelete()"
                  >DELETE NUZLOCKE</v-btn
                >
                <v-btn id="cancel-button" v-else @click="cancelDelete()"
                  >CANCEL DELETE</v-btn
                >
              </v-col>
            </v-row>
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

            <!-- eslint-disable-next-line -->
            <template #item.delete="{ item }">
              <v-btn
                class="delete-button"
                v-if="showDeleteButton"
                small
                @click="deleteNuzlocke(item, $event)"
              >
                <v-icon small>fa-trash</v-icon>
              </v-btn>
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
            <v-card-subtitle class="card-text">
              <strong>Related websites</strong>
            </v-card-subtitle>
            <v-card-text>
              <ul>
                <li>
                  <a
                    href="https://bulbapedia.bulbagarden.net/wiki/Main_Page"
                    target="_blank"
                  >
                    Bulbapedia
                  </a>
                </li>
                <li>
                  <a href="https://calc.pokemonshowdown.com/" target="_blank">
                    Pokemon Showdown Damage Calculator
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.serebii.net/index2.shtml"
                    target="_blank"
                  >
                    Serebii
                  </a>
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
    { text: "Title", value: "title", align: "center", sortable: true },
    { text: "Game", value: "game", align: "center", sortable: true },
    { text: "Base game", value: "baseGame", align: "center", sortable: true },
    { text: "Status", value: "status", align: "center", sortable: true }
  ];
  gotNuzlockes = false;
  showDeleteButton = false;

  created() {
    this.getNuzlockes();
  }

  async getNuzlockes() {
    try {
      const userId = this.$store.state.user.id;
      const res = await axios.get(
        `${staticInfo.server}/user/${userId}/nuzlockes`,
        {
          headers: {
            authorization: localStorage.getItem("pndb_jwt")
          }
        }
      );

      this.nuzlockes = res.data.nuzlockes;
      this.gotNuzlockes = true;
    } catch (error) {
      if (error.response.status === 400) {
        this.$root.$emit("logout");
      } else {
        this.$root.$emit("notification", error.response.data.msg);
      }
    }
  }

  async deleteNuzlocke(nuzlocke: any, event: any) {
    event.stopPropagation();

    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = nuzlocke._id;
      await axios.delete(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}`,
        {
          headers: {
            authorization: localStorage.getItem("pndb_jwt")
          }
        }
      );

      let index: any;
      for (const nuzlockeObject of this.nuzlockes) {
        if (nuzlocke._id.toString() === nuzlockeObject._id.toString()) {
          index = this.nuzlockes.indexOf(nuzlockeObject);
          break;
        }
      }

      this.nuzlockes.splice(index, 1);
    } catch (error) {
      if (error.response.status === 400) {
        this.$root.$emit("logout");
      } else {
        this.$root.$emit("notification", error.response.data.msg);
      }
    }
  }

  checkNuzlocke(event: any) {
    this.$router.push({ name: "nuzlocke", params: { nuzlocke_id: event._id } });
  }

  showDelete() {
    this.showDeleteButton = true;
    this.headers.push({
      text: "Delete",
      value: "delete",
      align: "center",
      sortable: false
    });
  }

  cancelDelete() {
    this.showDeleteButton = false;
    this.headers.pop();
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

#card-title-row,
.card-title-col {
  margin: 0;
  padding: 0;
  align-items: center;
}

.delete-button {
  background-color: rgb(241, 60, 60) !important;
}

#cancel-button {
  background-color: #999999 !important;
}
</style>
