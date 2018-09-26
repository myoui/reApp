var faker = require('json-schema-faker');

var template = {
    type: "object",
    properties: {
        user: {
            type: "object",
            properties: {
                id: {
                    $ref: '#/definitions/positiveInt'
                },
                name: {
                    type: "string",
                    faker: 'name.findName'
                },
                phoneNumber: {
                    type: "string",
                    faker: 'phone.phoneNumber'
                }
            },
            required: ["id", "name", "phoneNumber"]
        }
    },
    required: ["user"],
    definitions: {
        positiveInt: {
          type: 'integer',
          minimum: 0,
          exclusiveMinimum: true
        }
    }
}

faker.resolve(template).then(function(sample) {
    console.log(sample);
    // "[object Object]"
  
    console.log(sample.user.name);
    // "John Doe"
  });