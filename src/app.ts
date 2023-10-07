// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import apparelController from './controllers/apparelController';

import { setupSwagger } from './swagger';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/apparel', apparelController);
setupSwagger(app);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
