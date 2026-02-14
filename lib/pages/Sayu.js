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
const react_1 = __importStar(require("react"));
const functions_1 = require("firebase/functions");
const firebase_1 = require("../firebase");
const SayuPage = () => {
    const [status, setStatus] = (0, react_1.useState)('대기 중...');
    const [result, setResult] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const handleTestConnection = async () => {
        setIsLoading(true);
        setStatus('Gemini 엔진 연결 시도 중...');
        try {
            const generateAIText = (0, functions_1.httpsCallable)(firebase_1.functions, 'generateAIText');
            const response = await generateAIText();
            const data = response.data;
            setStatus('✅ 연결 성공!');
            setResult(`[모델] ${data.model}\n[지역] ${data.region}\n[메시지] ${data.message}`);
        }
        catch (error) {
            console.error(error);
            setStatus('❌ 연결 실패');
            setResult(error.message || '알 수 없는 오류가 발생했습니다.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">SAYU 엔진 룸</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4 min-h-[100px] whitespace-pre-wrap">
        <p className="font-semibold text-gray-700">{status}</p>
        <hr className="my-2 border-gray-300"/>
        <p className="text-sm text-gray-600">{result}</p>
      </div>

      <button onClick={handleTestConnection} disabled={isLoading} className={`w-full py-3 rounded-lg font-bold text-white transition-colors
          ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
        `}>
        {isLoading ? '엔진 가동 중...' : 'Gemini 연결 테스트'}
      </button>
    </div>);
};
exports.default = SayuPage;
