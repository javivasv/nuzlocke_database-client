<template>
  <v-row class="content" v-if="gotNuzlocke">
    <v-col cols="8" id="add-pokemon">
      <v-row class="title-row">
        <v-btn color="white" text class="action-button" @click="back()">
          <v-icon>fa-arrow-left</v-icon>
        </v-btn>
        <h1 class="inner-view-title" :class="titleMode()">
          ADD POKEMON TO: {{ nuzlocke.title.toUpperCase() }}
        </h1>
      </v-row>
      <v-row class="content-row">
        <v-card id="add-pokemon-card" :dark="darkMode()">
          <v-form v-on:submit.prevent="addPokemon()">
            <v-container>
              <v-col>
                <v-row id="sprite">
                  <v-avatar v-if="sprite !== ''" size="150" tile>
                    <v-img :src="sprite"> </v-img>
                  </v-avatar>
                </v-row>
                <v-row
                  class="input-row"
                  id="types"
                  v-if="types.length > 0"
                  justify="center"
                >
                  <v-card
                    :class="`type ${type}`"
                    v-for="(type, index) of types"
                    :key="index"
                    >{{ type.toUpperCase() }}</v-card
                  >
                </v-row>
                <v-row class="input-row">
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
                  <v-col v-if="!original" cols="2" class="checkbox-col">
                    <v-row justify="center">
                      <v-checkbox
                        label="Shiny"
                        v-model="shiny"
                        @change="selectShiny()"
                      ></v-checkbox>
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
                </v-row>
                <v-row class="input-row" v-if="original">
                  <v-col id="type-col-left">
                    <v-row>
                      <v-autocomplete
                        label="Type"
                        :items="pokemonTypes"
                        @change="checkType($event, 0)"
                        v-model="firstType"
                      >
                        <template v-slot:selection="pokemonTypes">
                          {{ pokemonTypes.item.toUpperCase() }}
                        </template>
                        <template v-slot:item="pokemonTypes">
                          {{ pokemonTypes.item.toUpperCase() }}
                        </template>
                      </v-autocomplete>
                    </v-row>
                  </v-col>
                  <v-col id="type-col-right">
                    <v-row>
                      <v-autocomplete
                        label="Type"
                        :items="pokemonTypes"
                        @change="checkType($event, 1)"
                        v-model="secondType"
                      >
                        <template v-slot:selection="pokemonTypes">
                          {{ pokemonTypes.item.toUpperCase() }}
                        </template>
                        <template v-slot:item="pokemonTypes">
                          {{ pokemonTypes.item.toUpperCase() }}
                        </template>
                      </v-autocomplete>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row v-if="original && typesError">
                  <span class="error-msg">{{ typesErrorMsg }}</span>
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
              <v-btn
                color="white"
                text
                class="action-button"
                @click="addPokemon()"
                >Add pokemon</v-btn
              >
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <ul>
                <li>
                  <p><strong>Species:</strong> The species of the pokemon</p>
                </li>
              </ul>
              <ul>
                <li>
                  <p>
                    <strong>Original species:</strong> In case of being a
                    pokemon species not already existing in any previous game or
                    region. If an original species, the pokedex number must be
                    given
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p>
                    <strong>Shiny:</strong> The pokemon sprite is shown with the
                    shiny coloration
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p><strong>Type:</strong> The type(s) of the pokemon</p>
                </li>
              </ul>
              <ul>
                <li>
                  <p>
                    <strong>Nickname:</strong> The nickname given to the
                    pokemon, if given one
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p>
                    <strong>Location:</strong> The location in which the pokemon
                    was obtained or encountered
                  </p>
                </li>
              </ul>
              <ul>
                <li>
                  <p>
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
import * as service from "../../services/requests.service";
import * as constants from "../../utils/constants";

@Component({})
export default class AddPokemon extends Vue {
  nuzlocke: any;
  gotNuzlocke = false;
  pokemons = [] as any;
  gotPokemons = false;
  locations = [] as any;
  gotLocations = false;
  obtainedOptions = constants.obtainedOptions;
  pokemonTypes = constants.types;
  species = "";
  nickname = "";
  location = "";
  obtained = "";
  gamesRegions = constants.regionsGames;
  sprite = "";
  types = [];
  original = false;
  shiny = false;
  number = "";
  speciesError = false;
  typesError = false;
  locationError = false;
  obtainedError = false;
  numberError = false;
  originalSpeciesError = false;
  requiredErrorMsg = "This field is required";
  typesErrorMsg = "";
  numberErrorMsg = "";
  evolutionChain = {} as any;
  evolves = false;
  evolvesTo = [] as any;
  firstType = "";
  secondType = "";

