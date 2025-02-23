import { beforeAll, beforeEach, afterAll } from "@jest/globals";
import db from "./db/db";

beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
});

beforeEach(async () => {

});

afterAll(async () => {
    await db.destroy();
});