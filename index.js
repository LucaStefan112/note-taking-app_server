const express = require('express')
const app = express()
const { notesRoute, newNoteRoute, updateNoteRoute, removeNoteRoute} = require('./routes')
const { PORT, PATHS, MESSAGES } = require('./config')

//Headers for CORS compatibility
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Content-Type', 'application/json')
    .setHeader('Access-Control-Allow-Headers', '*')
    .setHeader('Access-Control-Allow-Methods', '*');

    next();
});

// Middleware for json formating:
app.use(express.json());

// Routing the app:
// /notes
app.use(PATHS.NOTES, notesRoute);

// /new-note
app.use(PATHS.NEW_NOTE, newNoteRoute);

// /update-note
app.use(PATHS.UPDATE_NOTE, updateNoteRoute);

// /remove-note
app.use(PATHS.REMOVE_NOTE, removeNoteRoute);

// Non-existing routes:
app.get('*', (req, res) => res.send(MESSAGES.NOT_FOUND).status(404));

console.log(`listening on port ${PORT}...\n`);
app.listen(PORT);