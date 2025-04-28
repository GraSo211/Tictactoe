"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use();
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
