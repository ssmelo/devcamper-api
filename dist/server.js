"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
// Load env vars
dotenv_1.default.config({ path: './config/config.env' });
var app = express_1.default();
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () { return console.log("Server running in " + process.env.NODE_ENV + " mode on port " + PORT); });
