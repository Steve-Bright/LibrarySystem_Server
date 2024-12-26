import Joi from "joi"

export const MemberSchema = {
    register:Joi.object({
        memberType: Joi.valid("student", "teacher", "staff").messages({
          "any.only": "Invalid member type. Allowed values are 'student', 'teacher', or 'staff'."
        }),
        personalId: Joi.string(),
        name: Joi.string(),
        gender: Joi.string(),
        department: Joi.string(),
        phone: Joi.string(),
        email: Joi.string().optional(),
        permanentAddress: Joi.string(),
        currentAddress: Joi.string(),
        note:Joi.string().allow(null, "").optional(),
        memberId: Joi.when("memberType", {
            is: "student",
            then: Joi.string()
              .pattern(/^S-\d{5}$/) // S-00001 to S-99999
              .message({
                "string.pattern.base": "Incorrect Member format 'S-XXXXX'"
              })
              .required(),
          })
            .when("memberType", {
              is: "teacher",
              then: Joi.string()
                .pattern(/^T-\d{5}$/) // T-00001 to T-99999
                .message({
                  "string.pattern.base": "Incorrect Member format 'T-XXXXX'"
                })
                .required(),
            })
            .when("memberType", {
              is: "staff",
              then: Joi.string()
                .pattern(/^ST-\d{5}$/) // ST-00001 to ST-99999
                .message({
                  "string.pattern.base": "Incorrect Member format 'ST-XXXXX'"
                })
                .required(),
            }),
        nrc: Joi.when("memberType", {
            is: Joi.valid("teacher", "staff"),
            then: Joi
            .string()
            .pattern(/^([1-9]|1[0-4])\/[A-Za-z]+\([A-Za-z]+\)\d{6}$/)
            .message({
              "string.pattern.base": "Incorrect NRC Format"
            }),
            otherwise: Joi
            .string()
            .allow(null, "")
            .pattern(/^([1-9]|1[0-4])\/[A-Za-z]+\([A-Za-z]+\)\d{6}$/)
            .message({
              "string.pattern.base": "Incorrect NRC Format"
            })
            .optional(),

        })
    })
}