import { resolve } from "path";
import { ServerAction } from "./main";

const serveHandler = require('serve-handler');

export const frontend_server: ServerAction = (req, res) => serveHandler(req, res, {
    public: resolve(__dirname, '../'),
    rewrites: [
        { source: '/app/**', destination: '/app/index.html' }
    ]
})