import { AppSingleton } from "./App";
import { readdirSync } from "fs";
import { join } from "path";

const app = AppSingleton.instance.app;

for (const filePath of readdirSync(join(__dirname, "routes"))) {
  require(join(__dirname, "routes", filePath));
}

app.listen({ port: 3000, host: "0.0.0.0" });
