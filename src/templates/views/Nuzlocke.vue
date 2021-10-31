<template>
  <v-row class="content" v-if="gotNuzlocke">
    <v-col cols="8" id="nuzlocke">
      <v-row class="title-row">
        <v-btn color="white" text class="action-button" @click="back()">
          <v-icon>fa-arrow-left</v-icon>
        </v-btn>
        <h1 class="inner-view-title" :class="titleMode()">
          NUZLOCKE - {{ nuzlocke.title.toUpperCase() }}
        </h1>
      </v-row>
      <v-row class="content-row">
        <v-card id="nuzlocke-card" :dark="darkMode()">
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
                  color="white"
                  text
                  class="delete-button"
                  v-if="!showDeleteButton"
                  @click="showDelete()"
                  >DELETE POKEMON</v-btn
                >
                <v-btn
                  color="white"
                  text
                  id="cancel-button"
                  v-else
                  @click="cancelDelete()"
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
                  <template v-if="item.sprite === ''">
                    -
                  </template>
                  <template v-else>
                    <v-avatar size="78" tile>
                      <v-img :src="item.sprite"></v-img>
                    </v-avatar>
                  </template>
                </td>
                <td :class="tdClass(item.dead)">
                  {{ item.nickname === "" ? "-" : item.nickname }}
                </td>
                <td :class="tdClass(item.dead)">{{ item.number }}</td>
                <td :class="tdClass(item.dead)">
                  {{ item.species.toUpperCase() }}
                </td>
                <td :class="tdClass(item.dead)">
                  {{
                    item.obtained === "not"
                      ? "-"
                      : item.obtainedAs.toUpperCase()
                  }}
                </td>
                <td :class="tdClass(item.dead)">
                  <v-row
                    class="type-row"
                    v-for="type of item.types"
                    :key="type"
                    justify="center"
                  >
                    <v-card :class="`type ${type}`">{{
                      type.toUpperCase()
                    }}</v-card>
                  </v-row>
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
                      <svg
                        v-if="darkMode()"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        aria-hidden="true"
                        role="img"
                        width="24px"
                        height="24px"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2c-4.08 0-7.45 3.05-7.94 7h4.07c.44-1.73 2.01-3 3.87-3c1.86 0 3.43 1.27 3.87 3h4.07c-.49-3.95-3.86-7-7.94-7m0 16c4.08 0 7.45-3.05 7.94-7h-4.07c-.44 1.73-2.01 3-3.87 3c-1.86 0-3.43-1.27-3.87-3H4.06c.49 3.95 3.86 7 7.94 7m0-10a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2z"
                          fill="white"
                        />
                      </svg>
                      <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        aria-hidden="true"
                        role="img"
                        width="24px"
                        height="24px"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2c-4.08 0-7.45 3.05-7.94 7h4.07c.44-1.73 2.01-3 3.87-3c1.86 0 3.43 1.27 3.87 3h4.07c-.49-3.95-3.86-7-7.94-7m0 16c4.08 0 7.45-3.05 7.94-7h-4.07c-.44 1.73-2.01 3-3.87 3c-1.86 0-3.43-1.27-3.87-3H4.06c.49 3.95 3.86 7 7.94 7m0-10a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2z"
                          fill="rgba(0,0,0,.54)"
                        />
                      </svg>
                    </span>
                  </template>
                  <template v-else>
                    <v-icon>{{ obtainedIcon(item.obtained) }}</v-icon>
                  </template>
                </td>
                <td>
                  <v-btn
                    color="white"
                    text
                    :class="statusButtonClass(item.dead)"
                    v-if="item.obtained !== 'not' && !showDeleteButton"
                    @click="changePokemonStatus(item)"
                    small
                  >
                    <v-icon v-if="item.dead" small>fa-skull</v-icon>
                    <v-icon v-else small>fa-heart</v-icon>
                  </v-btn>
                  <v-btn
                    color="white"
                    text
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
              <router-link
                :to="{
                  name: 'add-pokemon',
                  params: { nuzlocke: nuzlocke }
                }"
              >
                <v-btn color="white" text class="action-button"
                  >Add pokemon</v-btn
                >
              </router-link>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-subtitle
              ><strong>Game status: </strong>{{ nuzlocke.status.toUpperCase() }}
            </v-card-subtitle>
            <v-row id="nuzlocke-status">
              <v-btn
                color="white"
                text
                class="action-button"
                v-if="nuzlocke.status !== 'started'"
                @click="changeNuzlockeStatus('started')"
                >Started</v-btn
              >
              <v-btn
                color="white"
                text
                v-if="nuzlocke.status !== 'completed'"
                id="completed-button"
                @click="changeNuzlockeStatus('completed')"
                >Completed</v-btn
              >
              <v-btn
                color="white"
                text
                v-if="nuzlocke.status !== 'lost'"
                id="lost-button"
                @click="changeNuzlockeStatus('lost')"
                >Lost</v-btn
              >
            </v-row>
            <v-divider v-if="nuzlocke.description !== ''"></v-divider>
            <v-card-text v-if="nuzlocke.description !== ''">{{
              nuzlocke.description
            }}</v-card-text>
          </v-card>
          <v-card id="filters-card" :dark="darkMode()">
            <v-card-subtitle>
              <strong>Status filters</strong>
            </v-card-subtitle>
            <v-row>
              <v-col class="filter-col">
                <v-row>
                  <v-checkbox
                    dense
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
                    dense
                    class="filter-checkbox"
                    label="Dead"
                    v-model="deadCheckbox"
                    @change="filterByStatus($event, 'dead')"
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-card-subtitle>
              <strong>Obtained filters</strong>
            </v-card-subtitle>
            <v-row>
              <v-col class="filter-col">
                <v-row>
                  <v-checkbox
                    dense
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
                    dense
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
                    dense
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
                    dense
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
                    dense
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
          <v-row id="pdf-row">
            <v-btn
              color="white"
              text
              id="pdf-button"
              class="action-button"
              @click="downloadPDF()"
            >
              <v-progress-circular
                id="pdf-icon"
                v-if="download"
                indeterminate
                :size="24"
                :width="5"
                color="white"
              >
              </v-progress-circular>
              <v-icon v-else id="pdf-icon">fa-file-pdf</v-icon>DOWNLOAD</v-btn
            >
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <VueHtml2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="1400"
      :pdf-quality="2"
      :manual-pagination="true"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      :filename="nuzlocke.title"
      ref="pdf"
      @hasDownloaded="download = false"
    >
      <section slot="pdf-content">
        <PDF :nuzlocke="nuzlocke" />
      </section>
    </VueHtml2pdf>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PDF from "../components/PDF.vue";
