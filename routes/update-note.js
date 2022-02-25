const express = require('express')
const updateNoteRoute = express.Router()
const fsPromises = require('fs').promises
const { MESSAGES } = require('../config')
const Joi = require('joi')
const { NOTE_SCHEMA } = require('../validations')
const { dataToString } = require('../utils')

// Routing /update-note
updateNoteRoute.route('/')
    .put( async (req, res) => {
        let data = [];

        // Validating the incoming payload:
        const {value, error} = NOTE_SCHEMA.validate(req.body)

        if(error){
            res.send(MESSAGES.BAD_REQUEST).status(400);
            console.log(error)
            return;
        }

        let payload = value;

        // Getting the content from db:
        try{
            const content = await fsPromises.readFile('data.json', 'utf8');
            data = JSON.parse(content);
        } catch (err) {
            console.log(err)
            res.send(MESSAGES.SERVER_ERROR).status(500);
            return;
        }

        //Updating the note data:
        data = data.map(note => note.id === payload.id ? payload : note);

        // Writing the data to db:
        try{
            let content = dataToString(data);
            await fsPromises.writeFile('data.json', content);
        } catch (err) {
            console.log(err)
            res.send(MESSAGES.SERVER_ERROR).status(500)
            return;
        }

        // client and payload:
        console.log("Update note: ", req.body, "\nfrom: ", req.rawHeaders[19], '\n');

        // Sending the data back to client:
        res.json(data).status(200)
        return;
    })

module.exports = updateNoteRoute;