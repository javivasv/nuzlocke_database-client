<template>
  <v-row class="content" v-if="gotNuzlocke">
    <v-row class="title-row">
      <v-card class="title">{{ nuzlocke.title.toUpperCase() }}</v-card>
    </v-row>
    <v-row class="content-row">
      <v-col cols="8" id="nuzlocke">
        <v-card id="nuzlocke-card">
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-checkbox
              class="filter-checkbox"
              label="Alive"
              v-model="aliveCheckbox"
              @change="filterPokemon($event, 'alive')"
            ></v-checkbox>
            <v-checkbox
              class="filter-checkbox"
              label="Dead"
              v-model="deadCheckbox"
              @change="filterPokemon($event, 'dead')"
            ></v-checkbox>
            <v-checkbox
              class="filter-checkbox"
              label="Not caught"
              v-model="notCaughtCheckbox"
              @change="filterPokemon($event, 'notCaught')"
            ></v-checkbox>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="pokemon"
            :search="search"
            :items-per-page="5"
          >
            <template #item="{ item }">
              <tr :class="pokemonRowClass(item.dead, item.obtained)">
                <td>
                  <v-avatar size="80" tile>
                    <v-img :src="item.sprite"></v-img>
                  </v-avatar>
                </td>
                <td>{{ item.nickname }}</td>
                <td>{{ item.number }}</td>
                <td>{{ item.species.toUpperCase() }}</td>
                <td>{{ item.location.toUpperCase() }}</td>
                <td>
                  <template v-if="item.obtained === 'not'">
                    -
                  </template>
                  <template v-else-if="item.obtained === 'caught'">
                    <span class="iconify" data-icon="mdi:pokeball"></span>
                  </template>
                  <template v-else>
                    <v-icon>{{ obtainedIcon(item.obtained) }}</v-icon>
                  </template>
                </td>
                <td>
                  <v-btn
                    v-if="item.obtained !== 'not'"
                    @click="changePokemonStatus(item)"
                    small
                    >CHANGE</v-btn
                  >
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="4" class="info">
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
              <v-btn>Add pokemon</v-btn>
            </router-link>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-subtitle class="card-text"
            >Game status: {{ nuzlocke.status.toUpperCase() }}
          </v-card-subtitle>
          <!--
        <v-divider></v-divider>
        <v-card-subtitle class="card-text">Change status: </v-card-subtitle>
        -->
          <v-row id="nuzlocke-status">
            <v-btn
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
          <v-divider></v-divider>
          <v-card-text>{{ nuzlocke.description }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
      text: "Change status",
      value: "change",
      align: "center",
      sortable: false
    }
  ];
  gotNuzlocke = false;
  nuzlocke: any;
  pokemon = [] as any;
  aliveCheckbox = false;
  deadCheckbox = false;
  notCaughtCheckbox = false;

  created() {
    this.getNuzlocke();
  }

  async getNuzlocke() {
    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = this.$route.params.nuzlocke_id;
      const res = await axios.get(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}`
      );
      this.nuzlocke = res.data.nuzlocke;
      this.pokemon = res.data.nuzlocke.pokemon;
      this.gotNuzlocke = true;
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
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
        data
      );

      this.nuzlocke.status = status;
      this.$forceUpdate();
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  async changePokemonStatus(item: any) {
    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = this.$route.params.nuzlocke_id;
      await axios.put(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}/pokemon/${item._id}`
      );

      item.dead = !item.dead;
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  filterPokemon(event: any, type: string) {
    if (event && type === "alive") {
      this.deadCheckbox = false;
      this.notCaughtCheckbox = false;
      this.pokemon = this.nuzlocke.pokemon.filter((pokemon: any) => {
        return pokemon.dead === false;
      });
    } else if (event && type === "dead") {
      this.aliveCheckbox = false;
      this.notCaughtCheckbox = false;
      this.pokemon = this.nuzlocke.pokemon.filter((pokemon: any) => {
        return pokemon.dead === true;
      });
    } else if (event && type === "notCaught") {
      this.aliveCheckbox = false;
      this.deadCheckbox = false;
      this.pokemon = this.nuzlocke.pokemon.filter((pokemon: any) => {
        return pokemon.obtained === "not";
      });
    } else if (!event) {
      this.pokemon = this.nuzlocke.pokemon;
    }
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

  obtainedIcon(obtainedType: string) {
    if (obtainedType === "gifted") {
      return "fa-gift";
    } else if (obtainedType === "hatched") {
      return "fa-egg";
    } else if (obtainedType === "traded") {
      return "fa-exchange-alt";
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

.col {
  height: 100%;
}

#nuzlocke {
  padding: 0 10px 10px 10px;
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

.v-btn {
  background-color: $secondaryColor !important;
  color: white !important;
}

.card-text {
  color: #999999;
}

#nuzlocke-status {
  justify-content: space-evenly;
  margin-bottom: 15px;
}

#completed-button {
  background-color: #4caf50 !important;
}

#lost-button {
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
  background-color: rgb(241, 60, 60) !important;
}

.not,
.not:hover {
  background-color: #d3d3d3 !important;
}

.filter-checkbox {
  margin: 0 10px 0 10px;
  align-self: end;
}

.filter-checkbox::v-deep .v-messages {
  display: none;
}

.iconify {
  height: 24px;
  width: 24px;
  color: rgba(0, 0, 0, 0.54);
}
</style>
