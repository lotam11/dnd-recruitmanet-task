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
exports.wrapAsync = exports.handleValidatorErrors = exports.promise = void 0;
const joi_1 = require("joi");
const promise = (middleware) => ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield middleware(req, res);
        if (result) {
            res.json(result);
        }
        else {
            next();
        }
    }
    catch (err) {
        next(err);
    }
}));
exports.promise = promise;
const handleValidatorErrors = (err, req, res, next) => {
    if (!err) {
        return next();
    }
    if (err instanceof joi_1.ValidationError) {
        res.status(400).json({ error: err.details, });
    }
    else
        throw err;
};
exports.handleValidatorErrors = handleValidatorErrors;
exports.default = { promise: exports.promise };
function wrapAsync(fn) {
    function asyncifyWrap(req, res, next) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                return yield fn.apply(null, arguments);
            }
            catch (err) {
                next(err);
            }
        });
    }
    return asyncifyWrap;
}
exports.wrapAsync = wrapAsync;
//   console.log(fn);
//   return async function(req: any, res: any, next: any) {
//     // Make sure to `.catch()` any errors and pass them along to the `next()`
//     // middleware in the chain, in this case the error handler.
//     const result = fn(req, res);
//     Promise.resolve(result).catch(next);
//   };
// }
