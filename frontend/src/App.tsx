import "./App.css";
import { useState } from "react";
import { Form, Container, Button, Header } from "semantic-ui-react";
import axios from "axios";

export const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    city: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/createUser",
        formData
      );
      if (response.status === 201) {
        console.log("User created successfully");
      } else {
        console.error("Failed to create user");
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <Container className="form-container">
        <Form onSubmit={handleSubmit} size="small">
          <Form.Field width={6}>
            <Header as="h1">Create User</Header>
          </Form.Field>
          <Form.Field width={6}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field width={6}>
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field width={6}>
            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field width={6}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field width={6}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field width={6}>
            <Button>Create User</Button>
          </Form.Field>
        </Form>
      </Container>
    </>
  );
};
