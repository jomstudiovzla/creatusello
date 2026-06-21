"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBcvRate = void 0;
const functions = __importStar(require("firebase-functions/v2"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
exports.updateBcvRate = functions.scheduler.onSchedule('every day 08:00', async (event) => {
    try {
        const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        if (!response.ok) {
            throw new Error(`Error fetching BCV API: ${response.statusText}`);
        }
        const data = await response.json();
        const rate = data.promedio;
        if (rate && typeof rate === 'number') {
            await admin.firestore().collection('configuracion').doc('tasa_bcv').set({
                vesPerUsd: rate,
                lastUpdated: new Date().toISOString(),
                source: 've.dolarapi.com/v1/dolares/oficial'
            }, { merge: true });
            console.log(`✅ BCV Rate successfully updated to Bs. ${rate} / USD`);
        }
        else {
            throw new Error('Invalid rate format received from API');
        }
    }
    catch (error) {
        console.error('❌ Error updating BCV Rate:', error);
    }
});
//# sourceMappingURL=index.js.map