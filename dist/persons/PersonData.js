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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.getPersonList = exports.updatePerson = exports.createPerson = exports.getPerson = void 0;
const getPerson = (users) => (id) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield users().select().where({ id }))[0];
});
exports.getPerson = getPerson;
const createPerson = (users) => (input) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield users().insert(input, ['id']))[0];
    const row = yield users().select().where({ id: result });
    return row[0];
});
exports.createPerson = createPerson;
const updatePerson = (users) => (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = input, rest = __rest(input, ["id"]);
    yield users()
        .where({ id })
        .update(rest);
    return yield users().select().where({ id });
});
exports.updatePerson = updatePerson;
const getPersonList = (persons) => (parameters) => __awaiter(void 0, void 0, void 0, function* () {
    let query = persons().select();
    if (parameters.offset)
        query = query.where("id", ">", parameters.offset);
    if (parameters.limit)
        query = query.limit(parameters.limit);
    return yield query;
});
exports.getPersonList = getPersonList;
function create(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = () => data.mysql.table('person');
        return {
            get: exports.getPerson(users),
            getList: exports.getPersonList(users),
            create: exports.createPerson(users),
            update: exports.updatePerson(users)
        };
    });
}
exports.create = create;
