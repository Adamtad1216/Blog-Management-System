import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Blog Management System API",

      version: "1.0.0",

      description: "API documentation for Blog Management System",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
