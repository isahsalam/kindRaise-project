const joiValidator = require("@hapi/joi");

const schemas = {

    firstName: joiValidator.string().trim()
        .min(3)
        .required()
        .pattern(/^[^\s].*[^\s]$/) // Ensures no leading or trailing spaces
        .pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/) // Ensures only alphabetic characters and allows spaces within
        .messages({
            'string.pattern.base': 'First name must not start or end with  spaces and should contain only letters.',
            'string.min': 'First name must be at least 3 characters long.',
        }),
    lastName: joiValidator
        .string()
        .regex(/^\S.*\S$/) // Ensures no leading or trailing spaces
        .required()
        .messages({
            "string.pattern.base": "Last name cannot have leading or trailing spaces.",
        }),

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
            "string.empty": "Password cannot be empty, must be at least 8 character maximum of 50 characters",
        }), 
        oldPassword: joiValidator
        .string()
        .min(8)
        .max(50)
        .optional()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,50}$/)
        .messages({
            "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "string.empty": "Password cannot be empty, must be at least 8 character maximum of 50 characters",
        }), 
        NewPassword: joiValidator
        .string()
        .min(8)
        .max(50)
        .optional()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,50}$/)
        .messages({
            "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "string.empty": "Password cannot be empty, must be at least 8 character maximum of 50 characters",
        }), 
        ConfirmNewPassword: joiValidator
        .string()
        .min(8)
        .max(50)
        .optional()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,50}$/)
        .messages({
            "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
            "string.empty": "Password cannot be empty, must be at least 8 character maximum of 50 characters",
        }), 
    phoneNumber: joiValidator
        .string()
        .min(11)
        .max(11) 
        .required()
        .regex(/^(?:\+234|0)(70|80|81|90|91)[0-9]{8}$/)
        .message(`phone number must be a valid nigerian number`),
       
        organizationName: joiValidator.string().trim()
        .min(3)
        .optional()
        .pattern(/^[^\s].*[^\s]$/) // Ensures no leading or trailing spaces
        .pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/) // Ensures only alphabetic characters and allows spaces within
        .messages({
            'string.pattern.base': 'organizationName name must not start or end with  spaces and should contain only letters.',
            'string.min': 'organizationName name must be at least 3 characters long.',
        }),
    // registrationNumber: joiValidator
    //     .string()
    //     .optional()
    //     .regex(/^[A-Z0-9]{6,10}$/
    //     ),
    
        name: joiValidator.string().trim()
        .min(3)
        .optional()
        .pattern(/^[^\s].*[^\s]$/) 
        .pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/) 
        .messages({
            'string.pattern.base': 'name  must not start or end with  spaces and should contain only letters.',
            'string.min': 'name  must be at least 3 characters long.',
        }),
        story: joiValidator
        .string()
        .optional()
        .regex(/^[\s\S]{10,5000}$/
            
        ),
        title: joiValidator
        .string()
        .optional()
        .regex(/^[A-Za-z0-9\s.,'-]{2,100}$/
            
        ),
        subtitle: joiValidator
        .string()
        .optional()
        .regex(/^[A-Za-z0-9\s.,'-]{2,150}$/

          ),
        
        
};


const userValidator = (validateAllFields = false, fieldsToValidate = []) => {
    return async (req, res, next) => {
        // Only trim fields that exist in the request body
        if (req.body.firstName) req.body.firstName = req.body.firstName.trim();
        if (req.body.lastName) req.body.lastName = req.body.lastName.trim();
        if (req.body.email) req.body.email = req.body.email.trim();
        if (req.body.organizationName) req.body.organizationName = req.body.organizationName.trim();

        const keysToValidate = {};
        Object.keys(schemas).forEach((key) => {
            if (validateAllFields || fieldsToValidate.includes(key)) {
                keysToValidate[key] = req.body[key] !== undefined ? schemas[key].required() : schemas[key];
            } else if (req.body[key] !== undefined) {
                keysToValidate[key] = schemas[key];
            }
        });

        const {firstName,lastName,email,password,organizationName,ConfirmNewPassword,phoneNumber,story,title,subtitle,oldPassword,NewPassword} = req.body
        const schema = joiValidator.object(keysToValidate);
        const { error } = schema.validate({firstName,lastName,email,password,organizationName,ConfirmNewPassword,phoneNumber,story,title,subtitle,oldPassword,NewPassword});

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        } else {
            return next();
        }
    };
};





// const staffEntryValidator = (validateAllFields = false) => {
//     return async (req, res, next) => {
//         // Trim input fields
//         req.body.firstName = req.body.firstName ? req.body.firstName.trim() : '';
//         req.body.lastName = req.body.lastName ? req.body.lastName.trim() : '';
//         req.body.email = req.body.email ? req.body.email.trim() : '';

//         const keysToValidate = {}
//         Object.keys(schemas).forEach((key) => {
//             if (validateAllFields) {
//                 keysToValidate[key] = req.body[key] !== undefined ? schemas[key].required() : schemas[key]
//             } else {
//                 if (req.body[key] !== undefined) {
//                     keysToValidate[key] = schemas[key]
//                 }
//             }
//         })

//         const schema = joiValidator.object(keysToValidate);
//         const { error } = schema.validate(req.body);

//         if (error) {
//             return res.status(400).json({ message: error.details[0].message });
//         } else {
//             return next();
//         }
//     };
// };

module.exports = userValidator;
