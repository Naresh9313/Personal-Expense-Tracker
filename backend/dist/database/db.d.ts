import "dotenv/config";
import { Pool } from "pg";
declare const pool: Pool;
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, never>> & {
    $client: Pool;
};
export default pool;
//# sourceMappingURL=db.d.ts.map