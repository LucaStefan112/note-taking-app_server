const Joi = require("joi")

exports.NOTE_SCHEMA = Joi.object({
    id: Joi.number().positive().required(),
    name: Joi.string().max(30).min(1).required(),
    content: Joi.string()
})

exports.ID_SCHEMA = Joi.object({
    id: Joi.number().positive().required()
})

exports.NAME_SCHEMA = Joi.object({
    name: Joi.string().max(30).min(1).required()
})