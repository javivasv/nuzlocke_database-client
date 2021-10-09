<template>
  <v-row>
    <v-row class="title-row">
      <v-card class="title">ADD POKEMON</v-card>
    </v-row>
    <v-row class="content-row">
      <v-col cols="8" id="add-pokemon">
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
                    :disabled="obtained !== 'not' ? false : true"
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
            <v-btn @click="addPokemon()">Add pokemon</v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
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
      this.pokemons = res.data.results.map((pokemon: any, index: any) => {
        let pokemonNumber = (index + 1).toString();

        if (pokemonNumber.length === 1) {
          pokemonNumber = "#00" + pokemonNumber;
        } else if (pokemonNumber.length === 2) {
          pokemonNumber = "#0" + pokemonNumber;
        } else if (pokemonNumber.length === 3) {
          pokemonNumber = "#" + pokemonNumber;
        }

        return pokemonNumber + " - " + pokemon.name;
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
          let locationName = location.name.replaceAll("-", " ");

          if (regions[0] === "kanto") {
            locationName = locationName.replace("kanto ", "");
          } else if (regions[0] === "johto") {
            locationName = locationName
              .replace("kanto ", "")
              .replace("johto ", "");
          } else if (regions[0] === "hoenn") {
            locationName = locationName.replace("hoenn ", "");
          } else if (regions[0] === "sinnoh") {
            locationName = locationName.replace("sinnoh ", "");
          } else if (regions[0] === "unova") {
            locationName = locationName.replace("unova ", "");
          } else if (regions[0] === "kalos") {
            locationName = locationName.replace("kalos ", "");
          } else if (regions[0] === "alola") {
            locationName = locationName.replace("alola ", "");
          } else if (regions[0] === "galar") {
            locationName = locationName.replace("galar ", "");
          }

          return locationName;
        });

        this.locations = this.locations.concat(locationsNames);
      }

      this.gotLocations = true;
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  async pokemonSprite(event: any) {
    if (event === undefined) {
      this.sprite = "";
    } else {
      const pokemonName = event.split(" ")[2];
      try {
        const res = await axios.get(
          "https://pokeapi.co/api/v2/pokemon/" + pokemonName
        );
        this.sprite = res.data.sprites.front_default;
      } catch (error) {
        this.$root.$emit("error", error.response.data.msg);
      }
    }
  }

  async addPokemon() {
    if (!this.validateData()) {
      return;
    }

    const pokemon = this.species.split(" ");
    const data = {
      nickname: this.nickname,
      location: this.location,
      obtained: this.obtained,
      number: pokemon[0],
      species: pokemon[2],
      sprite: this.sprite
    };

    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = this.nuzlocke._id;
      const res = await axios.post(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}/pokemon`,
        data
      );

      this.$root.$emit(
        "error",
        this.nickname + " was added to " + this.nuzlocke.title
      );
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

    if (this.obtained === "not") {
      this.nickname = "";
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

.col {
  height: 100%;
}

#add-pokemon {
  padding: 0 10px 10px 10px;
}

#add-pokemon-card {
  width: 100%;
  height: fit-content;
  padding: 10px;
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

#sprite {
  justify-content: center;
}
</style>
