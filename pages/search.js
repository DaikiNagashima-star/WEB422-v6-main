import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Form, Col, Row, Button } from "react-bootstrap";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";

export default function AdvancedSearch() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const defaultFormData = {
    q: "",
    searchBy: "title",
    geoLocation: "",
    medium: "",
    isOnView: false,
    isHighlight: false,
  };

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormData,
  });

  useEffect(() => {
    for (const prop in defaultFormData) {
      setValue(prop, defaultFormData[prop]);
    }
  });

  async function submitForm(data) {
    const queryParams = new URLSearchParams();

    queryParams.append(data.searchBy, "true");
    queryParams.append("isOnView", data.isOnView);
    queryParams.append("isHighlight", data.isHighlight);
    queryParams.append("q", data.q);

    if (data.geoLocation) {
      queryParams.append("geoLocation", data.geoLocation);
    }

    if (data.medium) {
      queryParams.append("medium", data.medium);
    }

    const queryString = queryParams.toString();

    setSearchHistory(await addToHistory(queryString));
    router.push(`/artwork?${queryString}`);
  }

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Search Query</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="q"
              isInvalid={errors.q}
              {...register("q", { required: true })}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Label>Search By</Form.Label>
          <Form.Select
            name="searchBy"
            className="mb-3"
            {...register("searchBy")}
          >
            <option value="title">Title</option>
            <option value="tags">Tags</option>
            <option value="artistOrCulture">Artist or Culture</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="geoLocation"
              {...register("geoLocation")}
            />
            <Form.Text className="text-muted">
              Case Sensitive String, with multiple values separated by the |
              operator
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="medium"
              {...register("medium")}
            />
            <Form.Text className="text-muted">
              Case Sensitive String, with multiple values separated by the |
              operator
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Check
            type="checkbox"
            label="Highlighted"
            name="isHighlight"
            {...register("isHighlight")}
          />
          <Form.Check
            type="checkbox"
            label="Currently on View"
            name="isOnView"
            {...register("isOnView")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <br />
          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
