import { AppSingleton } from "./App";
import { readdirSync } from "fs";

const app = AppSingleton.instance.app;

for (const filePath of readdirSync("./routes")) {
  require("./routes/" + filePath);
}

app.listen({ port: 3000, host: "0.0.0.0" });
