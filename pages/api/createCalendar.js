import moment from "moment";
import { verifyToken } from "../../lib/utils";
import prisma from "../../lib/prisma";

const handler = async (req, res) => {
	if (req.method === "POST") {
		let { body, cookies } = req;
		let data = JSON.parse(body);
		if (!cookies || !cookies.token) {
			return res.json({
				success: false,
				message: "Unathorized",
			});
		}
		let profile = verifyToken(cookies.token) || "";
		if (!profile) {
			return res.json({
				success: false,
				message: "Token invalid",
			});
		}
		let doc = await prisma.calendar.create({
			data: {
				hyperlink: data.hyperlink,
				date: new Date(data.date),
				userId: profile.id,
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
