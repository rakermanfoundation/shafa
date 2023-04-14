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
import faunadb from "faunadb";

const faunaClient = new faunadb.Client({
  secret: "fnAFBYEXE-AAUG-ngNcv0DP_Qs36eKVqCi3zBrLc",
});
const { Call, Function } = faunadb.query;

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", prettyJSON());

app.get("/", (c) => c.text("Shafa API v1.0.0"));


/*
 * GET /items/:type
 *
 * requests items of specific type for given user
 * only returns active items
 *
 * @path_param {string} type - type of item (bottom/top/layer/shoes/etc)
 * @path_query {string} user - unique username
 *
 * @returns    {json}:
 * "data" : [
 *  "data": {
 *        "user": string,
 *        "uuid": string,
 *        "type": string,
 *        "subtype": string,
 *        ...
 *    }
 * ]
 * ...
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


/*
 * DELETE /item/archive
 *
 * soft delete of the item from the database
 *
 * @path_query {string} user - unique username
 * @path_query {string} uuid - unique item id
 *
 * @returns    {json}
 * ...
 */
app.delete('/item/archive', async (c) => {
    try {
        // get user id and item id
        const { uuid, user } = c.req.query();
        // query database
        const result = await faunaClient.query(
            Call(Function("archiveItem"), user, uuid)
        )
        // return confirmation
        return c.json(result);
    } catch(error) {
        // something went wrong
        return c.json(error);
    }
});


/*
 * DELETE /item/remove
 *
 * permanent delete of the item from the database
 *
 * @path_query {string} user - unique username
 * @path_query {string} uuid - unique item id
 *
 * @returns    {json}
 * ...
 */
app.delete('/item/remove', async (c) => {
    try {
        // get user id and item id
        const { uuid, user } = c.req.query();
        // query database
        const result = await faunaClient.query(
            Call(Function("removeItem"), user, uuid)
        )
        // return confirmation
        return c.json(result);
    } catch (error) {
        return c.json(error)
    }
});

export default app;