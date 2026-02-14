import React, { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

const SayuPage = () => {
  const [status, setStatus] = useState<string>('대기 중...');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setStatus('Gemini 엔진 연결 시도 중...');
    
    try {
      const generateAIText = httpsCallable(functions, 'generateAIText');
      
      const response = await generateAIText();
      const data = response.data as any;

      setStatus('✅ 연결 성공!');
      setResult(`[모델] ${data.model}\n[지역] ${data.region}\n[메시지] ${data.message}`);
      
    } catch (error: any) {
      console.error(error);
      setStatus('❌ 연결 실패');
      setResult(error.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">SAYU 엔진 룸</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4 min-h-[100px] whitespace-pre-wrap">
        <p className="font-semibold text-gray-700">{status}</p>
        <hr className="my-2 border-gray-300"/>
        <p className="text-sm text-gray-600">{result}</p>
      </div>

      <button
        onClick={handleTestConnection}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-bold text-white transition-colors
          ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
        `}
      >
        {isLoading ? '엔진 가동 중...' : 'Gemini 연결 테스트'}
      </button>
    </div>
  );
};

export default SayuPage;
