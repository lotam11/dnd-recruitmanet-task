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
exports.create = void 0;
/* tslint:disable await-promise */
const knex_1 = __importDefault(require("knex"));
const Config_1 = require("../Config");
/**
 * Initialize a new Postgres provider
 */
function create() {
    return __awaiter(this, void 0, void 0, function* () {
        const knex = knex_1.default({
            client: 'mysql',
            connection: {
                user: Config_1.Database.user,
                password: Config_1.Database.password,
                host: Config_1.Database.host,
                port: Config_1.Database.port,
                database: Config_1.Database.database
            },
        });
        // Verify the connection before proceeding
        try {
            yield knex.raw('SELECT now()');
            return knex;
        }
        catch (error) {
            throw new Error('Unable to connect to Postgres via Knex. Ensure a valid connection.');
        }
    });
}
exports.create = create;
exports.default = { create };
