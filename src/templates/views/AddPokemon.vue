<template>
  <v-row class="content" v-if="gotNuzlocke">
    <v-col cols="8" id="add-pokemon">
      <v-row class="title-row">
        <v-btn @click="back()">
          <v-icon>fa-arrow-left</v-icon>
        </v-btn>
        <h1 class="inner-view-title">
          ADD POKEMON TO: {{ nuzlocke.title.toUpperCase() }}
        </h1>
      </v-row>
      <v-row class="content-row">
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
                  <v-col :cols="original ? '9' : '7'" id="species-col">
                    <v-row>
                      <template v-if="!original">
                        <v-row>
                          <v-autocomplete
                            v-if="gotPokemons"
                            v-model="species"
                            :items="pokemons"
                            label="Species"
                            @change="selectPokemon($event)"
                          >
                            <template v-slot:selection="species">
                              {{ species.item.toUpperCase() }}
                            </template>
                            <template v-slot:item="species">
                              {{ species.item.toUpperCase() }}
                            </template>
                          </v-autocomplete>
                        </v-row>
                        <v-row v-if="speciesError">
                          <span class="error-msg">{{ requiredErrorMsg }}</span>
                        </v-row>
                      </template>
                      <template v-else>
                        <v-col cols="5" id="species-left-col">
                          <v-row>
                            <v-text-field
                              v-model="number"
                              label="Number"
                              placeholder="Format: #000"
                            ></v-text-field>
                          </v-row>
                          <v-row v-if="numberError">
                            <span class="error-msg">{{ numberErrorMsg }}</span>
                          </v-row>
                        </v-col>
                        <v-col cols="7" id="species-right-col">
                          <v-row>
                            <v-text-field
                              v-model="species"
                              label="Original species"
                            ></v-text-field>
                          </v-row>
                          <v-row v-if="originalSpeciesError">
                            <span class="error-msg">{{
                              requiredErrorMsg
                            }}</span>
                          </v-row>
                        </v-col>
                      </template>
                    </v-row>
                  </v-col>
                  <v-col cols="3" class="checkbox-col">
                    <v-row justify="center">
                      <v-checkbox
                        label="Original species"
                        v-model="original"
                        @change="selectOriginal($event)"
                      ></v-checkbox>
                    </v-row>
                  </v-col>
                  <v-col v-if="!original" cols="2" class="checkbox-col">
                    <v-row justify="center">
                      <v-checkbox
                        label="Shiny"
                        v-model="shiny"
                        @change="selectShiny()"
                      ></v-checkbox>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row class="input-row">
                  <v-text-field
                    v-model="nickname"
                    label="Nickname"
                    :disabled="obtained !== 'not' ? false : true"
                  ></v-text-field>
                </v-row>
                <v-row class="input-row">
                  <template v-if="!nuzlocke.original">
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
                  </template>
                  <template v-else>
                    <v-text-field
                      v-model="location"
                      label="Location"
                    ></v-text-field>
                  </template>
                </v-row>
                <v-row v-if="locationError">
                  <span class="error-msg">{{ requiredErrorMsg }}</span>
                </v-row>
                <v-row class="input-row">
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
                <v-row v-if="obtainedError">
                  <span class="error-msg">{{ requiredErrorMsg }}</span>
                </v-row>
              </v-col>
            </v-container>
          </v-form>
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
              <v-btn @click="addPokemon()">Add pokemon</v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <ul>
                <li>
                  <p class="card-text">
                    <strong>Species:</strong> The species of the pokemon
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p class="card-text">
                    <strong>Original species:</strong> In case of being a
                    pokemon species not already existing in any previous game or
                    region. If an original species, the pokedex number must be
                    given
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p class="card-text">
                    <strong>Shiny:</strong> The pokemon sprite is shown with the
                    shiny coloration
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p class="card-text">
                    <strong>Nickname:</strong> The nickname given to the
                    pokemon, if given one
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p class="card-text">
                    <strong>Location:</strong> The location in which the pokemon
                    was obtained or encountered
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p class="card-text">
                    <strong>Obtained:</strong> The way in which the pokemon was
                    obtained, if it was obtained
                  </p>
                </li>
              </ul>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              For simplicity, pokemon with different forms that are purely
              cosmetic or depends on a game dynamic to retain a specific form,
              are presented with a default form
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
export default class AddPokemon extends Vue {
  nuzlocke: any;
  gotNuzlocke = false;
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
  original = false;
  shiny = false;
  number = "";
  speciesError = false;
  locationError = false;
  obtainedError = false;
  numberError = false;
  originalSpeciesError = false;
  requiredErrorMsg = "This field is required";
  numberErrorMsg = "";

