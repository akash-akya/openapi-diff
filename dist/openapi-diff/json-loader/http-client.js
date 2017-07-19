"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const q = require("q");
const request = require("request");
const VError = require("verror");
const httpClient = {
    get: (location) => {
        const deferred = q.defer();
        request.get(location, (error, response, body) => {
            if (error) {
                deferred.reject(new VError(error, `ERROR: unable to open ${location}`));
            }
            else if (response.statusCode !== 200) {
                deferred.reject(new VError(error, `ERROR: unable to fetch ${location}. Response code: ${response.statusCode}`));
            }
            else {
                deferred.resolve(body);
            }
        });
        return deferred.promise;
    }
};
exports.default = httpClient;
