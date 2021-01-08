import { Application } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import router from "./routes/routes.ts";

const port = 7000;
const app= new Application();

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Server is running on port ${port}`);

await app.listen({ port: +port });