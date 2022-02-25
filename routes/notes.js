const express = require('express')
const notesRouter = express.Router()
const fsPromises = require('fs').promises
const { MESSAGES } = require('../config')

// Routing /notes
notesRouter.route('/').

    // Sending the notes from db:
    get(async (req, res) => {
        try{
            const data = await fsPromises.readFile('data.json', 'utf8');
            res.json(JSON.parse(data)).status(200);

            // client address:
            console.log("Sending data to: ", req.rawHeaders[15], '\n')
        } catch (err) {
            console.log(err)
            res.send(MESSAGES.SERVER_ERROR).status(500)
        }
    }
)

module.exports = notesRouter;