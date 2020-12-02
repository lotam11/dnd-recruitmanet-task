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
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.getPersonStarshipList = exports.createPersonStarship = exports.getPersonStarship = void 0;
const getPersonStarship = (users) => (id) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield users().select().where({ id }))[0];
});
exports.getPersonStarship = getPersonStarship;
const createPersonStarship = (users) => (input) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield users().insert(input, ['id']))[0];
    return (yield users().select().where({ id: result.id }))[0];
});
exports.createPersonStarship = createPersonStarship;
const getPersonStarshipList = (users) => (input) => __awaiter(void 0, void 0, void 0, function* () {
    const query = users().select();
    if (input)
        query.where(input);
    return yield query;
});
exports.getPersonStarshipList = getPersonStarshipList;
function create(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = () => data.mysql.table('User');
        return {
            get: exports.getPersonStarship(users),
            getList: exports.getPersonStarshipList(users),
            create: exports.createPersonStarship(users),
        };
    });
}
exports.create = create;
