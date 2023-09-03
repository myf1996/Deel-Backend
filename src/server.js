const app = require('./app');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

let host= 'http://localhost:3001'
init();

async function init() {
  swaggerDocs()
  try {
    app.listen(3001, () => {
      console.log('Express App Listening on Port 3001');
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

function swaggerDocs () {
  const swaggerDefinition = {
    info: {
      title: 'REST API for Deel Backend Task',
      version: '1.0.0',
      description: 'This is the REST API for Deel Backend Task',
    },
    host: host,
    // basePath: '/api',
    securityDefinitions: {
      // BearerAuth: {
      //   type: '',
      //   description: 'JWT authorization of an API',
      //   name: 'profile_id',
      //   in: 'header',
      // },
    },
  };

  const options = {
    swaggerDefinition,
    apis: ['./api-docs/*.yaml'],
  };
  const swaggerSpec = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
