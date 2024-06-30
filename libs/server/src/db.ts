import { createClient } from "@supabase/supabase-js";

export default class Db {
  private _client: ReturnType<typeof createClient> | undefined = undefined;
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseKey) {
      throw new Error("No SUPABASE_SERVICE_ROLE_KEY found");
    }

    if (!supabaseUrl) {
      throw new Error("No SUPABASE_URL found");
    }

    console.log("Initializing database client...");
    this._client = createClient(supabaseUrl, supabaseKey);
  }

  get client() {
    if (!this._client) {
      throw new Error("No DB client found");
    }
    return this._client;
  }
}
