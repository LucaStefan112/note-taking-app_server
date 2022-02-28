const express = require('express')
const newNoteRoute = express.Router()
const fsPromises = require('fs').promises
const { MESSAGES } = require('../config')
const Joi = require('joi')
const { NAME_SCHEMA } = require('../validations')

// Routing /new-note
newNoteRoute.route('/')

    // Adding a new note:
    .post(async (req, res) => {    
        let data = [];

        // Validating the incoming payload:
        const {value, error} = NAME_SCHEMA.validate(req.body)

        if(error){
            res.send(MESSAGES.BAD_REQUEST).status(400);
            return;
        }

        let payload = value;

        // Creating the new id:
        payload.id = new Date().getTime();
        payload.content = '';

        // Getting the content from db:
        try{
            const content = await fsPromises.readFile('data.json', 'utf8');
            data = JSON.parse(content);
        } catch (err) {
            console.log(err)
            res.send(MESSAGES.SERVER_ERROR).status(500);
            return;
        }

        for(let i in data)
            if(data[i].name == payload.name){
                res.send(MESSAGES.BAD_REQUEST).status(400);
                return;
            }

        // Pushing the new note:
        data.push(payload);

        // Writing the data to db:
        try{
            let content = JSON.stringify(data);
            await fsPromises.writeFile('data.json', content);
        } catch (err) {
            console.log(err)
            res.send(MESSAGES.SERVER_ERROR).status(500)
            return;
        }

        // Client and Payload:
        console.log("Creating note: ", payload, "\nfrom: ", req.rawHeaders[19], '\n');

        // Sending the data back to client:
        res.json(payload).status(200)
        return;
    })

module.exports = newNoteRoute;