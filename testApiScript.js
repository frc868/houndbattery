var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
(function () { return __awaiter(_this, void 0, void 0, function () {
    var fetchJson, tokenResponse, token, addBatteryResponse, batteryData, getBatteryResponse, batteryDetails, logResponse, logData, getLogResponse, logDetails;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fetchJson = function (url, options) { return __awaiter(_this, void 0, void 0, function () {
                    var response, text, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, fetch(url, options)];
                            case 1:
                                response = _a.sent();
                                return [4 /*yield*/, response.text()];
                            case 2:
                                text = _a.sent();
                                console.log("Response from ".concat(url, ": ").concat(text));
                                return [2 /*return*/, JSON.parse(text)];
                            case 3:
                                error_1 = _a.sent();
                                console.error('Error fetching JSON:', error_1);
                                return [2 /*return*/, null];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, fetchJson('https://techhounds.club/api/oauth/token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            clientName: 'TechHOUNDS',
                            clientId: 'OlOKdxFd249GaTUUNhApMZUd9itRZo1B',
                            clientSecret: 'oaiv+aIHsrUYlrNGuWieCUmAVlvfTMlXaXf2lDhxLdw73MpFp/Rrx9EMpCLn352Tm4q/6K2vXGt2oX6vhBnrVJ4sqqaRRb09adsGvC6Q/SrryFdQ5stAXSDDJPGIxmMA2oXrHNkajm1PkA9uXEMAuG1ULg36ZaIC73LilDJcInjrI6me3K89IhKciD+OpFwPiUlgArFEeCTipBlFS2tOasyFFy+8EOnX5TegGmrakAIFQZcnEy2rf83NYDQqioOgALg3HLzxEmP22VWcax6b7+nkbU7Kf2attjw1BK8Fr52+8He4PsBSBFbXUCkxzKGwqV8S3ItXW0HBD79Tvjg=='
                        }),
                    })];
            case 1:
                tokenResponse = _a.sent();
                if (!tokenResponse || !tokenResponse.token) {
                    console.error('Failed to obtain bearer token');
                    return [2 /*return*/];
                }
                token = tokenResponse.token;
                return [4 /*yield*/, fetchJson('https://techhounds.club/api/battery', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer ".concat(token),
                        },
                        body: JSON.stringify({ name: 'NewBattery' }),
                    })];
            case 2:
                addBatteryResponse = _a.sent();
                if (!addBatteryResponse) {
                    console.error('Failed to add battery');
                    return [2 /*return*/];
                }
                batteryData = addBatteryResponse;
                console.log('Added Battery:', batteryData);
                return [4 /*yield*/, fetchJson("https://techhounds.club/api/battery/".concat(batteryData.id), {
                        method: 'GET',
                        headers: { 'Authorization': "Bearer ".concat(token) },
                    })];
            case 3:
                getBatteryResponse = _a.sent();
                if (!getBatteryResponse) {
                    console.error('Failed to get battery details');
                    return [2 /*return*/];
                }
                batteryDetails = getBatteryResponse;
                console.log('Battery Details:', batteryDetails);
                return [4 /*yield*/, fetchJson('https://techhounds.club/api/batterylog', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer ".concat(token),
                        },
                        body: JSON.stringify({
                            batteryId: batteryData.id,
                            voltage: 12.7,
                            enteredAt: new Date().toISOString(),
                        }),
                    })];
            case 4:
                logResponse = _a.sent();
                if (!logResponse) {
                    console.error('Failed to add battery log');
                    return [2 /*return*/];
                }
                logData = logResponse;
                console.log('Battery Log:', logData);
                return [4 /*yield*/, fetchJson("https://techhounds.club/api/batterylog/".concat(logData.id), {
                        method: 'GET',
                        headers: { 'Authorization': "Bearer ".concat(token) },
                    })];
            case 5:
                getLogResponse = _a.sent();
                if (!getLogResponse) {
                    console.error('Failed to get battery log details');
                    return [2 /*return*/];
                }
                logDetails = getLogResponse;
                console.log('Log Details:', logDetails);
                return [2 /*return*/];
        }
    });
}); })();
