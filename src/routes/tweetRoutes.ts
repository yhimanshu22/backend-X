import { Router } from "express";

const router = Router()

//tweet crud
router.post('/', (req, res) => {
    res.status(501).json({ error: 'not inplemented' })
})

//list tweets
router.get('/', (req, res) => {
    res.status(501).json({ error: 'not inplemented' })
})

//get one tweet
router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.status(501).json({ error: `not inplemented ${id}` })
})

//update tweet
router.put('/:id', (req, res) => {
    const { id } = req.params;
    res.status(501).json({ error: `not implemented ${id}` })
})

//delete tweet
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    res.status(501).json({ error: `not implemented ${id}` })
})

export default router;