import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Row, Col, Card, Pagination } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";
import Error from "next/error";
import validObjectIDList from "@/public/data/validObjectIDList.json";

const PER_PAGE = 12;

export default function Artwork() {
  const { asPath } = useRouter();
  const [artworkList, setArtworkList] = useState([]);
  const [page, setPage] = useState(1);

  const finalQuery = asPath.split("?")[1];
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`
  );

  useEffect(() => {
    if (data) {
      const filteredResults = validObjectIDList.objectIDs.filter((id) =>
        data.objectIDs.includes(id)
      );

      const paginatedResults = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        paginatedResults.push(filteredResults.slice(i, i + PER_PAGE));
      }

      setArtworkList(paginatedResults);
      setPage(1);
    }
  }, [data]);

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  const artworksToShow = artworkList[page - 1] || [];

  return (
    <>
      <Row className="gy-4">
        {artworksToShow.length ? (
          artworksToShow.map((id) => (
            <Col lg={3} key={id}>
              <ArtworkCard objectID={id} />
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <h4>Nothing Here</h4>
                Try searching for something else.
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      {artworksToShow.length > 0 && (
        <Row>
          <Col>
            <Pagination>
              <Pagination.Prev onClick={() => setPage(Math.max(1, page - 1))} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next
                onClick={() => setPage(Math.min(artworkList.length, page + 1))}
              />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
}
