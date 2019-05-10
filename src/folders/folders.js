const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const notesRouter = express.Router();
const bodyParser = express.json();
const BookmarksService = require('./notes-service')

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: bookmark.title,
  url: bookmark.url,
  description: bookmark.description,
  rating: Number(bookmark.rating),
})

foldersRouter
  .route('/api/bookmarks')
  .get((req, res, next) => {
      const knexInstance = req.app.get('db')

      BookmarksService.getAllBookmarks(knexInstance)
        .then(bookmarks => {
         res.json(bookmarks.map(bookmark=> ({
           id: bookmark.id,
           title: bookmark.title,
           url: bookmark.url,
          description: bookmark.description,
        
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

    const insertBookmark = {
      title: title,
      rating: rating,
      url: url,
      description: description
    }

    const knexInstance = req.app.get('db')

    BookmarksService.insertBookmark(knexInstance, insertBookmark)
      .then(returnObject => {
          return res.json(returnObject)
      })
      .catch(next)
  })

  foldersRouter
    .route('/api/bookmarks/:id')
    .get((req, res, next) => {
      const { id } = req.params;
      const parseId = parseInt(id);

      const knexInstance = req.app.get('db')
    
      BookmarksService.getBookmarkById(knexInstance, id)
      .then(returnObject => {
          return res.json(serializeBookmark(returnObject))
      })
      .catch(next)
      
    })
    .delete((req, res, next) => {
      const { id } = req.params;
      const knexInstance = req.app.get('db')

      BookmarksService.deleteBookmark(knexInstance, id)
      .then(returnObject => {
          return res.json(serializeBookmark(returnObject))
      })
      .catch(next)
    })

    foldersRouter
    .route('/api/bookmarks/:id')
    .patch(bodyParser, (req, res, next) => {
      console.log(req.body)
      const { id, title, url, rating, description } = req.body;
      const parsedRating = parseInt(rating);
      const parseId = parseInt(id);
      const knexInstance = req.app.get('db');
    
      const patchBookmark = {
        title: title,
        rating: rating,
        url: url,
        description: description,
        id: id
      }

      BookmarksService.patchBookmark(knexInstance, patchBookmark)
      .then(returnObject => {
          return res.json(returnObject)
      })
      .catch(next)
      
    })



module.exports = foldersRouter;