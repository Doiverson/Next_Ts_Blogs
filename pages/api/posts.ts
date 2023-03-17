import { NextApiHandler } from "next";
import { readPostsInfo } from "../../lib/helper";

const handler: NextApiHandler = (req, res) => {
   const { method } = req;

   switch (method) {
     case "GET":
       const data = readPostsInfo();
       return res.json({ postInfo: data });
     default:
       return res.status(404).send("Not Found");
   }
}

export default handler;

/*
* Refs:
* https://abillyz.com/moco/studies/443
* */