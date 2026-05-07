
import session, { Store } from "express-session";
import connectPg from "connect-pg-simple";
import { config } from "../config/index.js";

const PgStore = connectPg(session);

const sessionStore: Store = new PgStore({
  conString: config.NEON_DB,
  createTableIfMissing: true,
  ttl: 60 * 60 * 24,
});

export default sessionStore;
