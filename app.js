"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const apparelController_1 = __importDefault(require("./src/controllers/apparelController"));
const swagger_1 = require("./src/swagger");
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.use('/apparel', apparelController_1.default);
(0, swagger_1.setupSwagger)(app);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
