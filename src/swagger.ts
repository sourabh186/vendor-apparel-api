// src/swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express'; // Import Express.js

const options = {
    swaggerDefinition: {
        components: {
        schemas: {
            Apparel: {
                type: 'object',
                properties: {
                    code: {
                        type: 'string',
                    },
                    sizes: {
                        type: 'object',
                        // Define properties for sizes here
                    },
                },
            },
        },
    },
        openapi: '3.0.0',
        info: {
            title: 'Vendor Apparel API',
            version: '1.0.0',
            description: 'API for managing vendor apparel stock and orders.',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Update with your API URL
                description: 'Local development server',
            },
        ],
    },
    apis: ['controllers/*.ts'], // Point to your controller files
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: express.Application) { // Specify the type here
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
