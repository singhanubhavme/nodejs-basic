import pg from "pg";

const client = new pg.Client({
  connectionString:
    process.env.POSTGRES_URI_LOCAL || process.env.POSTGRES_URI_CLOUD,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default client;
