import { Router } from "express";

import PointsController from "./controllers/pointsController";
import ItemsController from "./controllers/itemsController";
import DefaultController from "./controllers/defaultController";

const routes = Router();

//Controllers
const pointsController = new PointsController();
const itemsController = new ItemsController();
const defaultController = new DefaultController();


//Home
routes.get("/", defaultController.index);

//Items
routes.get("/items", itemsController.index);

//Points
routes.post("/points", pointsController.create);

routes.get("/points", pointsController.index);

routes.get("/points/:id", pointsController.show);

export default routes;
