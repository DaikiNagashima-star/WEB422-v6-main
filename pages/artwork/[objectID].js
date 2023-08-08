import React from "react";
import { useRouter } from "next/router";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ArtworkCardDetail from "@/components/ArtworkCardDetail";

export default function ArtworkById() {
  const router = useRouter();
  const { objectID } = router.query;

  return (
    <Row>
      <Col>
        <ArtworkCardDetail objectID={objectID} />
      </Col>
    </Row>
  );
}
