const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const notesRouter = express.Router();
const bodyParser = express.json();
const NotesService = require('./notes-service')

const serializeNote = note => ({
  id: note.id,
  title: note.title,
  url: note.url,
  description: note.description,
  rating: Number(note.rating),
})

foldersRouter
  .route('/api/notes')
  .get((req, res, next) => {
      const knexInstance = req.app.get('db')

      NotesService.getAllNotes(knexInstance)
        .then(notes => {
         res.json(notes.map(note=> ({
           id: note.id,
           title: note.title,
           url: note.url,
          description: note.description,
        
         })))
        })
        .catch(next)

  })
  .post(bodyParser, (req, res, next) => {
   
    const { title, url, rating, description } = req.body;
    const parsedRating = parseInt(rating);

    if(!title) {
      logger.error('Title is required')
      return res
        .status(400)
        .send('Invalid Data');
    }
    if(!rating) {
      logger.error('Rating is required')
      return res
        .status(400)
        .send('Invalid Data');
    }

    const insertNote = {
      title: title,
      rating: rating,
      url: url,
      description: description
    }

    const knexInstance = req.app.get('db')

    NotesService.insertNote(knexInstance, insertNote)
      .then(returnObject => {
          return res.json(returnObject)
      })
      .catch(next)
  })

  foldersRouter
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

    foldersRouter
    .route('/api/notes/:id')
    .patch(bodyParser, (req, res, next) => {
      console.log(req.body)
      const { id, title, url, rating, description } = req.body;
      const parsedRating = parseInt(rating);
      const parseId = parseInt(id);
      const knexInstance = req.app.get('db');
    
      const patchNote = {
        title: title,
        rating: rating,
        url: url,
        description: description,
        id: id
      }

      NotesService.patchNote(knexInstance, patchNote)
      .then(returnObject => {
          return res.json(returnObject)
      })
      .catch(next)
      
    })



module.exports = foldersRouter;