import request from "supertest";
import { app } from "../../app";

it("throws a 400 status if user is not found", async () => {
  request(app)
    .post("/api/users/signIn")
    .send({
      email: "thisdefinitelydoesnotexist@gmail.com",
      password: "fakepassword",
    })
    .expect(400);
});

it("throws 400 is user exists but password is incorrect", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signIn")
    .send({
      email: "test@test.com",
      password: "passwordwrong",
    })
    .expect(400);
});

it("responds with 200 and cookies exists if credentials are valid", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signIn")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
