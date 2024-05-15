import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

// Create Tweet
router.post('/', async (req, res) => {
    const { content, image } = req.body;
    //@ts-ignore
    const userId = req.user.id;

    try {
        const createTweet = await prisma.tweet.create({
            data: { content, image, userId: userId }
        });
        return res.status(201).json(createTweet);
    } catch (error) {
        console.error("Error creating tweet:", error);
        return res.status(500).json({ error: "Failed to create tweet" });
    }
});

// List Tweets
router.get('/', async (req, res) => {
    try {
        const allTweets = await prisma.tweet.findMany({
            include: { user: { select: { id: true, name: true, username: true, image: true } } }
        });
        res.json(allTweets);
    } catch (error) {
        console.error("Error listing tweets:", error);
        res.status(500).json({ error: "Failed to list tweets" });
    }
});

// Get One Tweet by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const getTweetById = await prisma.tweet.findUnique({ where: { id: Number(id) } });
        if (!getTweetById) return res.status(404).json({ error: "Tweet not found" });
        return res.json(getTweetById);
    } catch (error) {
        console.error("Error getting tweet by ID:", error);
        res.status(500).json({ error: "Failed to get tweet by ID" });
    }
});

// Update Tweet
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { content, image } = req.body;
    //@ts-ignore
    const userId = req.user.id;

    try {
        const existingTweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });
        if (!existingTweet) return res.status(404).json({ message: "Tweet not found" });

        const updateTweet = await prisma.tweet.update({
            where: { id: Number(id) },
            data: { content, image, userId }
        });
        res.json(updateTweet);
    } catch (error) {
        console.error("Error updating tweet:", error);
        res.status(500).json({ error: "Failed to update tweet" });
    }
});

// Delete Tweet
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const existingTweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });
        if (!existingTweet) return res.status(404).json({ error: "Tweet not found" });

        await prisma.tweet.delete({ where: { id: Number(id) } });
        res.sendStatus(200);
    } catch (error) {
        console.error("Error deleting tweet:", error);
        res.status(500).json({ error: "Failed to delete tweet" });
    }
});

export default router;