  created() {
    if (!this.$route.params.nuzlocke) {
      this.getNuzlocke();
    } else {
      this.nuzlocke = this.$route.params.nuzlocke;
      this.gotNuzlocke = true;

      if (!this.nuzlocke.original) {
        this.getLocations();
      }
    }

    this.getPokemon();
  }

  getNuzlocke() {
    const userId = this.$store.state.user.id;
    const nuzlockeId = this.$route.params.nuzlocke_id;
    service
      .getNuzlocke(userId, nuzlockeId)
      .then(res => {
        this.nuzlocke = res.data.nuzlocke;
        this.gotNuzlocke = true;
      })
      .then(() => {
        if (!this.nuzlocke.original) {
          this.getLocations();
        }
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.$root.$emit("logout");
        } else {
          this.$root.$emit("notification", error.response.data.msg);
        }
      });
  }

  getPokemon() {
    service
      .getPokemon()
      .then(res => {
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

          let pokemonName = pokemon.name;

          if (constants.specialPokemonNames.includes(pokemon.name)) {
            pokemonName = pokemon.name.split("-")[0];
          }

          this.pokemons.push(`${pokemonNumber} - ${pokemonName}`);

          if (constants.alolanVariants.includes(pokemonName)) {
            this.pokemons.push(`${pokemonNumber} - ${pokemonName}-alola`);
          }

          if (constants.galarianVariants.includes(pokemonName)) {
            this.pokemons.push(`${pokemonNumber} - ${pokemonName}-galar`);
          }

          if (pokemonName.includes("deoxys")) {
            this.pokemons.push(`${pokemonNumber} - deoxys-attack`);
            this.pokemons.push(`${pokemonNumber} - deoxys-defense`);
            this.pokemons.push(`${pokemonNumber} - deoxys-speed`);
          }

          if (pokemonName.includes("wormadam")) {
            this.pokemons.push(`${pokemonNumber} - wormadam-sandy`);
            this.pokemons.push(`${pokemonNumber} - wormadam-trash`);
          }

          if (pokemonName.includes("lycanroc")) {
            this.pokemons.push(`${pokemonNumber} - lycanroc-midnight`);
            this.pokemons.push(`${pokemonNumber} - lycanroc-dusk`);
          }

          if (pokemonName.includes("toxtricity")) {
            this.pokemons.push(`${pokemonNumber} - toxtricity-low-key`);
          }

          if (pokemonName.includes("urshifu")) {
            this.pokemons.push(`${pokemonNumber} - urshifu-rapid-strike`);
          }
        });

        this.gotPokemons = true;
      })
      .catch(error => {
        this.$root.$emit(
          "notification",
          "An error occurred getting the pokemon"
        );
      });
  }

  getLocations() {
    let regions = [] as any;
    for (const region of this.gamesRegions) {
      if (Object.values(region)[0].includes(this.nuzlocke.baseGame)) {
        regions = Object.keys(region);
        break;
      }
    }

    const regionZero = regions[0];
    if (regionZero === "johto") {
      regions.push("kanto");
    }

    for (const region of regions) {
      service
        .getLocations(region)
        .then(res => {
          const locationsNames = res.data.locations.map((location: any) => {
            let locationName = location.name.replaceAll("-", " ");

            if (regionZero === "kanto") {
              locationName = locationName.replace("kanto ", "");
            } else if (regionZero === "johto") {
              locationName = locationName
                .replace("kanto ", "")
                .replace("johto ", "");
            } else if (regionZero === "hoenn") {
              locationName = locationName.replace("hoenn ", "");
            } else if (regionZero === "sinnoh") {
              locationName = locationName.replace("sinnoh ", "");
            } else if (regionZero === "unova") {
              locationName = locationName.replace("unova ", "");
            } else if (regionZero === "kalos") {
              locationName = locationName.replace("kalos ", "");
            } else if (regionZero === "alola") {
              locationName = locationName.replace("alola ", "");
            } else if (regionZero === "galar") {
              locationName = locationName.replace("galar ", "");
            }

            return locationName;
          });

          this.locations = this.locations.concat(locationsNames);
        })
        .then(() => {
          this.gotLocations = true;
        })
        .catch(error => {
          this.$root.$emit(
            "notification",
            "An error occurred getting the locations"
          );
        });
    }
  }

  selectPokemon(event: any) {
    this.types = [];
    this.evolutionChain = {};
    this.evolves = false;
    this.evolvesTo = [];

    if (event === undefined) {
      this.sprite = "";
    } else {
      const pokemonName = event.split(" ")[2];
      const pokemonNumber = +event.split(" ")[0].split("#")[1];

      if (pokemonName.includes("alola")) {
        this.getPokemonData(pokemonName);
        this.checkAlolanEvolutions(pokemonName);
      } else if (pokemonName.includes("galar")) {
        this.getPokemonData(pokemonName);
        this.checkGalarianEvolutions(pokemonName);
      } else if (constants.specialPokemonForms.includes(pokemonName)) {
        this.getPokemonData(pokemonName);
        this.checkOriginalEvolutions(pokemonName, pokemonNumber.toString());
      } else {
        this.getPokemonData(pokemonNumber.toString());
        this.checkOriginalEvolutions(pokemonName, pokemonNumber.toString());
      }
    }
  }

  checkOriginalEvolutions(pokemonName: string, pokemonNumber: string) {
    if (pokemonName === "meowth") {
      this.evolutionChain = {};
      this.evolves = true;
      this.evolvesTo.push("persian");
    } else if (pokemonName === "yamask") {
      this.evolutionChain = {};
      this.evolves = true;
      this.evolvesTo.push("cofagrigus");
    } else if (pokemonName === "farfetchd") {
      this.evolutionChain = {};
      this.evolves = false;
      this.evolvesTo = [];
    } else if (pokemonName === "mr-mime") {
      this.evolutionChain = {};
      this.evolves = false;
      this.evolvesTo = [];
    } else if (pokemonName === "farfetchd") {
      this.evolutionChain = {};
      this.evolves = false;
      this.evolvesTo = [];
    } else if (pokemonName === "corsola") {
      this.evolutionChain = {};
      this.evolves = false;
      this.evolvesTo = [];
    } else if (pokemonName === "linoone") {
      this.evolutionChain = {};
      this.evolves = false;
      this.evolvesTo = [];
    } else {
      this.getPokemonSpecies(pokemonName, pokemonNumber);
    }
  }

  checkAlolanEvolutions(pokemonName: string) {
    const speciesName = pokemonName.split("-")[0];
    if (
      speciesName === "rattata" ||
      speciesName === "sandshrew" ||
      speciesName === "vulpix" ||
      speciesName === "diglett" ||
      speciesName === "meowth" ||
      speciesName === "geodude" ||
      speciesName === "graveler" ||
      speciesName === "grimer"
    ) {
      const index = constants.alolanVariants.indexOf(speciesName);
      this.evolutionChain = {};
      this.evolves = true;
      this.evolvesTo.push(constants.alolanVariants[index + 1] + "-alola");
    }
  }

  checkGalarianEvolutions(pokemonName: string) {
    const speciesName = pokemonName.split("-")[0];

    if (speciesName === "meowth") {
      this.evolutionChain = {};
      this.evolves = true;
      this.evolvesTo.push("perrserker");
    } else if (speciesName === "slowpoke") {
      this.evolutionChain = {};
      this.evolves = true;
      this.evolvesTo.push("slowbro");
      this.evolvesTo.push("slowking");
    } else if (speciesName === "farfetchd") {
      this.evolutionChain = {};
      this.evolves = true;
      this.evolvesTo.push("sirfetchd");
    } else if (speciesName === "mr") {
      this.evolutionChain = {};
      this.evolves = true;
      this.evolvesTo.push("mr-rime");
    } else if (speciesName === "corsola") {
      this.evolutionChain = {};
      this.evolves = true;
      this.evolvesTo.push("cursola");
    } else if (speciesName === "linoone") {
      this.evolutionChain = {};
      this.evolves = true;
      this.evolvesTo.push("obstagoon");
    } else if (speciesName === "yamask") {
      this.evolutionChain = {};
      this.evolves = true;
      this.evolvesTo.push("runerigus");
    } else if (
      speciesName === "ponyta" ||
      speciesName === "zigzagoon" ||
      speciesName === "darumaka"
    ) {
      const index = constants.galarianVariants.indexOf(speciesName);
      this.evolutionChain = {};
      this.evolves = true;
      this.evolvesTo.push(constants.galarianVariants[index + 1] + "-galar");
    }
  }

  getPokemonData(pokemon: string) {
    this.types = [];

    if (pokemon === "darmanitan-galar") {
      pokemon = "darmanitan-standard-galar";
    }

    service
      .getPokemonData(pokemon)
      .then(res => {
        for (const type of res.data.types) {
          this.types.push(type.type.name);
        }

        if (this.shiny) {
          this.sprite = res.data.sprites.front_shiny;
        } else {
          this.sprite = res.data.sprites.front_default;
        }
      })
      .catch(error => {
        this.$root.$emit(
          "notification",
          "An error occurred getting the pokemon data"
        );
      });
  }

  getPokemonSpecies(pokemonName: string, pokemonNumber: string) {
    service
      .getPokemonSpecies(pokemonNumber)
      .then(res => {
        service
          .getEvolutionChain(res.data.evolution_chain.url)
          .then(res => {
            this.evolutionChain = res.data.chain;
            this.checkChain(pokemonName, res.data.chain);
          })
          .catch(error => {
            this.$root.$emit(
              "notification",
              "An error occurred getting the pokemon evolution chain"
            );
          });
      })
      .catch(error => {
        this.$root.$emit(
          "notification",
          "An error occurred getting the pokemon species"
        );
      });
  }

  checkChain(pokemonName: string, chain: any) {
    if (chain.species.name === pokemonName) {
      if (chain.evolves_to.length > 0) {
        this.evolves = true;

        this.evolvesTo = chain.evolves_to.map((evolution: any) => {
          return evolution.species.name;
        });
      } else {
        this.evolves = false;
        this.evolvesTo = [];
      }
    } else {
      for (const evolution of chain.evolves_to) {
        this.checkChain(pokemonName, evolution);
      }
    }
  }

  evolve(evolvesTo: string) {
    this.species = this.pokemons.find((pokemon: string) => {
      return pokemon.includes(evolvesTo);
    });

    this.selectPokemon(this.species);
  }

  addPokemon() {
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
        obtainedAs: this.species.toLowerCase(),
        original: this.original,
        species: this.species.toLowerCase(),
        sprite: this.sprite,
        types: this.types
      };
    } else {
      const pokemon = this.species.split(" ");
      data = {
        nickname: this.nickname,
        location: this.location,
        obtained: this.obtained,
        number: pokemon[0],
        obtainedAs: pokemon[2],
        original: this.original,
        species: pokemon[2],
        sprite: this.sprite,
        types: this.types
      };
    }

    const userId = this.$store.state.user.id;
    const nuzlockeId = this.nuzlocke._id;
    service
      .addPokemon(userId, nuzlockeId, data)
      .then(res => {
        if (this.nickname === "") {
          const pokemon = this.species.split(" ");
          this.$root.$emit(
            "notification",
            pokemon[2].toUpperCase() + " was added to " + this.nuzlocke.title
          );
        } else {
          this.$root.$emit(
            "notification",
            this.nickname + " was added to " + this.nuzlocke.title
          );
        }
        this.$router.push({ name: "nuzlocke" });
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.$root.$emit("logout");
        } else {
          this.$root.$emit("notification", error.response.data.msg);
        }
      });
  }

  validateData() {
    let valid = true;
    this.speciesError = this.locationError = this.obtainedError = this.numberError = this.originalSpeciesError = this.typesError = false;

    if (!this.original) {
      if (this.species === "" || this.species === undefined) {
        this.speciesError = true;
        valid = false;
      }
    } else {
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

      if (this.types.length === 0) {
        this.typesErrorMsg = "At least one type is required";
        this.typesError = true;
        valid = false;
      } else if (
        this.types.length === 2 &&
        this.firstType === this.secondType
      ) {
        this.typesErrorMsg = "Types must be different";
        this.typesError = true;
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

    if (this.obtained === "not") {
      this.nickname = "";
    }

    return valid;
  }

  selectOriginal(event: any) {
    this.types = [];

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
      const pokemonNumber = +this.species.split(" ")[0].split("#")[1];

      if (pokemonName.includes("alola")) {
        this.getPokemonData(pokemonName);
      } else if (pokemonName.includes("galar")) {
        this.getPokemonData(pokemonName);
      } else if (constants.specialPokemonForms.includes(pokemonName)) {
        this.getPokemonData(pokemonName);
      } else {
        this.getPokemonData(pokemonNumber.toString());
      }
    }
  }

  checkType(type: string, position: number) {
    if (!type) {
      if (this.types.length === 1) {
        this.types = [];
      } else {
        this.types.splice(position, 1);
      }
    } else {
      if (position === 0) {
        if (
          this.types.length === 0 ||
          (this.types.length === 1 && this.secondType !== "")
        ) {
          this.types.unshift(type);
        } else if (
          (this.types.length === 1 && this.secondType === "") ||
          this.types.length === 2
        ) {
          this.types[0] = type;
        }
      } else if (position === 1) {
        if (
          this.types.length === 0 ||
          (this.types.length === 1 && this.firstType !== "")
        ) {
          this.types.push(type);
        } else if (
          (this.types.length === 1 && this.firstType === "") ||
          this.types.length === 2
        ) {
          this.types[0] = type;
        }
      }
    }
  }

  back() {
    this.$router.go(-1);
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

#type-col-left {
  padding: 0 12px 0 0;
}

#type-col-right {
  padding: 0 0 0 12px;
}
</style>
