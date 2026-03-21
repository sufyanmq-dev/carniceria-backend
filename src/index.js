import "dotenv/config";

import express, { json } from "express";

import configureSecurityMiddleware from "./config/security";

const API_PORT = process.env.API_PORT;

const app = express();

configureSecurityMiddleware(app);

app.use(json());

app.get("/", (req, res) => {
  res.json({ message: "Carniceria API running" });
});

app.listen(API_PORT, () => {
  console.log(`> [:${API_PORT}] Server listening 🚀`);
});
