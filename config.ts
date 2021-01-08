/*import { config } from 'https://deno.land/x/dotenv/mod.ts';

const dbConn = {
    user: config().DB_USER,
    database: config().DB_NAME,
    password: config().DB_PASSWORD,
    hostname: config().DB_HOSTNAME,
    port: parseInt(config().DB_PORT)
};*/

const dbConn = {
    user: "medlotf",
    database: "denoapi",
    password: "JamaaFadma5+",
    hostname: "localhost",
    port: 5432
};

export { dbConn } 