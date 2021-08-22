<template>
  <v-row v-if="gotNuzlocke">
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
        >
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
          >Game status: {{ nuzlocke.status }}
        </v-card-subtitle>
        <v-row id="nuzlocke-status">
          <v-btn
            v-if="nuzlocke.status === 'started'"
            id="completed-button"
            @click="changeStatus('completed')"
            >Completed</v-btn
          >
          <v-btn
            v-if="nuzlocke.status === 'started'"
            id="lost-button"
            @click="changeStatus('lost')"
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
    { text: "Nickname", value: "nickname", align: "center", filterable: true },
    { text: "Species", value: "species", align: "center", filterable: true },
    { text: "Location", value: "location", align: "center", filterable: true },
    { text: "Obtained", value: "obtained", align: "center", filterable: true },
    { text: "Dead", value: "dead", align: "center", filterable: true }
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

  async updateNuzlocke() {
    const data = {
      nuzlocke: this.nuzlocke
    };

    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = this.$route.params.nuzlocke_id;
      const res = await axios.put(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}`,
        data
      );
      this.$forceUpdate();
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  changeStatus(status: String) {
    this.nuzlocke.status = status;
    this.updateNuzlocke();
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
  height: 100%;
  padding: 5% 10px 10px 10px;
}

#nuzlocke-card,
#info-card {
  width: 100%;
  height: fit-content;
  margin-top: 30px;
  padding: 10px;
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
</style>
