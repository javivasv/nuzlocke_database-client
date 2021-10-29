import SETTINGS from "../settings";
import { pokeApiBaseUrl } from "../utils/constants";
import axios from "axios";

// LOGIN
export async function login(data: any) {
  let axiosRes = await axios.post(`${SETTINGS.API_BASE_PATH_DEV}/login`, data);
  return axiosRes;
}

// REGISTER
export async function register(data: any) {
  let axiosRes = await axios.post(`${SETTINGS.API_BASE_PATH_DEV}/user`, data);
  return axiosRes;
}

// ABOUT
export async function sendSuggestion(data: any) {
  let axiosRes = await axios.post(
    `${SETTINGS.API_BASE_PATH_DEV}/suggestion`,
    data
  );
  return axiosRes;
}

// NUZLOCKES
export async function getNuzlockes(userId: string) {
  let axiosRes = await axios.get(
    `${SETTINGS.API_BASE_PATH_DEV}/user/${userId}/nuzlockes`,
    {
      headers: {
        authorization: localStorage.getItem("pndb_jwt")
      }
    }
  );

  return axiosRes;
}

export async function deleteNuzlocke(userId: string, nuzlockeId: string) {
  let axiosRes = await axios.delete(
    `${SETTINGS.API_BASE_PATH_DEV}/user/${userId}/nuzlocke/${nuzlockeId}`,
    {
      headers: {
        authorization: localStorage.getItem("pndb_jwt")
      }
    }
  );

  return axiosRes;
}

// ADD NUZLOCKE
export async function createNuzlocke(userId: string, data: any) {
  let axiosRes = await axios.post(
    `${SETTINGS.API_BASE_PATH_DEV}/user/${userId}/nuzlocke`,
    data,
    {
      headers: {
        authorization: localStorage.getItem("pndb_jwt")
      }
    }
  );

  return axiosRes;
}

// NUZLOCKE
export async function getNuzlocke(userId: string, nuzlockeId: string) {
  let axiosRes = await axios.get(
    `${SETTINGS.API_BASE_PATH_DEV}/user/${userId}/nuzlocke/${nuzlockeId}`,
    {
      headers: {
        authorization: localStorage.getItem("pndb_jwt")
      }
    }
  );

  return axiosRes;
}

export async function changeNuzlockeStatus(
  userId: string,
  nuzlockeId: string,
  data: any
) {
  let axiosRes = await axios.put(
    `${SETTINGS.API_BASE_PATH_DEV}/user/${userId}/nuzlocke/${nuzlockeId}`,
    data,
    {
      headers: {
        authorization: localStorage.getItem("pndb_jwt")
      }
    }
  );

  return axiosRes;
}

export async function changePokemonStatus(
  userId: string,
  nuzlockeId: string,
  pokemonId: string
) {
  let axiosRes = await axios.put(
    `${SETTINGS.API_BASE_PATH_DEV}/user/${userId}/nuzlocke/${nuzlockeId}/pokemon/${pokemonId}`,
    null,
    {
      headers: {
        authorization: localStorage.getItem("pndb_jwt")
      }
    }
  );

  return axiosRes;
}

export async function deletePokemon(
  userId: string,
  nuzlockeId: string,
  pokemonId: string
) {
  let axiosRes = await axios.delete(
    `${SETTINGS.API_BASE_PATH_DEV}/user/${userId}/nuzlocke/${nuzlockeId}/pokemon/${pokemonId}`,
    {
      headers: {
        authorization: localStorage.getItem("pndb_jwt")
      }
    }
  );

  return axiosRes;
}

// ADD POKEMON
export async function getPokemon() {
  let axiosRes = await axios.get(`${pokeApiBaseUrl}/pokemon/?limit=898`);
  return axiosRes;
}

export async function getLocations(region: string) {
  let axiosRes = await axios.get(`${pokeApiBaseUrl}/region/` + region);
  return axiosRes;
}

export async function getPokemonSprite(pokemonName: string) {
  let axiosRes = await axios.get(`${pokeApiBaseUrl}/pokemon/` + pokemonName);
  return axiosRes;
}

export async function addPokemon(
  userId: string,
  nuzlockeId: string,
  data: any
) {
  let axiosRes = await axios.post(
    `${SETTINGS.API_BASE_PATH_DEV}/user/${userId}/nuzlocke/${nuzlockeId}/pokemon`,
    data,
    {
      headers: {
        authorization: localStorage.getItem("pndb_jwt")
      }
    }
  );
  return axiosRes;
}
