<template>
  <v-row class="content-row" v-if="gotNuzlocke">
    <v-row class="back-row"></v-row>
    <div id="nuzlocke">
      <v-card id="nuzlocke-card">
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
          :headers="headers"
          :items="nuzlocke.pokemon"
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
              <td>{{ item.species.toUpperCase() }}</td>
              <td>{{ item.location.toUpperCase() }}</td>
              <td>{{ item.obtained.toUpperCase() }}</td>
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
          <router-link
            :to="{
              name: 'add-pokemon',
              params: { baseGame: nuzlocke.baseGame }
            }"
          >
            <v-btn>Add pokemon</v-btn>
          </router-link>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-subtitle class="card-text"
          >Game status: {{ nuzlocke.status.toUpperCase() }}
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-subtitle class="card-text">Change status: </v-card-subtitle>
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
    </div>
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
    { text: "Species", value: "species", align: "center", sortable: true },
    { text: "Location", value: "location", align: "center", sortable: true },
    { text: "Obtained", value: "obtained", align: "center", sortable: true },
    {
      text: "Change status",
      value: "change",
      align: "center",
      sortable: false
    }
  ];
  gotNuzlocke = false;
  nuzlocke: any;

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

  pokemonRowClass(status: Boolean, obtained: string) {
    if (obtained !== "not") {
      if (status) {
        return "dead";
      }
    } else if (obtained === "not") {
      return "not";
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

#nuzlocke {
  width: 65%;
  height: 90%;
  padding: 0 10px 10px 10px;
}

#nuzlocke-card,
#info-card {
  width: 100%;
  height: fit-content;
  padding: 10px;
}

#nuzlocke-card {
  max-height: 100%;
  overflow-y: auto;
}

#info {
  width: 35%;
  height: 90%;
  padding: 0 10px 10px 10px;
}

#info::v-deep .v-card__title {
  justify-content: center;
  margin-top: 60px;
}

.card-title,
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
  background-color: rgb(241, 229, 60) !important;
}
</style>
