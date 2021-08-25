import bcrypt from 'bcrypt';
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
        if (doc) {
            return res.json({
                success: false,
                message: 'Username already registered'
            });
        }
        bcrypt.hash(data.password, 10, async function (err, hash) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Something wrong'
                });
            }

            if (hash) {
                let insertData = {
                    username: data.username,
                    password: hash
                }
                let user = await prisma.user.create({
                    data: insertData
                })
                return res.json({
                    success: true,
                    message: 'Success registered'
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