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

/**
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

    return c.json(result);
  } catch (error) {
    return c.json(error);
  }
});

export default app;