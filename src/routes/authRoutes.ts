import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { Router } from "express";

const router = Router()
const prisma = new PrismaClient()

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = 'SUPER_SECRET' //

function generateEmailToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();

}

function genearteAuthToken(tokenId: number): string {
    const jwtPayload = { tokenId }

    return jwt.sign(jwtPayload, JWT_SECRET, {
        algorithm: 'HS256',
        noTimestamp: true,
    })
}



//create a user ,if it doesnt exist
//generate the emailtaken and send it to their email
router.post('/login', async (req, res) => {

    const { email } = req.body;
    //generate token
    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000)

    try {
        const createdToken = await prisma.token.create({
            data: {
                type: 'EMAIL',
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: { email },
                    }
                }
            }
        })
        console.log(createdToken);
        //send emailtoken to user's email--------->
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "couldn't start the authentication process " })
    }

})

//validate the emailToken------>
//generate a long-lived jwt token--------->
router.post('/authenticate', async (req, res) => {
    const { email, emailToken } = req.body;
    console.log(email, emailToken);

    const dbEmailToken = await prisma.token.findUnique({
        where: { emailToken, },
        include: { user: true }
    });


    console.log(dbEmailToken);
    if (!dbEmailToken || !dbEmailToken.valid) { return res.sendStatus(401) }


    if (dbEmailToken.expiration < new Date()) {
        return res.status(401).json({ error: "Token expired!" })
    }

    if (dbEmailToken?.user?.email !== email) {
        return res.sendStatus(401)
    }

    //now we sure user is the owner of email-->

    //genrate an api token------>
    const expiration = new Date(
        new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
    );

    const apiToken = await prisma.token.create({
        data: {
            type: 'API',
            expiration,
            user: {
                connect: {
                    email,
                }
            }
        },
    })
    //validate the token------>
    await prisma.token.update({
        where: { id: dbEmailToken.id },
        data: { valid: false },
    })

    //generate the jwt token---->
    const authToken = genearteAuthToken(apiToken.id)

    res.json({ authToken });
})

export default router;