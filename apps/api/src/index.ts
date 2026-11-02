import express from "express";
import { env } from "./env.js";

const app = express();

app.use(express.json());

app.listen(env.PORT, () => {
  console.log(`API escuchando en http://localhost:${env.PORT}`);
});
