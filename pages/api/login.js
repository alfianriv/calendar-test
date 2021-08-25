import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        let data = JSON.parse(req.body)
        if (!data.username || !data.password) {
            return res.json({
                success: false,
                message: 'Username and password cannot be empty'
            });
        }
        let doc = await prisma.user.findUnique({
            where: {
                username: data.username
            }
        })

        if (!doc) {
            return res.json({
                success: false,
                message: 'Username not registered'
            });
        }
        bcrypt.compare(data.password, doc.password).then(function (result) {
            if (result) {
                return res.json({
                    success: true,
                    data: {
                        token: jwt.sign({id: doc.id, username: doc.username}, 'secret'),
                        ...doc
                    }
                })
            }
            return res.json({
                success: false,
                message: 'Username and password not match'
            })
        });
    } else {
        res.status(422).send('req_method_not_supported');
    }
}

export default handler;