import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { authenticateUser } from "@/lib/authenticate";
import { favouritesAtom, searchHistoryAtom } from "@/store";
import { getHistory, getFavourites } from "@/lib/userData";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ user: "", password: "" });
  const [warning, setWarning] = useState("");
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { user, password } = formData;

    try {
      await authenticateUser(user, password);
      await updateAtoms();
      setWarning("");
      router.push("/favourites");
    } catch (err) {
      setWarning(err.message);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.currentTarget;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <Card bg="light">
        <Card.Body>
          <h2>Login</h2>
          <p>Enter your login information below:</p>
          {warning && <Alert variant="danger">{warning}</Alert>}
        </Card.Body>
      </Card>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>User:</Form.Label>
          <Form.Control
            type="text"
            name="user"
            value={formData.user}
            onChange={handleInputChange}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </Form.Group>
        <br />
        <Button variant="dark" className="pull-right" type="submit">
          Login
        </Button>
        <br />
        <br />
        <p className="form-text">
          Don&lsquo;t have an account? <Link href="/register">Sign up</Link>
        </p>
      </Form>
    </>
  );
}
