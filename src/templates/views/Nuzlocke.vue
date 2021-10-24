<template>
  <v-row class="content" v-if="gotNuzlocke">
    <v-col cols="8" id="nuzlocke">
      <v-row class="title-row">
        <v-btn class="action-button" @click="back()">
          <v-icon>fa-arrow-left</v-icon>
        </v-btn>
        <h1 class="inner-view-title">
          NUZLOCKE - {{ nuzlocke.title.toUpperCase() }}
        </h1>
      </v-row>
      <v-row class="content-row">
        <v-card id="nuzlocke-card">
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
                  >DELETE POKEMON</v-btn
                >
                <v-btn id="cancel-button" v-else @click="cancelDelete()"
                  >CANCEL DELETE</v-btn
                >
              </v-col>
            </v-row>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="pokemon"
            :search="search"
            :items-per-page="5"
          >
            <template #item="{ item }">
              <tr :class="pokemonRowClass(item.dead, item.obtained)">
                <td :class="tdClass(item.dead)">
                  <v-avatar size="80" tile>
                    <v-img :src="item.sprite"></v-img>
                  </v-avatar>
                </td>
                <td :class="tdClass(item.dead)">{{ item.nickname }}</td>
                <td :class="tdClass(item.dead)">{{ item.number }}</td>
                <td :class="tdClass(item.dead)">
                  {{ item.species.toUpperCase() }}
                </td>
                <td :class="tdClass(item.dead)">
                  {{ item.location.toUpperCase() }}
                </td>
                <td :class="tdClass(item.dead)">
                  <template v-if="item.obtained === 'not'">
                    -
                  </template>
                  <template v-else-if="item.obtained === 'caught'">
                    <span>
                      <v-icon class="iconify" data-icon="mdi:pokeball"></v-icon>
                    </span>
                  </template>
                  <template v-else>
                    <v-icon>{{ obtainedIcon(item.obtained) }}</v-icon>
                  </template>
                </td>
                <td>
                  <v-btn
                    :class="statusButtonClass(item.dead)"
                    v-if="item.obtained !== 'not' && !showDeleteButton"
                    @click="changePokemonStatus(item)"
                    small
                  >
                    <v-icon v-if="item.dead" small>fa-skull</v-icon>
                    <v-icon v-else small>fa-heart</v-icon>
                  </v-btn>
                  <v-btn
                    class="delete-button"
                    v-if="showDeleteButton"
                    small
                    @click="deletePokemon(item)"
                  >
                    <v-icon small>fa-trash</v-icon>
                  </v-btn>
                </td>
              </tr>
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
              <router-link
                :to="{
                  name: 'add-pokemon',
                  params: { nuzlocke: nuzlocke }
                }"
              >
                <v-btn class="action-button">Add pokemon</v-btn>
              </router-link>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-subtitle class="card-text"
              ><strong>Game status: </strong>{{ nuzlocke.status.toUpperCase() }}
            </v-card-subtitle>
            <v-row id="nuzlocke-status">
              <v-btn
                class="action-button"
                v-if="nuzlocke.status !== 'started'"
                @click="changeNuzlockeStatus('started')"
                >Started</v-btn
              >
              <v-btn
                v-if="nuzlocke.status !== 'completed'"
                id="completed-button"
                @click="changeNuzlockeStatus('completed')"
                >Completed</v-btn
              >
              <v-btn
                v-if="nuzlocke.status !== 'lost'"
                id="lost-button"
                @click="changeNuzlockeStatus('lost')"
                >Lost</v-btn
              >
            </v-row>
            <v-divider v-if="nuzlocke.description !== ''"></v-divider>
            <v-card-text class="card-text">{{
              nuzlocke.description
            }}</v-card-text>
          </v-card>
          <v-card id="filters-card">
            <v-card-subtitle class="card-text">
              <strong>Status filters</strong>
            </v-card-subtitle>
            <v-row>
              <v-col class="filter-col">
                <v-row>
                  <v-checkbox
                    class="filter-checkbox"
                    label="Alive"
                    v-model="aliveCheckbox"
                    @change="filterByStatus($event, 'alive')"
                  ></v-checkbox>
                </v-row>
              </v-col>
              <v-col class="filter-col">
                <v-row>
                  <v-checkbox
                    class="filter-checkbox"
                    label="Dead"
                    v-model="deadCheckbox"
                    @change="filterByStatus($event, 'dead')"
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-card-subtitle class="card-text">
              <strong>Obtained filters</strong>
            </v-card-subtitle>
            <v-row>
              <v-col class="filter-col">
                <v-row>
                  <v-checkbox
                    class="filter-checkbox"
                    label="Caught"
                    v-model="caughtCheckbox"
                    @change="filterByObtained($event, 'caught')"
                  ></v-checkbox>
                </v-row>
              </v-col>
              <v-col class="filter-col">
                <v-row>
                  <v-checkbox
                    class="filter-checkbox"
                    label="Gifted"
                    v-model="giftedCheckbox"
                    @change="filterByObtained($event, 'gifted')"
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="filter-col">
                <v-row>
                  <v-checkbox
                    class="filter-checkbox"
                    label="Hatched"
                    v-model="hatchedCheckbox"
                    @change="filterByObtained($event, 'hatched')"
                  ></v-checkbox>
                </v-row>
              </v-col>
              <v-col class="filter-col">
                <v-row>
                  <v-checkbox
                    class="filter-checkbox"
                    label="Traded"
                    v-model="tradedCheckbox"
                    @change="filterByObtained($event, 'traded')"
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="filter-col">
                <v-row>
                  <v-checkbox
                    class="filter-checkbox"
                    label="Not caught"
                    v-model="notCheckbox"
                    @change="filterByObtained($event, 'not')"
                  ></v-checkbox>
                </v-row>
              </v-col>
              <v-col></v-col>
            </v-row>
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
export default class Nuzlocke extends Vue {
  search = "";
  headers = [
    { text: "", value: "sprite", align: "center", sortable: false },
    { text: "Nickname", value: "nickname", align: "center", sortable: true },
    { text: "Number", value: "number", align: "center", sortable: true },
    { text: "Species", value: "species", align: "center", sortable: true },
    { text: "Location", value: "location", align: "center", sortable: true },
    { text: "Obtained", value: "obtained", align: "center", sortable: false },
    {
      text: "Status",
      value: "status",
      align: "center",
      sortable: false
    }
  ];
  gotNuzlocke = false;
  nuzlocke: any;
  pokemon = [] as any;
  aliveCheckbox = false;
  deadCheckbox = false;
  caughtCheckbox = false;
  giftedCheckbox = false;
  hatchedCheckbox = false;
  tradedCheckbox = false;
  notCheckbox = false;
  showDeleteButton = false;
  statusFilter = "";
  obtainedFilter = "";

