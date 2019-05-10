const NotesService = {
    getAllBookmarks(knex) {
        found = knex.select('*').from('bookmarks');
        return found
    },
    insertBookmark(knex, insertBookmark) {
        return knex.insert(insertBookmark).into('bookmarks');
    },
    patchBookmark(knex, patchBookmark) {
        return knex('bookmarks').where('id', patchBookmark.id).update(patchBookmark);
    },
    deleteBookmark(knex, id){
        return knex('bookmarks')
        .where('id', id)
        .del()
    },
    updateBookmark(knex, insertBookmark){

    },
    getBookmarkById(knex, id) {
       const found = knex.from('bookmarks').select('*').where('id', id).first()
       return found
    }
  }

module.exports = NotesService;
