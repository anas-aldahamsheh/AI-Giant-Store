// Simulation of ORM / DB Layer
export type DbConnection = {
  connected: boolean;
  driver: "sqlite" | "postgres" | "memory";
  host: string;
};

export const db = {
  async connect(): Promise<DbConnection> {
    // Simulated connection latency
    await new Promise((r) => setTimeout(r, 50));
    return {
      connected: true,
      driver: "sqlite",
      host: "local.db",
    };
  },

  async runMigrations() {
    console.log("[Database] Running schema migrations...");
    return ["0001_create_users_table", "0002_create_products_table", "0003_create_orders_table"];
  },

  async seedData() {
    return {
      insertedProducts: 0,
      timestamp: new Date().toISOString(),
    };
  },
};
