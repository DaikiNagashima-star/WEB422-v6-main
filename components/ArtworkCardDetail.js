import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { Button, Card } from "react-bootstrap";
import Error from "next/error";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";

export default function ArtworkCardDetail(props) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  const { data, error } = useSWR(
    props.objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`
      : null
  );

  useEffect(() => {
    setShowAdded(favouritesList?.includes(props.objectID));
  }, [favouritesList, props.objectID]);

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  async function handleFavouritesClick() {
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(props.objectID));
    } else {
      setFavouritesList(await addToFavourites(props.objectID));
    }
  }
  return (
    <Card>
      {data.primaryImageSmall && (
        <Card.Img variant="top" src={data.primaryImage} />
      )}
      <Card.Body>
        <Card.Title>{data.title || "N/A"}</Card.Title>
        <Card.Text>
          <b>Date:</b> {data.objectDate || "N/A"}
          <br />
          <b>Classification:</b> {data.classification || "N/A"}
          <br />
          <b>Medium:</b> {data.medium || "N/A"}
          <br />
          <br />
          <b>Artist:</b> {data.artistDisplayName || "N/A"} ({" "}
          {data.artistDisplayName && (
            <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer">
              wiki
            </a>
          )}{" "}
          )
          <br />
          <b>Credit Line:</b> {data.creditLine || "N/A"}
          <br />
          <b>Dimensions:</b> {data.dimensions || "N/A"}
          <br />
        </Card.Text>
        <Button
          variant={showAdded ? "secondary" : "outline-secondary"}
          onClick={handleFavouritesClick}
        >
          {showAdded ? "+ Favourite (added)" : "+ Favourite"}
        </Button>
      </Card.Body>
    </Card>
  );
}
