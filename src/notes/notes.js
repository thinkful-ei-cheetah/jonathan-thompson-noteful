const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const notesRouter = express.Router();
const bodyParser = express.json();
const NotesService = require('./notes-service')

const serializeNote = note => ({
  id: note.id,
  folderId: note.folderId,
  description: note.description,
  content: Number(note.content),
})

notesRouter
  .route('/api/notes')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')

    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(note => ({
          id: note.id,
          folderId: note.folderId,
          content: note.content,
          modified: note.modified,

        })))
      })
      .catch(next)

  })
  .post(bodyParser, (req, res, next) => {

    const { folderId, content, modified } = req.body;
    const parsedContent = parseInt(content);

    if (!folderId) {
      logger.error('folderId is required')
      return res
        .status(400)
        .send('Invalid Data');
    }
    if (!content) {
      logger.error('content is required')
      return res
        .status(400)
        .send('Invalid Data');
    }

    const insertNote = {
      folderId: folderId,
      content: content,
      modified: now()
    }

    const knexInstance = req.app.get('db')

    NotesService.insertNote(knexInstance, insertNote)
      .then(returnObject => {
        return res.json(returnObject)
      })
      .catch(next)
  })

notesRouter
  .route('/api/notes/:id')
  .get((req, res, next) => {
    const { id } = req.params;
    const parseId = parseInt(id);

    const knexInstance = req.app.get('db')

    NotesService.getNoteById(knexInstance, id)
      .then(returnObject => {
        return res.json(serializeNote(returnObject))
      })
      .catch(next)

  })
  .delete((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db')

    NotesService.deleteNote(knexInstance, id)
      .then(returnObject => {
        return res.json(serializeNote(returnObject))
      })
      .catch(next)
  })

notesRouter
  .route('/api/notes/:id')
  .patch(bodyParser, (req, res, next) => {
    console.log(req.body)
    const { id, folderId, content, description } = req.body;
    const parsedContent = parseInt(content);
    const parseId = parseInt(id);
    const knexInstance = req.app.get('db');

    const patchNote = {
      folderId: folderId,
      content: content,
      modified: now()
    }

    NotesService.patchNote(knexInstance, patchNote)
      .then(returnObject => {
        return res.json(returnObject)
      })
      .catch(next)

  })



module.exports = notesRouter;