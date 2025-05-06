import React, { useState, useRef, useEffect } from 'react';
import { message } from 'antd';

export default function ReceivingProcessPage() {
  const [inputs, setInputs] = useState({
    storingOrderId: '',
    airwayBillNumber: '',
    billOfEntryId: ''
  });
  const [step, setStep] = useState<'SO' | 'AWB' | 'BOE'>('SO');
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ 최초 렌더링 시 input에 자동 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ✅ 바코드 처리 함수
  const handleBarcode = (value: string) => {
    if (!value) return;

    if (step === 'SO' && value.startsWith('SO')) {
      setInputs(prev => ({ ...prev, storingOrderId: value }));
      setStep('AWB');
      message.success('✅ SO 입력 완료');
    } else if (step === 'AWB' && value.startsWith('AWB')) {
      setInputs(prev => ({ ...prev, airwayBillNumber: value }));
      setStep('BOE');
      message.success('✅ AWB 입력 완료');
    } else if (step === 'BOE' && value.startsWith('BOE')) {
      setInputs(prev => ({ ...prev, billOfEntryId: value }));
      message.success('✅ BOE 입력 완료! 전송 준비 중...');
      setTimeout(() => {
        sendToScannerAPI();
      }, 400);
    } else {
      message.warning(`⚠️ ${step} 순서에 맞는 바코드를 입력하세요`);
    }

    // 입력창 비우고 포커스 유지
    if (inputRef.current) {
      inputRef.current.value = '';
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // ✅ 입력 시 Enter 처리 포함
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const raw = e.currentTarget.value.trim();
      const value = raw.replace(/[\r\n]/g, '');
      handleBarcode(value);
    }
  };


  // ✅ API 전송
  const sendToScannerAPI = async () => {
    const { storingOrderId, airwayBillNumber, billOfEntryId } = inputs;
    const payload = { storingOrderId, airwayBillNumber, billOfEntryId };

    try {
      const res = await fetch("https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/dev/scanner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        message.success("🚀 전송 완료!");
        setInputs({ storingOrderId: '', airwayBillNumber: '', billOfEntryId: '' });
        setStep('SO');
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        message.error("❌ 전송 실패: " + (data?.error || 'Unknown error'));
      }
    } catch (err) {
      message.error("❌ 네트워크 오류");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>📦 바코드 스캔 (SO → AWB → BOE)</h2>

      <div style={{ marginBottom: '1rem' }}>
        <strong>현재 단계:</strong> <span style={{ color: '#1677ff' }}>{step}</span>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div>✅ SO: {inputs.storingOrderId || <em>미입력</em>}</div>
        <div>✅ AWB: {inputs.airwayBillNumber || <em>미입력</em>}</div>
        <div>✅ BOE: {inputs.billOfEntryId || <em>미입력</em>}</div>
      </div>

      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder="바코드를 스캔하거나 입력 후 Enter"
        autoFocus
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
    </div>
  );
}
