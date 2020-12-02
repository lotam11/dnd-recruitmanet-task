"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knex = exports.Server = exports.Database = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var Database;
(function (Database) {
    Database.host = process.env.MYSQL_HOST;
    Database.port = parseInt(process.env.MYSQL_PORT);
    Database.database = process.env.MYSQL_DB;
    Database.user = process.env.MYSQL_USER;
    Database.password = process.env.MYSQL_PASSWORD;
})(Database = exports.Database || (exports.Database = {}));
var Server;
(function (Server) {
    Server.port = Number(process.env.PORT || '8000');
    Server.bodyLimit = '100kb';
    Server.corsHeaders = ['Link'];
    Server.isDev = process.env.NODE_ENV === 'development';
})(Server = exports.Server || (exports.Server = {}));
var Knex;
(function (Knex) {
    Knex.config = {
        client: 'mysql',
        connection: {
            host: process.env.DATABASE_HOSTNAME || Database.host,
            database: process.env.DATABASE_NAME || Database.database,
            user: process.env.DATABASE_USERNAME || Database.user,
            password: process.env.DATABASE_PASSWORD || Database.password,
            port: process.env.DATABASE_PORT || Database.port,
        },
        pool: {
            min: process.env.DATABASE_POOL_MIN,
            max: process.env.DATABASE_POOL_MAX,
            idle: process.env.DATABASE_POOL_IDLE,
        },
        migrations: {
            tableName: 'KnexMigrations',
        },
    };
})(Knex = exports.Knex || (exports.Knex = {}));
