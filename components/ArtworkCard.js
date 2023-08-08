import React from "react";
import Link from "next/link";
import { Button, Card } from "react-bootstrap";
import useSWR from "swr";
import Error from "next/error";

export default function ArtworkCard({ objectID }) {
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  return (
    <Card>
      <Card.Img
        variant="top"
        src={
          data.primaryImageSmall ||
          "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"
        }
      />
      <Card.Body>
        <Card.Title>{data.title || "N/A"}</Card.Title>
        <Card.Text>
          <b>Date:</b> {data.objectDate || "N/A"}
          <br />
          <b>Classification:</b> {data.classification || "N/A"}
          <br />
          <b>Medium:</b> {data.medium || "N/A"}
        </Card.Text>
        <Link href={`/artwork/${objectID}`} passHref>
          <Button variant="secondary">
            <b>ID: </b>
            {objectID}
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
