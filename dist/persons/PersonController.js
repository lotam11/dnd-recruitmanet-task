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
exports.create = exports.getPersonList = exports.getPerson = exports.updatePerson = exports.createPerson = void 0;
const joi_1 = __importDefault(require("joi"));
const PersonService_1 = __importDefault(require("./PersonService"));
const createPerson = (persons) => {
    const validation = joi_1.default.object().keys({
        nickname: joi_1.default.string().required(),
        fullname: joi_1.default.string().required(),
        description: joi_1.default.string().required()
    });
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        joi_1.default.attempt(req.body, validation);
        const person = yield persons.create(req.body);
        res.json(person).end();
    });
};
exports.createPerson = createPerson;
const updatePerson = (persons) => {
    const validation = joi_1.default.object().keys({
        nickname: joi_1.default.string().required(),
        fullname: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        id: joi_1.default.number().required(),
    });
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const input = Object.assign(Object.assign({}, req.body), { id: req.params.id });
        joi_1.default.attempt(input, validation);
        const person = yield persons.update(req.body);
        res.json(person).end();
    });
};
exports.updatePerson = updatePerson;
function getPerson(persons) {
    return (req, res) => __awaiter(this, void 0, void 0, function* () {
        return res.json(yield persons.get(req.params.id)).end();
    });
}
exports.getPerson = getPerson;
function getPersonList(persons) {
    return (req, res) => __awaiter(this, void 0, void 0, function* () {
        return res.json(yield persons.getList({
            offset: parseInt(req.query.query),
            limit: parseInt(req.query.limit)
        })).end();
    });
}
exports.getPersonList = getPersonList;
function create(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const persons = yield PersonService_1.default.create(data);
        return {
            get: getPerson(persons),
            create: exports.createPerson(persons),
            getList: getPersonList(persons),
            update: exports.updatePerson(persons)
        };
    });
}
exports.create = create;
exports.default = { create };
