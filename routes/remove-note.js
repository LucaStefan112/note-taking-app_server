const express = require('express')
const removeNoteRoute = express.Router()

const fsPromises = require('fs').promises
const { MESSAGES, PATHS } = require('../config')
const Joi = require('joi')
const { ID_SCHEMA } = require('../validations')

removeNoteRoute.route('/').delete(async (req, res) => {

    let data = [];

    // Validating the incoming payload:
    const {value, error} = ID_SCHEMA.validate(req.body)

    if(error){
        res.send(MESSAGES.BAD_REQUEST).status(400);
        return;
    }

    let payload = value

    // Getting the content from db:
    try{
        const content = await fsPromises.readFile('data.json', 'utf8');
        data = JSON.parse(content);
    } catch (err) {
        console.log(err)
        res.send(MESSAGES.SERVER_ERROR).status(500)
        return;
    }

    // Removing the note with the given id:
    data = data.filter(note => note.id != payload.id)

    // Writing the data to db:
    try{
        let content = JSON.stringify(data);
        await fsPromises.writeFile('data.json', content);
    } catch (err) {
        console.log(err)
        res.send(MESSAGES.SERVER_ERROR).status(500)
        return;
    }

    // client and payload:
    console.log("Removing note: ", req.body, "\nfrom: ", req.rawHeaders[19], '\n');

    // Sending the data back to client:
    res.json(data).status(200)
    return;
})

module.exports = removeNoteRoute;