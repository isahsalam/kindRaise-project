const joiValidator=require("@hapi/joi")

 const schemas ={
    fullname:joiValidator
    .string()
    .required()
    .min(3)
    .trim()
    .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/),

    email: joiValidator
    .string()
    .email()
    .min(7)
    .required(),

    password:joiValidator
    .string()
    .required()
    .min(8)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,50}$/)
    .messages({
        "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "string.empty": "Password cannot be empty",
      }),

    age:joiValidator
    .number()
    .required()
    .min(18)
    .integer()
    .messages({
   "number.min" :'user cannot be below 18 years'}
    ),
    
    MaritalStatus:joiValidator
    .string()
    .required()
    .valid("married","single"),

    address:joiValidator.string()
    .required(),

    gender:joiValidator
    .string()
    .required()
    .valid("male","female"),

    academicQualification:joiValidator
    .string()
    .required()
    .valid("bachelor","doctoral","diploma","masters"),

    stateOfOrigin:joiValidator
    .string()
    .required()
    .regex(/^[A-Za-z]+$/)
    .messages({
      'string.pattern.base':'state of origin should be in alphabet'
    }),
 }
 
 const staffEntryValidator = (validateAllFields = false) => {
  return async (req, res, next) => {
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
          return res.status(400).json(error.details[0].message);
      } else {
          return next();
      }
  };
}

module.exports = staffEntryValidator