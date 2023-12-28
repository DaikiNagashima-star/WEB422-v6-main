import React, { useState } from "react";
import { useRouter } from "next/router";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { registerUser } from "@/lib/authenticate";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    user: "",
    email:"",
    password: "",
    password2: "",
  });
  const [warning, setWarning] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const { user, email, password, password2 } = formData;

    if (password !== password2) {
      setWarning("Passwords do not match");
      return;
    }

    try {
      await registerUser(user, email, password, password2);
      router.push("/login");
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
          <h2>Register</h2>
          <p>Register for an account:</p>
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
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
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
        <Form.Group>
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleInputChange}
          />
        </Form.Group>
        <br />
        <Button variant="dark" className="pull-right" type="submit">
          Register
        </Button>
        <br />
        <br />
        <p className="form-text">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </Form>
    </>
  );
}
