const notesRouter = require("express").Router()
const { notesModel } = require("../models")

notesRouter.get('/', async (request, response) => {
    try {
        const notes = await notesModel.getAllNotes()
        response.json(notes)
    } catch (err) {
        response.status(500).json({ error: err.message })
    }
})

notesRouter.get('/:id', async (request, response) => {
    const id = Number(request.params.id)
    try {
        await notesModel.getNoteById(id).then(
            note => note ? response.json(note) : response.status(404).end()
        )
    } catch (err) {
        response.status(500).json({ error: err.message })
    }
})

notesRouter.delete('/:id', async (request, response) => {
    const id = Number(request.params.id)
    try {
        await notesModel.deleteNoteById(id)
        response.status(204).end()
    } catch (err) {
        response.status(500).json({ error: err.message })
    }
})

notesRouter.post('/', async (request, response) => {
    const note = request.body
    if (!note.content) {
        return response.status(400).json({ error: 'content missing' })
    }
    const important = Boolean(note.important) || false
    try {
        const insertedNote = await notesModel.insertNote(note.content, important)
        response.json(insertedNote)
    } catch (err) {
        response.status(500).json({ error: err.message })
    }
})

module.exports = notesRouter