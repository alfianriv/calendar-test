import moment from 'moment';
import {
    verifyToken
} from '../../lib/utils';
import prisma from '../../lib/prisma';


const handler = async (req, res) => {
    if (req.method === 'GET') {
        let {
            query,
        } = req;
        if (!query.hyperlink) {
            return res.json({
                success: false,
                message: "Hyperlink is required",
            });
        }
        let doc = await prisma.calendar.findFirst({
            where: {
                hyperlink: query.hyperlink,
            },
            include: {
                events: true
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