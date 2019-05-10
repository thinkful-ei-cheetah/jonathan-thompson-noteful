const NotesService = {
    getAllNotes(knex) {
        found = knex.select('*').from('notes');
        return found
    },
    insertNote(knex, insertNote) {
        return knex.insert(insertNote).into('notes');
    },
    patchNote(knex, patchNote) {
        return knex('notes').where('id', patchNote.id).update(patchNote);
    },
    deleteNote(knex, id){
        return knex('notes')
        .where('id', id)
        .del()
    },
    updateNote(knex, insertNote){

    },
    getNoteById(knex, id) {
       const found = knex.from('notes').select('*').where('id', id).first()
       return found
    }
  }

module.exports = NotesService;
