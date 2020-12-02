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
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.createVehicule = exports.getVehiculeList = exports.getVehicule = void 0;
const VehiculeData = __importStar(require("./VehiculeData"));
const getVehicule = (vehicules) => (input) => __awaiter(void 0, void 0, void 0, function* () {
    return vehicules.get(input);
});
exports.getVehicule = getVehicule;
const getVehiculeList = (vehicules) => (input) => __awaiter(void 0, void 0, void 0, function* () {
    return vehicules.getList(input);
});
exports.getVehiculeList = getVehiculeList;
const createVehicule = (vehicules) => (input) => __awaiter(void 0, void 0, void 0, function* () {
    return vehicules.create(input);
});
exports.createVehicule = createVehicule;
function create(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const Vehicules = yield VehiculeData.create(data);
        return {
            get: exports.getVehicule(Vehicules),
            getList: exports.getVehiculeList(Vehicules),
            create: exports.createVehicule(Vehicules),
        };
    });
}
exports.create = create;
exports.default = { create };
