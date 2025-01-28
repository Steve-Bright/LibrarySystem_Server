import Joi from "joi"

export const MemberSchema = {
    register:
      Joi.object({
        memberType: Joi.string()
          .valid("student","teacher", "staff", "public")
          .label("Member Type")
          .required(),

        personalId: Joi.when("memberType", {
          is: "student",
          then: Joi.string().required(),
          otherwise: Joi.optional()
        })
        .label("Personal Id"),
        
        name: Joi.string()
          .label("Member's name")
          .required(),
        
        gender: Joi.string()
          .valid("male", "female")
          .label("Gender")
          .required(),
          
        grade: Joi.when("memberType", {
          is: "student",
          then: Joi.string().required(),
          otherwise: Joi.forbidden()
        }).label("Student's current Grade"),

        phone: Joi.string()
          .label("Member's phone num")
          .required(),

        email: Joi.string()
          .label("Member's email")
          .optional(),

        permanentAddress: Joi.string()
          .label("Permanent address")
          .required(),

        currentAddress: Joi.string()
          .label("Current address")
          .required(),

        note:Joi.string()
          .label("Note")
          // .allow(null, "")
          .optional(),

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
            })
            .when("memberType", {
              is: "public", 
              then: Joi.string()
                .pattern(/^P-\d{5}$/) // P-00001 to P-99999
                .message({
                  "string.pattern.base": "Incorrect Member format 'P-XXXXX'"
                })
                .required()
            })
            .label("Member Id"),
        nrc: Joi.when("memberType", {
            is: Joi.valid("public", "teacher", "staff"),
            then: Joi
            .string()
            .pattern(/^([1-9]|1[0-4])\/[A-Za-z]+\([A-Za-z]+\)\d{6}$/)
            .message({
              "string.pattern.base": "Incorrect NRC Format"
            })
            .required(),

            otherwise: Joi
            .string()
            .allow(null, "")
            .pattern(/^([1-9]|1[0-4])\/[A-Za-z]+\([A-Za-z]+\)\d{6}$/)
            .message({
              "string.pattern.base": "Incorrect NRC Format"
            })
            .optional(),

        }),

        expireMonths: Joi.number()
          .min(1)
          .max(12)
          .optional()
    })
}

