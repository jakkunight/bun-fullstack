import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const getUserById = async (params:any) => {
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
};

export const signupUser = async (body:any, request:any) => {
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
};