  created() {
    this.getNuzlocke();
  }

  async getNuzlocke() {
    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = this.$route.params.nuzlocke_id;
      const res = await axios.get(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}`,
        {
          headers: {
            authorization: localStorage.getItem("pndb_jwt")
          }
        }
      );
      this.nuzlocke = res.data.nuzlocke;
      this.pokemon = res.data.nuzlocke.pokemon;
      this.gotNuzlocke = true;
    } catch (error) {
      if (error.response.status === 400) {
        this.$root.$emit("logout");
      } else {
        this.$root.$emit("notification", error.response.data.msg);
      }
    }
  }

  async changeNuzlockeStatus(status: String) {
    const data = {
      nuzlocke: this.nuzlocke
    };

    data.nuzlocke.status = status;
    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = this.$route.params.nuzlocke_id;
      await axios.put(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}`,
        data,
        {
          headers: {
            authorization: localStorage.getItem("pndb_jwt")
          }
        }
      );

      this.nuzlocke.status = status;
      this.$forceUpdate();
    } catch (error) {
      if (error.response.status === 400) {
        this.$root.$emit("logout");
      } else {
        this.$root.$emit("notification", error.response.data.msg);
      }
    }
  }

  async changePokemonStatus(pokemon: any) {
    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = this.$route.params.nuzlocke_id;
      await axios.put(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}/pokemon/${pokemon._id}`,
        null,
        {
          headers: {
            authorization: localStorage.getItem("pndb_jwt")
          }
        }
      );

      pokemon.dead = !pokemon.dead;
    } catch (error) {
      if (error.response.status === 400) {
        this.$root.$emit("logout");
      } else {
        this.$root.$emit("notification", error.response.data.msg);
      }
    }
  }

  async deletePokemon(pokemon: any) {
    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = this.$route.params.nuzlocke_id;
      await axios.delete(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}/pokemon/${pokemon._id}`,
        {
          headers: {
            authorization: localStorage.getItem("pndb_jwt")
          }
        }
      );

      let index: any;
      for (const pokemonObject of this.nuzlocke.pokemon) {
        if (pokemon._id.toString() === pokemonObject._id.toString()) {
          index = this.nuzlocke.pokemon.indexOf(pokemonObject);
          break;
        }
      }

      this.nuzlocke.pokemon.splice(index, 1);
    } catch (error) {
      if (error.response.status === 400) {
        this.$root.$emit("logout");
      } else {
        this.$root.$emit("notification", error.response.data.msg);
      }
    }
  }

  filterPokemon() {
    this.pokemon = this.nuzlocke.pokemon;

    if (this.statusFilter !== "" && this.obtainedFilter === "") {
      this.pokemon = this.nuzlocke.pokemon.filter((pokemon: any) => {
        if (this.statusFilter === "alive") {
          return pokemon.dead === false;
        } else {
          return pokemon.dead === true;
        }
      });
    } else if (this.statusFilter === "" && this.obtainedFilter !== "") {
      this.pokemon = this.nuzlocke.pokemon.filter((pokemon: any) => {
        return pokemon.obtained === this.obtainedFilter;
      });
    } else if (this.statusFilter !== "" && this.obtainedFilter !== "") {
      this.pokemon = this.nuzlocke.pokemon.filter((pokemon: any) => {
        if (this.statusFilter === "alive") {
          return (
            pokemon.dead === false && pokemon.obtained === this.obtainedFilter
          );
        } else {
          return (
            pokemon.dead === true && pokemon.obtained === this.obtainedFilter
          );
        }
      });
    }
  }

  filterByStatus(event: any, status: string) {
    this.statusFilter = status;

    if (event) {
      if (status === "alive") {
        this.deadCheckbox = false;
      } else if (status === "dead") {
        this.aliveCheckbox = false;
      }
    } else {
      this.statusFilter = "";
    }

    this.filterPokemon();
  }

  filterByObtained(event: any, obtained: string) {
    this.obtainedFilter = obtained;

    if (event) {
      if (obtained === "caught") {
        this.giftedCheckbox = false;
        this.hatchedCheckbox = false;
        this.tradedCheckbox = false;
        this.notCheckbox = false;
      } else if (obtained === "gifted") {
        this.caughtCheckbox = false;
        this.hatchedCheckbox = false;
        this.tradedCheckbox = false;
        this.notCheckbox = false;
      } else if (obtained === "hatched") {
        this.caughtCheckbox = false;
        this.giftedCheckbox = false;
        this.tradedCheckbox = false;
        this.notCheckbox = false;
      } else if (obtained === "traded") {
        this.caughtCheckbox = false;
        this.giftedCheckbox = false;
        this.hatchedCheckbox = false;
        this.notCheckbox = false;
      } else if (obtained === "not") {
        this.caughtCheckbox = false;
        this.giftedCheckbox = false;
        this.hatchedCheckbox = false;
        this.tradedCheckbox = false;
      }
    } else {
      this.obtainedFilter = "";
    }

    this.filterPokemon();
  }

  pokemonRowClass(status: Boolean, obtained: string) {
    if (obtained !== "not") {
      if (status) {
        return "dead";
      }
    } else if (obtained === "not") {
      return "not";
    }
  }

  statusButtonClass(dead: Boolean) {
    if (dead) {
      return "dead-button";
    } else {
      return "alive-button";
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

  showDelete() {
    this.showDeleteButton = true;
    this.headers.pop();
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
    this.headers.push({
      text: "Status",
      value: "change",
      align: "center",
      sortable: false
    });
  }

  back() {
    this.$router.push({ name: "nuzlockes" });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";

.col {
  height: 100%;
}

#nuzlocke {
  padding: 10px;
}

#nuzlocke-card {
  width: 100%;
  height: fit-content;
  padding: 10px;
}

#nuzlocke-card {
  max-height: 100%;
  overflow-y: auto;
}

