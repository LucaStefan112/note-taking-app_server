const Joi = require("joi")

exports.NOTE_SCHEMA = Joi.object({
    name: Joi.string().max(30).required(),
    content: Joi.string().required()
})

exports.ID_SCHEMA = Joi.object({
    id: Joi.number().positive().required()
})