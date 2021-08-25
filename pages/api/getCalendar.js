import moment from 'moment';
import {
    verifyToken
} from '../../lib/utils';
import prisma from '../../lib/prisma';


const handler = async (req, res) => {
    if (req.method === 'GET') {
        let {
            query,
            cookies
        } = req;
        if (!query.date) {
            return res.json({
                success: false,
                message: "Date is required",
            });
        }
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
        let doc = await prisma.calendar.findFirst({
            where: {
                date: {
                    gte: new Date(moment(query.date)),
                    lt: new Date(moment(query.date).add(1, "days")),
                },
                userId: profile.id
            }
        })
        res.json({
            success: true,
            data: doc
        });
    } else {
        res.status(422).send('req_method_not_supported');
    }

}

export default handler;