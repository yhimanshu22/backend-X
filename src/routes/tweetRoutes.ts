import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { toUSVString } from "util";

const router = Router()
const prisma = new PrismaClient();

// create Tweet --------->

router.post('/', async (req, res) => {
    const { content, image, userId } = req.body;
    try {
        // Create the tweet in the database
        const createTweet = await prisma.tweet.create({
            data: { content, image, userId }
        });

        // Send the created tweet in the response
        return res.json(createTweet);
    } catch (error) {
        // Handle errors
        console.error("Error creating tweet:", error);
        return res.status(500).json({ error: "Failed to create tweet" });
    }
});


// list Tweets------>

router.get('/', async (req, res) => {
    const allTweets = await prisma.tweet.findMany({
        include: { user: { select: { id: true, name: true, username: true, image: true } } },
        /*select: {
            id: true,
            content: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                }
            }
        }*/
    });
    res.json(allTweets)
})

// get one tweet by id-------->

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const getTweetById = await prisma.tweet.findUnique({ where: { id: Number(id) } })

    if (!getTweetById) { return res.status(404).json({ error: "tweet not found" }) }

    return res.json(getTweetById)
})

// update tweet ---------->

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { content, image, userId } = req.body;
    const existingTweet = await prisma.tweet.findUnique({ where: { id: parseInt(id) } });

    try {
        if (!existingTweet) { return res.status(404).json({ message: "tweet not found" }) };

        //update the tweet in the database------->
        const updateTweet = await prisma.tweet.update({
            where: { id: parseInt(id) },
            data: { content, image, userId }
        });

        //send the updated tweet in the database------>
        res.json(updateTweet);
    } catch (e) {
        console.error("error in updating tweet", e);
        res.status(500).json({ error: 'Failed to update tweet' })
    }

})

//delete tweet
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the tweet exists
        const existingTweet = await prisma.tweet.findUnique({ where: { id: parseInt(id) } });
        if (!existingTweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }

        // Delete the tweet from the database
        await prisma.tweet.delete({ where: { id: parseInt(id) } });

        // Send a success response
        res.sendStatus(200);
    } catch (error) {
        // Handle errors
        console.error("Error deleting tweet:", error);
        res.status(500).json({ error: "Failed to delete tweet" });
    }
});


export default router;