export const BookSchema = {
  register: 
    Joi.object({
      category: Joi.string()
        .valid("myanmar", "english")
        .label("Category")
        .required(),

      accNo: Joi.string()
        .pattern(/^CC-\d{5}$/)
        .message({
          "string.pattern.base": "Incorrect Accession Number format CC-XXXXX"
        })
        .label("Accession Number")
        .required(),

      bookTitle: Joi.string()
        .label("Book Title")
        .required(),

      subTitle: Joi.string()
        .label("Sub Title")
        .optional(),

      parallelTitle: Joi.string()
        .label("Parallel Title")
        .optional(),

      initial: Joi.string()
        .label("Author Initial")
        .required(),

      classNo: Joi.string()
        .pattern(/^\d{3}(\.\d+)?$/)
        .message({
          "string.pattern.base": "Please enter the correct class number format"
        })
        .label("Class Number")
        .required(),

      callNo: Joi.string()
        .label("Call Number")
        .required(),

      sor: Joi.string()
        .label("Statement of Responsibility")
        .required(),

      isbn: Joi.when("category", {
        is: "myanmar",
        then: Joi.string()
          .forbidden(),
          otherwise: Joi.string().required()
      })
      .label("ISBN"),
      
      authorOne: Joi.string()
        .label("Author One")
        .optional(),
      
      authorTwo: Joi.string()
        .label("Author Two")
        .optional(),

      authorThree: Joi.string()
        .label("Author Three")
        .optional(),

      other: Joi.string()
        .label("Other authors")
        .optional(),

      translator: Joi.string()
        .label("Translator")
        .optional(),

      pagination: Joi.string()
        .label("Pagination")
        .optional(),

      size: Joi.string()
        .label("Size")
        .optional(),

      illustrationType: Joi.string()
        .label("Illustration Type")
        .optional(),

      seriesTitle: Joi.string()
        .label("Series Title")
        .optional(),

      seriesNo: Joi.string()
        .label("Series Number")
        .optional(),

      includeCD: Joi.boolean()
        .label("CD in the book")
        .optional(),
        
      subjectHeadings: Joi.string()
        .label("Subject Headings")
        .optional(),

      edition: Joi.string()
        .label("Edition")
        .optional(),

      editor: Joi.string()
        .label("Editor")
        .optional(),

      place: Joi.string()
        .label("Place")
        .optional(),

      publisher: Joi.string()
        .label("Publisher")
        .optional(),

      year: Joi.number()
        .integer()
        .min(0)
        .label("Year")
        .max(new Date().getFullYear())
        .optional(),

      keywords: Joi.string()
        .label("Keywords")
        .optional(),

      summary: Joi.string()
        .label("Summary")
        .optional(),

      notes: Joi.string()
        .label('Notes')
        .optional(),

      source: Joi.string()
        .label("Source")
        .optional(),

      price: Joi.string()
        .label("Price"),

      donor: Joi.string()
        .label("Donor")
        .optional(),

      catalogOwner: Joi.number()
        .label("Catalog Owner")
        .optional()
    }),

    edit: 
    Joi.object({
      bookId: Joi.string()
        .label("Book ID")
        .required(),

      category: Joi.string()
        .valid("myanmar", "english")
        .label("Category")
        .required(),

      accNo: Joi.string()
        .pattern(/^CC-\d{5}$/)
        .message({
          "string.pattern.base": "Incorrect Accession number format CC-XXXXX"
        })
        .label("Accession Number")
        .optional(),

      // Using xor to ensure at least one of these keys is modified, but not both
      bookTitle: Joi.string()
        .label("Book Title")
        .optional(),

      subTitle: Joi.string()
        .label("Sub Title")
        .optional(),

      parallelTitle: Joi.string()
        .label("Parallel Title")
        .optional(),

      initial: Joi.string()
        .label("Author Initial")
        .optional(),

      classNo: Joi.string()
        .pattern(/^\d{3}(\.\d+)?$/)
        .message({
          "string.pattern.base": "Please enter the correct class number format"
        })
        .label("Class Number")
        .optional(),

      callNo: Joi.string()
        .label("Call Number")
        .optional(),

      sor: Joi.string()
        .label("Statement of Responsibility")
        .optional(),

      isbn: Joi.when("category", {
        is: "myanmar",
        then: Joi.string()
          .forbidden(),
        otherwise: Joi.string().optional()
      })
      .label("ISBN"),

      authorOne: Joi.string()
        .label("Author One")
        .optional(),

      authorTwo: Joi.string()
        .label("Author Two")
        .optional(),

      authorThree: Joi.string()
        .label("Author Three")
        .optional(),

      other: Joi.string()
        .label("Other authors")
        .optional(),

      translator: Joi.string()
        .label("Translator")
        .optional(),

      pagination: Joi.string()
        .label("Pagination")
        .optional(),

      size: Joi.string()
        .label("Size")
        .optional(),

      illustrationType: Joi.string()
        .label("Illustration Type")
        .optional(),

      seriesTitle: Joi.string()
        .label("Series Title")
        .optional(),

      seriesNo: Joi.string()
        .label("Series Number")
        .optional(),

      includeCD: Joi.boolean()
        .label("CD in the book")
        .optional(),

      subjectHeadings: Joi.string()
        .label("Subject Headings")
        .optional(),

      edition: Joi.string()
        .label("Edition")
        .optional(),

      editor: Joi.string()
        .label("Editor")
        .optional(),

      place: Joi.string()
        .label("Place")
        .optional(),

      publisher: Joi.string()
        .label("Publisher")
        .optional(),

      year: Joi.number()
        .integer()
        .min(0)
        .label("Year")
        .max(new Date().getFullYear())
        .optional(),

      keywords: Joi.string()
        .label("Keywords")
        .optional(),

      summary: Joi.string()
        .label("Summary")
        .optional(),

      notes: Joi.string()
        .label('Notes')
        .optional(),

      source: Joi.string()
        .label("Source")
        .optional(),

      price: Joi.string()
        .label("Price"),

      donor: Joi.string()
        .label("Donor")
        .optional(),

      catalogOwner: Joi.number()
        .label("Catalog Owner")
        .optional(),

      editedPhoto: Joi.boolean()
        .label("Editing the image")
        .optional()
    })
      .or('bookTitle', 'subTitle', 'parallelTitle', 'initial', 'classNo', 'callNo', 'sor', 'isbn', 'authorOne', 'authorTwo', 'authorThree', 'other', 'translator', 'pagination', 'size', 'illustrationType', 'seriesTitle', 'seriesNo', 'includeCD', 'subjectHeadings', 'edition', 'editor', 'place', 'publisher', 'year', 'keywords', 'summary', 'notes', 'source', 'price', 'donor', 'catalogOwner', "editedPhoto")
      .messages({
        "object.missing": "Please specify at least one field to update",
      }),
    
}