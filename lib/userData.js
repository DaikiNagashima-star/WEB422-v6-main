import { getToken } from "./authenticate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchData(endpoint, method = "GET", id = null) {
  const token = getToken();
  const url = id ? `${API_URL}/${endpoint}/${id}` : `${API_URL}/${endpoint}`;

  const response = await fetch(url, {
    method: method,
    headers: {
      "content-type": "application/json",
      Authorization: `JWT ${token}`,
    },
  });

  const data = await response.json();

  return response.status === 200 ? data : [];
}

export function addToFavourites(id) {
  return fetchData("favourites", "PUT", id);
}

export function removeFromFavourites(id) {
  return fetchData("favourites", "DELETE", id);
}

export function getFavourites() {
  return fetchData("favourites");
}

export function addToHistory(id) {
  return fetchData("history", "PUT", id);
}

export function removeFromHistory(id) {
  return fetchData("history", "DELETE", id);
}

export function getHistory() {
  return fetchData("history");
}
