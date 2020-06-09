import path from "path";
import express from "express";
import cors from "cors";

import routes from "./routes";

const PORT = 3333;

const app = express();

app.use(cors());

app.use(express.json());

app.use("/upload", express.static(path.resolve(__dirname, "..", "uploads")));

app.use(routes);

app.listen(PORT);
