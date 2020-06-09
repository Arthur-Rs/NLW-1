import Knex from "../database/connection";
import { Response, Request } from "express";

class pointsController {
  async create(req: Request, res: Response) {
    //Get values for request
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    //Create Object data
    const data = {
      image:
        "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const trx = await Knex.transaction();

    //Insert values from table "points"
    const insertId = await trx("points").insert(data);

    //Get Id from INSERT
    const id_point = insertId[0];

    //Get Items from new point
    const itemsPoint = items.map((id_item: number) => {
      return {
        id_point,
        id_item,
      };
    });

    //Insert values from table "items_points"
    await trx("items_points").insert(itemsPoint);

    trx.commit();

    return res.json({ sucess: "dados adicionados com sucesso!", data });
  }

  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await Knex("points")
      .join("items_points", "points.id", "=", "items_points.id_point")
      .whereIn("items_points.id_item", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return res.json({ points });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await Knex("points").where("id", id).first();

    const items = await Knex("items")
      .join("items_points", "items.id", "=", "items_points.id_item")
      .where("items_points.id_point", id);

    if (!point) {
      return res.status(404).json({ alert: "Point not found" });
    }

    return res.json({ point, items });
  }
}

export default pointsController;
