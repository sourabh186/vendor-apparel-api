"use strict";
// src/swagger.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
                url: 'http://localhost:3000',
                description: 'Local development server',
            },
        ],
    },
    apis: ['src/controllers/*.ts'], // Point to your controller files
};
const specs = (0, swagger_jsdoc_1.default)(options);
function setupSwagger(app) {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
}
exports.setupSwagger = setupSwagger;
