import { Router } from "express";

const router = Router()

//user crud
router.post('/', (req, res) => {
    res.status(501).json({ error: 'not inplemented' })
})

//list users
router.get('/', (req, res) => {
    res.status(501).json({ error: 'not inplemented' })
})

//get one user
router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.status(501).json({ error: `not inplemented ${id}` })
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    res.status(501).json({ error: `not implemented ${id}` })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    res.status(501).json({ error: `not implemented ${id}` })
})

export default router;