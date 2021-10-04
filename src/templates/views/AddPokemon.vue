<template>
  <v-row>
    <v-row class="title-row">
      <v-card class="title">ADD POKEMON</v-card>
    </v-row>
    <div id="add-pokemon">
      <v-card id="add-pokemon-card">
        <v-form v-on:submit.prevent="addPokemon()">
          <v-container>
            <v-col>
              <v-row id="sprite">
                <v-avatar v-if="sprite !== ''" size="150" tile>
                  <v-img :src="sprite"> </v-img>
                </v-avatar>
              </v-row>
              <v-row>
                <v-autocomplete
                  v-if="gotPokemons"
                  v-model="species"
                  :items="pokemons"
                  label="Species"
                  @change="pokemonSprite($event)"
                >
                  <template v-slot:selection="species">
                    {{ species.item.toUpperCase() }}
                  </template>
                  <template v-slot:item="species">
                    {{ species.item.toUpperCase() }}
                  </template>
                </v-autocomplete>
              </v-row>
              <v-row>
                <v-text-field
                  v-model="nickname"
                  label="Nickname"
                ></v-text-field>
              </v-row>
              <v-row>
                <v-autocomplete
                  v-if="gotLocations"
                  v-model="location"
                  :items="locations"
                  label="Location"
                >
                  <template v-slot:selection="locations">
                    {{ locations.item.toUpperCase() }}
                  </template>
                  <template v-slot:item="locations">
                    {{ locations.item.toUpperCase() }}
                  </template>
                </v-autocomplete>
              </v-row>
              <v-row>
                <v-select
                  v-model="obtained"
                  :items="obtainedOptions"
                  label="Obtained"
                >
                  <template v-slot:selection="obtainedOptions">
                    {{ obtainedOptions.item.toUpperCase() }}
                  </template>
                  <template v-slot:item="obtainedOptions">
                    {{ obtainedOptions.item.toUpperCase() }}
                  </template>
                </v-select>
              </v-row>
            </v-col>
          </v-container>
        </v-form>
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
          <v-btn @click="addPokemon()">Add pokemon</v-btn>
        </v-card-title>
      </v-card>
    </div>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import * as staticInfo from "../../utils/staticInfo";
import BackButton from "../components/BackButton.vue";

@Component({
  components: {
    BackButton
  }
})
export default class AddPokemon extends Vue {
  nuzlocke: any;
  pokemons = [] as any;
  gotPokemons = false;
  locations = [] as any;
  gotLocations = false;
  obtainedOptions = staticInfo.obtainedOptions;
  species = "";
  nickname = "";
  location = "";
  obtained = "";
  gamesRegions = staticInfo.regionsGames;
  sprite = "";

  async created() {
    if (!this.$route.params.nuzlocke) {
      await this.getNuzlocke();
    } else {
      this.nuzlocke = this.$route.params.nuzlocke;
    }

    this.getPokemon();
    this.getLocations();
  }

  async getNuzlocke() {
    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = this.$route.params.nuzlocke_id;
      const res = await axios.get(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}`
      );
      this.nuzlocke = res.data.nuzlocke;
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  async getPokemon() {
    try {
      const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon/?limit=898"
      );
      this.pokemons = res.data.results.map((pokemon: any) => {
        return pokemon.name;
      });

      this.gotPokemons = true;
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  async getLocations() {
    let regions = [] as any;
    for (const region of this.gamesRegions) {
      if (Object.values(region)[0].includes(this.nuzlocke.baseGame)) {
        regions = Object.keys(region);
        break;
      }
    }

    if (regions[0] === "johto") {
      regions.push("kanto");
    }

    try {
      for (const region of regions) {
        const res = await axios.get(
          "https://pokeapi.co/api/v2/region/" + region
        );

        const locationsNames = res.data.locations.map((location: any) => {
          return location.name.replaceAll("-", " ");
        });

        this.locations = this.locations.concat(locationsNames);
      }

      this.gotLocations = true;
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  async pokemonSprite(event: any) {
    try {
      const res = await axios.get("https://pokeapi.co/api/v2/pokemon/" + event);
      this.sprite = res.data.sprites.front_default;
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  async addPokemon() {
    if (!this.validateData()) {
      return;
    }

    const data = {
      nickname: this.nickname,
      location: this.location,
      obtained: this.obtained,
      species: this.species,
      sprite: this.sprite
    };

    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = this.nuzlocke._id;
      const res = await axios.post(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}/pokemon`,
        data
      );

      this.$root.$emit("error", this.nickname + " added to nuzlocke");
      this.$router.push({ name: "nuzlocke" });
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  validateData() {
    if (
      this.species === "" ||
      this.species === undefined ||
      this.location === "" ||
      this.location === undefined ||
      this.obtained === "" ||
      this.obtained === undefined
    ) {
      return false;
    }

    if (this.obtained !== "not" && this.nickname === "") {
      return false;
    }

    return true;
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

#add-pokemon {
  width: 65%;
  height: 100%;
  padding: 0 10px 10px 10px;
}

#add-pokemon-card,
#info-card {
  width: 100%;
  height: fit-content;
  padding: 10px;
}

#info {
  width: 35%;
  height: 100%;
  padding: 0 10px 10px 10px;
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

#sprite {
  justify-content: center;
}
</style>
