import Knex from "../database/connection";
import { Response, Request } from "express";

export default class itemsController {
  async index(req: Request, res: Response) {
    const items = await Knex("items").select("*");

    const serializedItems = items.map((items) => {
      return {
        ...items,
        image_url: `http://localhost:3333/upload/${items.image}`,
      };
    });
    return res.json(serializedItems);
  }
}