.info::v-deep .v-card__title {
  justify-content: center;
  margin-top: 60px;
}

#nuzlocke-status {
  justify-content: space-evenly;
  margin-bottom: 15px !important;
}

#completed-button {
  background-color: rgb(20, 194, 43) !important;
}

#lost-button,
#cancel-button {
  background-color: #999999 !important;
}

a {
  text-decoration: none;
}

tr,
tr:hover {
  background-color: #fff !important;
}

.dead,
.dead:hover {
  background-color: rgb(241, 60, 60, 0.6) !important;
}

.opacity-dead {
  opacity: 0.6;
}

.not,
.not:hover {
  background-color: #d3d3d3 !important;
}

#filters-card {
  margin-top: 20px;
  width: 100%;
  padding: 0 10px 10px 10px;
}

.filter-col {
  padding: 0 0 0 25px;
}

.filter-checkbox {
  margin: 0 10px 0 10px;
  align-self: end;
}

.filter-checkbox::v-deep .v-messages {
  display: none;
}

.dead-button,
.delete-button {
  background-color: rgb(241, 60, 60) !important;
}

.alive-button {
  background-color: rgb(20, 194, 43) !important;
}

#card-title-row,
.card-title-col {
  margin: 0;
  padding: 0;
  align-items: center;
}
</style>
