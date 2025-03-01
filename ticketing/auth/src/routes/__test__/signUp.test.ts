import request from "supertest";
import { app } from "../../app";

it("it returns a 201 on successful signUp", async () => {
  return request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signUp")
    .send({
      email: "testinvalid.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with a missing email and password", async () => {
  return request(app).post("/api/users/signUp").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
