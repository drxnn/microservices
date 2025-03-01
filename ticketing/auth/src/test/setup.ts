import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { ConnectOptions } from "mongoose";
import { app } from "../app";

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "somestring"; // just for right now

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if (collections)
    for (let collection of collections) {
      await collection.deleteMany({});
    }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