  async created() {
    if (!this.$route.params.nuzlocke) {
      await this.getNuzlocke();
    } else {
      this.nuzlocke = this.$route.params.nuzlocke;
      this.gotNuzlocke = true;
    }

    if (!this.nuzlocke.original) {
      this.getLocations();
    }

    this.getPokemon();
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

  async getPokemon() {
    try {
      const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon/?limit=898"
      );

      this.pokemons = [];
      let number = 0;
      res.data.results.map((pokemon: any) => {
        number++;
        let pokemonNumber = number.toString();

        if (pokemonNumber.length === 1) {
          pokemonNumber = "#00" + pokemonNumber;
        } else if (pokemonNumber.length === 2) {
          pokemonNumber = "#0" + pokemonNumber;
        } else if (pokemonNumber.length === 3) {
          pokemonNumber = "#" + pokemonNumber;
        }

        this.pokemons.push(`${pokemonNumber} - ${pokemon.name}`);

        if (staticInfo.alolanVariants.includes(pokemon.name)) {
          this.pokemons.push(`${pokemonNumber} - ${pokemon.name}-alola`);
        }

        if (staticInfo.galarianVariants.includes(pokemon.name)) {
          this.pokemons.push(`${pokemonNumber} - ${pokemon.name}-galar`);
        }

        if (pokemon.name.includes("deoxys")) {
          this.pokemons.push(`${pokemonNumber} - deoxys-attack`);
          this.pokemons.push(`${pokemonNumber} - deoxys-defense`);
          this.pokemons.push(`${pokemonNumber} - deoxys-speed`);
        }

        if (pokemon.name.includes("wormadam")) {
          this.pokemons.push(`${pokemonNumber} - wormadam-sandy`);
          this.pokemons.push(`${pokemonNumber} - wormadam-trash`);
        }

        if (pokemon.name.includes("lycanroc")) {
          this.pokemons.push(`${pokemonNumber} - lycanroc-midnight`);
          this.pokemons.push(`${pokemonNumber} - lycanroc-dusk`);
        }

        if (pokemon.name.includes("urshifu")) {
          this.pokemons.push(`${pokemonNumber} - urshifu-rapid-strike`);
        }

        if (pokemon.name.includes("toxtricity")) {
          this.pokemons.push(`${pokemonNumber} - toxtricity-low-key`);
        }
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

  selectPokemon(event: any) {
    if (event === undefined) {
      this.sprite = "";
      this.shiny = false;
    } else {
      const pokemonName = event.split(" ")[2];
      this.pokemonSprite(pokemonName);
    }
  }

  async pokemonSprite(pokemonName: any) {
    try {
      const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon/" + pokemonName
      );

      if (this.shiny) {
        this.sprite = res.data.sprites.front_shiny;
      } else {
        this.sprite = res.data.sprites.front_default;
      }
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  async addPokemon() {
    if (!this.validateData()) {
      return;
    }

    let data: any;
    if (this.original) {
      data = {
        nickname: this.nickname,
        location: this.location.toLowerCase(),
        obtained: this.obtained,
        number: this.number,
        original: this.original,
        species: this.species.toLowerCase(),
        sprite: this.sprite
      };
    } else {
      const pokemon = this.species.split(" ");
      data = {
        nickname: this.nickname,
        location: this.location,
        obtained: this.obtained,
        number: pokemon[0],
        original: this.original,
        species: pokemon[2],
        sprite: this.sprite
      };
    }

    try {
      const userId = this.$store.state.user.id;
      const nuzlockeId = this.nuzlocke._id;
      const res = await axios.post(
        `${staticInfo.server}/user/${userId}/nuzlocke/${nuzlockeId}/pokemon`,
        data
      );

      if (this.nickname === "") {
        const pokemon = this.species.split(" ");
        this.$root.$emit(
          "error",
          pokemon[2].toUpperCase() + " was added to " + this.nuzlocke.title
        );
      } else {
        this.$root.$emit(
          "error",
          this.nickname + " was added to " + this.nuzlocke.title
        );
      }
      this.$router.push({ name: "nuzlocke" });
    } catch (error) {
      this.$root.$emit("error", error.response.data.msg);
    }
  }

  validateData() {
    let valid = true;
    this.speciesError = this.locationError = this.obtainedError = this.numberError = this.originalSpeciesError = false;

    if (!this.original) {
      if (this.species === "" || this.species === undefined) {
        this.speciesError = true;
        valid = false;
      }
    }

    if (this.location === "" || this.location === undefined) {
      this.locationError = true;
      valid = false;
    }

    if (this.obtained === "" || this.obtained === undefined) {
      this.obtainedError = true;
      valid = false;
    }

    if (this.original) {
      if (this.number === "") {
        this.numberErrorMsg = this.requiredErrorMsg;
        this.numberError = true;
        valid = false;
      } else {
        let numberRegex = /#\d+/i;
        if (this.original && !numberRegex.test(this.number)) {
          this.numberErrorMsg = "The number format is invalid";
          this.numberError = true;
          valid = false;
        }
      }

      if (this.species === "") {
        this.originalSpeciesError = true;
        valid = false;
      }
    }

    if (this.obtained === "not") {
      this.nickname = "";
    }

    return valid;
  }

  selectOriginal(event: any) {
    if (event) {
      this.number = "";
      this.species = "";
      this.sprite = "";
      this.shiny = false;
    }
  }

  selectShiny() {
    if (this.species !== "" && this.species !== undefined) {
      const pokemonName = this.species.split(" ")[2];
      this.pokemonSprite(pokemonName);
    }
  }

  back() {
    this.$router.go(-1);
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

#add-pokemon {
  padding: 10px;
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

#species-left-col {
  padding: 0 12px 0 0;
}

#species-col,
.checkbox-col {
  padding: 0;
}

#species-right-col {
  padding: 0 0 0 12px;
}

.v-text-field::v-deep .v-text-field__details {
  display: none;
}

.input-row {
  margin-top: 20px;
}
</style>