import * as service from "../../services/requests.service";
import VueHtml2pdf from "vue-html2pdf";

@Component({
  components: {
    PDF,
    VueHtml2pdf
  }
})
export default class Nuzlocke extends Vue {
  search = "";
  headers = [
    { text: "", value: "sprite", align: "center", sortable: false },
    { text: "Nickname", value: "nickname", align: "center", sortable: true },
    { text: "Number", value: "number", align: "center", sortable: true },
    { text: "Species", value: "species", align: "center", sortable: true },
    {
      text: "Obtained as",
      value: "obtainedAs",
      align: "center",
      sortable: true
    },
    { text: "Types", value: "types", align: "center", sortable: false },
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
  download = false;

  created() {
    this.getNuzlocke();
  }

  getNuzlocke() {
    const userId = this.$store.state.user.id;
    const nuzlockeId = this.$route.params.nuzlocke_id;
    service
      .getNuzlocke(userId, nuzlockeId)
      .then(res => {
        this.nuzlocke = res.data.nuzlocke;
        this.pokemon = res.data.nuzlocke.pokemon;
        this.gotNuzlocke = true;
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.$root.$emit("logout");
        } else {
          this.$root.$emit("notification", error.response.data.msg);
        }
      });
  }

  changeNuzlockeStatus(status: String) {
    const data = {
      nuzlocke: this.nuzlocke
    };

    data.nuzlocke.status = status;
    const userId = this.$store.state.user.id;
    const nuzlockeId = this.$route.params.nuzlocke_id;
    service
      .changeNuzlockeStatus(userId, nuzlockeId, data)
      .then(res => {
        this.nuzlocke.status = status;
        this.$forceUpdate();
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.$root.$emit("logout");
        } else {
          this.$root.$emit("notification", error.response.data.msg);
        }
      });
  }

  changePokemonStatus(pokemon: any) {
    const userId = this.$store.state.user.id;
    const nuzlockeId = this.$route.params.nuzlocke_id;
    const pokemonId = pokemon._id;
    service
      .changePokemonStatus(userId, nuzlockeId, pokemonId)
      .then(() => {
        pokemon.dead = !pokemon.dead;
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.$root.$emit("logout");
        } else {
          this.$root.$emit("notification", error.response.data.msg);
        }
      });
  }

  deletePokemon(pokemon: any) {
    const userId = this.$store.state.user.id;
    const nuzlockeId = this.$route.params.nuzlocke_id;
    const pokemonId = pokemon._id;
    service
      .deletePokemon(userId, nuzlockeId, pokemonId)
      .then(res => {
        let index: any;
        for (const pokemonObject of this.nuzlocke.pokemon) {
          if (pokemon._id.toString() === pokemonObject._id.toString()) {
            index = this.nuzlocke.pokemon.indexOf(pokemonObject);
            break;
          }
        }

        this.nuzlocke.pokemon.splice(index, 1);
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.$root.$emit("logout");
        } else {
          this.$root.$emit("notification", error.response.data.msg);
        }
      });
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
        return (
          pokemon.dead === (this.statusFilter !== "alive") &&
          pokemon.obtained === this.obtainedFilter
        );
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
      this.caughtCheckbox = obtained === "caught";
      this.giftedCheckbox = obtained === "gifted";
      this.hatchedCheckbox = obtained === "hatched";
      this.tradedCheckbox = obtained === "traded";
      this.notCheckbox = obtained === "not";
    } else {
      this.obtainedFilter = "";
    }

    this.filterPokemon();
  }

  pokemonRowClass(status: Boolean, obtained: string) {
    if (this.$store.state.mode === "dark") {
      if (obtained !== "not") {
        if (status) {
          return "dead";
        } else {
          return "dark-row";
        }
      } else if (obtained === "not") {
        return "not";
      }
    } else {
      if (obtained !== "not") {
        if (status) {
          return "dead";
        }
      } else if (obtained === "not") {
        return "not";
      }
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

  downloadPDF() {
    this.download = true;
    (this.$refs.pdf as any).generatePdf();
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

#completed-button,
.alive-button {
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
  background-color: #c3c3c3 !important;
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
  background-color: $primaryColor !important;
}

#card-title-row,
.card-title-col {
  margin: 0;
  padding: 0;
  align-items: center;
}

#pdf-row {
  margin-top: 20px !important;
}

#pdf-button {
  width: 100%;
}

#pdf-icon {
  margin-right: 20px;
}

.dark-row,
.dark-row:hover {
  background-color: #424242 !important;
}

.v-data-table::v-deep th,
td {
  padding: 0 !important;
}

td {
  font-size: 0.75rem !important;
}

.type-row {
  margin: 5px 0 !important;
}
</style>
