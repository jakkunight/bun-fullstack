import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { getUserById, signupUser } from "./controllers/users";

const app = new Elysia();
app.use(staticPlugin());
app.get("/users/:id", async ({ params }) => getUserById(params));
app.post("/users/", async ({ body, request }) => signupUser(body, request), {
	body: t.Object({
		name: t.String(),
		email: t.String(),
		currency: t.String(),
		password: t.String(),
		balance: t.Union([
			t.Number(),
			t.String()
		]),
		devices: t.String()
	})
});

app.listen(process.env.PORT || 3000);
console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
