import Joi from 'joi';

export const updateAvatarSchema = Joi.object({
    name: Joi.string().min(3).required()
});

export const updateNameSchema = Joi.object({
    name: Joi.string().min(3).required()
});

export const updateEmailSchema = Joi.object({
    email: Joi.string().email().required()
});

export const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        .messages({ 'any.only': 'Passwords do not match' }),
});