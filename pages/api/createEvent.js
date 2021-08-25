import moment from "moment";
import { verifyToken } from "../../lib/utils";
import prisma from "../../lib/prisma";

const handler = async (req, res) => {
	if (req.method === "POST") {
		let { body } = req;
		let data = JSON.parse(body);
		let doc = await prisma.event.create({
			data: {
				event: data.event,
				calendarId: data.calendarId,
			},
		});
		return res.json({
			success: true,
			data: doc,
		});
	} else {
		res.status(422).send("req_method_not_supported");
	}
};

export default handler;
