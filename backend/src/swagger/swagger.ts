import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'News Grab API',
    version: '1.0.0',
    description: 'Документация API',
  },
  servers: [
    {
      url: 'http://localhost:8888',
      description: 'Dev server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);