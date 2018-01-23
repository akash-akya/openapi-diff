"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const VError = require("verror");
const httpClient = {
    get: (location) => {
        return new Promise((resolve, reject) => {
            request.get(location, (error, response, body) => {
                if (error) {
                    reject(new VError(error, `ERROR: unable to open ${location}`));
                }
                else if (response.statusCode !== 200) {
                    reject(new VError(error, `ERROR: unable to fetch ${location}. Response code: ${response.statusCode}`));
                }
                else {
                    resolve(body);
                }
            });
        });
    }
};
exports.default = httpClient;
