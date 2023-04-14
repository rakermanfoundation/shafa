/*
 * Shafa Hono.js Backend
 *
 * Wildhacks Demo Project, April 2023
 *
 * Radison Akerman, Leeza Andryushchenko
 * Richard Yang, Sengdao Inthavong
 */

import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import * as jose from "jose";
import { Bindings } from "hono/dist/types/types";
import faunadb from "faunadb";

const faunaClient = new faunadb.Client({
  secret: "fnAFBYEXE-AAUG-ngNcv0DP_Qs36eKVqCi3zBrLc",
});
const { Call, Function, Paginate, Match, Index, Lambda, Get, Var, Map } =
  faunadb.query;

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", prettyJSON());

app.get("/", (c) => c.text("Shafa API v1.0.0"));

/** Leeza
 *  GET handling
 *
 *  handle GET requests from user fetching all items
 *  of specific type
 */

app.get("/items/:type", async (c) => {
    try {
      const type = await c.req.param("type");
      const { user } = await c.req.query();
  
      // try to query the database:
      const result = await faunaClient.query(
        Call(Function("getActiveItemsByType"), user, type)
      );
      // send response:
      return c.json(result);
    } catch (error) {
      // something went wrong
      return c.json(error);
    }
  });

/** Richard
 *  Update item
 *
 *  Calls updateItem function to Update an Item
 */
app.post("/updateItem", async (c) => {
    try {
    // Convert the request body to a JSON object
      const body = await c.req.json();
      console.log(body);
      const result = await faunaClient.query(
        Call(
          Function("updateItem"),
          body.user,
          body.uuid,
          body.desc,
          body.brand,
          body.photo,
          body.primCol,
          body.pattern,
          body.type,
          body.subtype,
          body.style,
          body.rating,
          body.quality
        )
      );
      return c.json(result);
    } catch (error) {
      return c.json(error);
    }
  });

/** Richard
 *  Update Outfit
 *
 *  Calls updateOutfit function to Update an Outfit
 */
  app.post("/updateOutfit", async (c) => {
    try {
    // Convert the request body to a JSON object
      const body = await c.req.json();
      console.log(body);
      const result = await faunaClient.query(
        Call(
          Function("updateItem"),
          body.uuid,
          body.deptno,
          body.dname,
          body.loc,
          body.username,
          body.layer,
          body.top,
          body.bottom,
          body.footwear,
          body.accessories,
          body.rating,
        )
      );
      return c.json(result);
    } catch (error) {
      return c.json(error);
    }
  });






export default app;