"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.create = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const chalk_1 = __importDefault(require("chalk"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const express_jwt_1 = __importDefault(require("express-jwt"));
const DataProvider_1 = __importDefault(require("./data/DataProvider"));
const Middleware_1 = require("./Middleware");
const Config_1 = require("./Config");
const Handlers = __importStar(require("./Handlers"));
const Routes_1 = require("./Routes");
const JwtAuth = __importStar(require("./auth/JWTAuthService"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
function create() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express_1.default();
        const data = yield DataProvider_1.default.create();
        const authService = yield JwtAuth.create({
            secretkey: Config_1.Server.jwtSecret,
            expiresIn: 400
        });
        const handlers = yield Handlers.create(data, authService);
        const appRouter = yield Routes_1.createRouter(handlers);
        app
            .disable('x-powered-by')
            .use(morgan_1.default(Config_1.Server.isDev ? 'dev' : 'combined'))
            .use(body_parser_1.default.json())
            .post("/authorize", express_async_handler_1.default(handlers.userHandler.authenticate))
            .post("/register", express_async_handler_1.default(handlers.userHandler.register))
            .use(appRouter.use(express_jwt_1.default({ secret: process.env.JWT_SECRET_KEY, algorithms: ['HS256'] })));
        app.use(Middleware_1.handleValidatorErrors);
        return app;
    });
}
exports.create = create;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let app = yield create();
        const server = http_1.default.createServer(app);
        server.listen(Config_1.Server.port, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(chalk_1.default.cyan(`> Started API on port ${chalk_1.default.yellow(Config_1.Server.port.toString())}`));
        });
        // Support hot-swapping
        function replaceApp(newApp) {
            server.removeListener('request', app);
            server.on('request', newApp);
            app = newApp;
        }
        return replaceApp;
    });
}
exports.main = main;
exports.default = { create, main };
main();
