"use strict";
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
const PersonHandler_1 = __importDefault(require("./persons/PersonHandler"));
const DataProvider_1 = __importDefault(require("./data/DataProvider"));
const Middleware_1 = require("./Middleware");
const Config_1 = require("./Config");
const createHandlers = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        personHandler: (yield PersonHandler_1.default.create(data))
    });
});
function create() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express_1.default();
        const data = yield DataProvider_1.default.create();
        const handlers = yield createHandlers(data);
        app
            .disable('x-powered-by')
            .use(morgan_1.default(Config_1.Server.isDev ? 'dev' : 'combined'))
            .use(body_parser_1.default.json())
            // .use(cookieSession({
            //   name: 'session',
            //   keys: ['pkdsM?o36UPYjuNx', 'QnwWwTnNiGd2M3>o', 'ikmUPhQcD78QTN;i'],
            //   // Cookie Options
            //   maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            // }))
            .post('/users/create', Middleware_1.promise((req) => __awaiter(this, void 0, void 0, function* () { return yield handlers.personHandler.create(req); })));
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
