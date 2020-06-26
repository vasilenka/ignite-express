import "dotenv/config";
import "reflect-metadata";

import { createConnection } from "typeorm";
import express from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cors from "cors";

export const app = express();

app.disable("x-powered-by");

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", async (req, res) =>
  res.status(200).json({
    hello: "world",
  })
);

export const start = async () => {
  try {
    let connection = await createConnection();
    if (connection) {
      console.log("CONNECTED TO DATABASE");
    }

    app.listen(5000, () => {
      console.log(`REST API on http://localhost:${5000}`);
    });
  } catch (e) {
    console.error("ERROR INITIALIZING APP: ", e);
  }
};
