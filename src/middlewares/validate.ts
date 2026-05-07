import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors: Record<string, string> = {};
        error.details.forEach((detail) => {
            errors[detail.path[0] as string] = detail.message;
        });
        return res.status(400).json({ errors });
    }

    next();
};