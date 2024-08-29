const joiValidator = require("@hapi/joi");

const schemas = {
    firstName: joiValidator
        .string()
        .required()
        .min(3)
        .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/),
    lastName: joiValidator
        .string()
        .required()
        .min(3)
        .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/),
    email: joiValidator
        .string()
        .email()
        .required(),
    password: joiValidator
        .string()
        .required()
        .min(8)
        .max(50)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,50}$/)
        .messages({
            "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "string.empty": "Password cannot be empty",
        }),
    role: joiValidator
        .string()
        .valid('npo', 'admin', 'donor')
        .required(),
    organizationName: joiValidator
        .string()
        .optional(),
    organizationDetails: joiValidator
        .string()
        .optional(),
    preferedCategories: joiValidator
        .string()
        .optional(),
};

const staffEntryValidator = (validateAllFields = false) => {
    return async (req, res, next) => {
        // Trim input fields
        req.body.firstName = req.body.firstName ? req.body.firstName.trim() : '';
        req.body.lastName = req.body.lastName ? req.body.lastName.trim() : '';
        req.body.email = req.body.email ? req.body.email.trim() : '';

        const keysToValidate = {};

        if (validateAllFields) {
            Object.keys(schemas).forEach((key) => {
                keysToValidate[key] = schemas[key].required();
            });
        } else {
            Object.keys(req.body).forEach((key) => {
                if (schemas[key]) {
                    keysToValidate[key] = schemas[key];
                }
            });
        }

        const schema = joiValidator.object(keysToValidate);
        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        } else {
            return next();
        }
    };
};

module.exports = staffEntryValidator;
