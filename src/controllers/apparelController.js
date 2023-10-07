"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/controllers/apparelController.ts
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
// Load data from JSON file
const dataPath = 'data/apparel.json';
let apparelData = [];
try {
    const rawData = fs_1.default.readFileSync(dataPath, 'utf-8');
    apparelData = JSON.parse(rawData).apparel;
}
catch (error) {
    console.error('Error reading or parsing data file:', error);
}
/**
 * @swagger
 * /apparel/latest:
 *   get:
 *     summary: Get the latest apparel data.
 *     responses:
 *       200:
 *         description: Latest apparel data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Apparel'
 */
router.get('/latest', (req, res) => {
    res.status(200).json({ appareldata: apparelData });
});
/**
 * @swagger
 * /apparel/{code}/{size}:
 *   put:
 *     summary: Update stock and price of one apparel code and size.
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         type: string
 *         description: The code of the apparel.
 *       - name: size
 *         in: path
 *         required: true
 *         type: string
 *         description: The size of the apparel (S, M, L ).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Stock and price updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 apparel:
 *                   $ref: '#/components/schemas/Apparel'
 *       404:
 *         description: Apparel not found or size not available.
 */
router.put('/:code/:size', (req, res) => {
    var _a;
    const { code, size } = req.params;
    const { quantity, price } = req.body;
    const apparel = apparelData.find((item) => item.code === code);
    if (!((_a = apparel === null || apparel === void 0 ? void 0 : apparel.sizes) === null || _a === void 0 ? void 0 : _a[size])) {
        return res.status(404).json({ error: 'Apparel not found or size not available.' });
    }
    apparel.sizes[size].quantity = quantity;
    apparel.sizes[size].price = price;
    // Update data file
    fs_1.default.writeFileSync(dataPath, JSON.stringify({ apparel: apparelData }, null, 4));
    res.status(200).json({ message: 'Stock and price updated successfully.', apparel: apparelData });
});
/**
 * @swagger
 * /apparel/bulk:
 *   put:
 *     summary: Bulk update stock and price of multiple apparel items.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 size:
 *                   type: string
 *                 quantity:
 *                   type: number
 *                 price:
 *                   type: number
 *     responses:
 *       200:
 *         description: Bulk update completed successfully.
 */
router.put('/bulk', (req, res) => {
    const updates = req.body;
    updates.forEach((update) => {
        const { code, size, quantity, price } = update;
        const apparel = apparelData.find((item) => item.code === code);
        if (apparel === null || apparel === void 0 ? void 0 : apparel.sizes[size]) {
            apparel.sizes[size].quantity = quantity;
            apparel.sizes[size].price = price;
        }
    });
    // Update data file
    fs_1.default.writeFileSync(dataPath, JSON.stringify({ apparel: apparelData }, null, 4));
    res.status(200).json({ message: 'Bulk update completed successfully.' });
});
/**
 * @swagger
 * /apparel/check-order:
 *   post:
 *     summary: Check if an order can be fulfilled based on the availability of apparel items.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: The code of the apparel.
 *                 size:
 *                   type: string
 *                   description: The size of the apparel.
 *                 quantity:
 *                   type: number
 *                   description: The quantity of the apparel.
 *     responses:
 *       200:
 *         description: Order can be fulfilled.
 *       400:
 *         description: Order cannot be fulfilled.
 */
router.post('/check-order', (req, res) => {
    const orderItems = req.body;
    let canFulfill = true;
    orderItems.forEach((orderItem) => {
        const { code, size, quantity } = orderItem;
        const apparel = apparelData.find((item) => item.code === code);
        if (!apparel || !apparel.sizes[size] || apparel.sizes[size].quantity < quantity) {
            canFulfill = false;
        }
    });
    if (canFulfill) {
        res.status(200).json({ message: 'Order can be fulfilled.' });
    }
    else {
        res.status(400).json({ error: 'Order cannot be fulfilled.' });
    }
});
/**
 * @swagger
 * /apparel/lowest-cost:
 *   post:
 *     summary: Calculate the lowest cost of fulfilling an order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: The code of the apparel.
 *                 size:
 *                   type: string
 *                   description: The size of the apparel.
 *                 quantity:
 *                   type: number
 *                   description: The quantity of the apparel.
 *     responses:
 *       200:
 *         description: Lowest cost calculated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lowestCost:
 *                   type: number
 */
router.post('/lowest-cost', (req, res) => {
    const orderItems = req.body;
    let lowestCost = 0;
    orderItems.forEach((orderItem) => {
        const { code, size, quantity } = orderItem;
        const apparel = apparelData.find((item) => item.code === code);
        if (apparel && apparel.sizes[size]) {
            lowestCost += apparel.sizes[size].price * quantity;
        }
    });
    res.status(200).json({ lowestCost });
});
exports.default = router;
