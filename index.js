const Joi = require('joi')
const ValidationError = require('joi').ValidationError
const fsPromises = require('fs').promises
const express = require('express')
const { MESSAGES, PORT, PATHS } = require('./config')
const { NOTE_SCHEMA, ID_SCHEMA, NAME_SCHEMA } = require('./validations')
const { error } = require('console')

const app = express();

// Mapping the json data to string:
const dataToString = data => {
    let content = '[';
        for(let i = 0; i < data.length; i++){
            const note = data[i];
            content += '{\"id\":' + note.id + ',\"name\":\"' + note.name + '\",\"content\":\"' + note.content + '\"}'
            if(i < data.length - 1) content += ','
        }
        content += ']'
    
    return content
}

//Headers for CORS compatibility
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Content-Type', 'application/json')
    .setHeader('Access-Control-Allow-Headers', '*');
    next();
});

// Middleware for json formating:
app.use(express.json());

// Getting notes from db:
app.get(PATHS.GET_NOTES, async (req, res) => {

    try{
        const data = await fsPromises.readFile('data.json', 'utf8');
        res.send(JSON.parse(data));
    } catch (err) {
        console.log(err)
        res.send(MESSAGES.SERVER_ERROR).status(500)
    }
})

// Posting a new note:
app.post(PATHS.NEW_NOTE, async (req, res) => {
    
    let data = [];

    // Validating the incoming payload:
    const {value, error} = NAME_SCHEMA.validate(req.body)

    if(error){
        res.send(MESSAGES.BAD_REQUEST).status(400);
        return;
    }

    let payload = value

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

    // Pushing the new note:
    data.push(payload);
    // Writing the data to db:
    try{
        let content = dataToString(data);
        await fsPromises.writeFile('data.json', content);
    } catch (err) {
        console.log(err)
        res.send(MESSAGES.SERVER_ERROR).status(500)
        return;
    }

    // Sending the data back to client:
    res.send(data).status(200)
    return;
})

app.delete(PATHS.REMOVE_NOTE, async (req, res) => {

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
        let content = dataToString(data);
        await fsPromises.writeFile('data.json', content);
    } catch (err) {
        console.log(err)
        res.send(MESSAGES.SERVER_ERROR).status(500)
        return;
    }

    // Sending the data back to client:
    res.send(data).status(200)
    return;
})

// Non-existing routes:
app.get('*', (req, res) => res.send(MESSAGES.NOT_FOUND).status(404));

console.log(`listening on port ${PORT}...`);

app.listen(PORT);