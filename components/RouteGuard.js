import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { favouritesAtom, searchHistoryAtom } from "@/store";
import { getFavourites, getHistory } from "@/lib/userData";
import { isAuthenticated } from "@/lib/authenticate";

const PUBLIC_PATHS = ["/register", "/login", "/", "/_error"];

export default function RouteGuard(props) {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [authorized, setAuthorized] = useState(false);

  async function updateAtoms() {
    setSearchHistory(await getHistory());
    setFavouritesList(await getFavourites());
  }

  useEffect(() => {
    updateAtoms();
    authorizeCheck(router.pathname);
    router.events.on("routeChangeDone", authorizeCheck);
    return () => {
      router.events.off("routeChangeDone", authorizeCheck);
    };
  }, []);

  function authorizeCheck(url) {
    const path = url.split("?")[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false);
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }

  return <>{authorized && props.children}</>;
}

// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { useAtom } from "jotai";
// import {
//   isAuthenticatedAtom,
//   favouritesAtom,
//   searchHistoryAtom,
// } from "../store";
// import { getFavourites, getHistory } from "../lib/userData";

// const PUBLIC_PATHS = ["/login", "/", "/_error", "/register"];

// function RouteGuard(props) {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
//   const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
//   const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

//   useEffect(() => {
//     async function updateAtoms() {
//       if (isAuthenticated) {
//         setFavouritesList(await getFavourites());
//         setSearchHistory(await getHistory());
//       }
//     }

//     updateAtoms();
//   }, [isAuthenticated, setFavouritesList, setSearchHistory]);

//   useEffect(() => {
//     const isPublicPath = PUBLIC_PATHS.includes(router.pathname);
//     if (!isAuthenticated && !isPublicPath) {
//       router.push("/login");
//     }
//   }, [isAuthenticated, router]);

//   return <>{isAuthenticated && props.children}</>;
// }

// export default RouteGuard;
