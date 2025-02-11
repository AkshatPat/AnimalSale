import Joi from "joi";

const createAnimalSchema = Joi.object({
    type: Joi.string()
        .required(),
    breed: Joi.string()
        .required(),
    milk: Joi.number()
        .required(),
    child: Joi.number()
        .required(),
    age: Joi.number()
        .required(),          
    price: Joi.number()
        .required(),  
    description: Joi.string()
        .required()         
})


export default {
    createAnimalSchema
}