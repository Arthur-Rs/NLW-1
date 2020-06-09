import { Response, Request } from "express";

export default class defaultController {
  index(req: Request, res: Response) {
    const HTML =
      "<h1>API Ecoleta</h1><br><h2>URL's</h2><ul><li>/points<li>/items</li><ul>";
    return res.send(HTML);
  }
}
