import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const app = new Elysia();
app.use(staticPlugin());
app.get("/users/:id", async ({ params }) => {
	try{
		const {
			id,
			name,
			email,
			balance,
			currency
		} = await db.user.findUniqueOrThrow({
			where: {
				id: Number(params.id)
			}
		});
		return {
			id,
			name,
			email,
			balance: Number(balance),
			currency
		};
	}catch(err){
		console.log(err);
		return err;
	}
});
app.post("/users/", async ({ body, request }) => {
	try{
		body.devices = request.headers.get("origin") || "";
		body.password = await Bun.password.hash(body.password);
		body.balance = Number(body.balance);

		const result = db.user.create({
			data: body as any
		});
		return result;
	}catch(err){
		return err;
	}
}, {
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
