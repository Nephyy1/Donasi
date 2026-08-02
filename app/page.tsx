'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  const [screen, setScreen] = useState<'start' | 'form' | 'loading' | 'qr'>('start');
  const [formData, setFormData] = useState({ name: '', amount: 10000, message: '' });
  const [qrisData, setQrisData] = useState<string | null>(null);

  const handleStart = () => setScreen('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScreen('loading');

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const { data } = await res.json();
      if (data?.qr_string) {
        setQrisData(data.qr_string);
        setScreen('qr');
      } else {
        setScreen('form');
        alert('ERROR GENERATING QRIS');
      }
    } catch (error) {
      setScreen('form');
      alert('SYSTEM ERROR');
    }
  };

  return (
    <div className="w-full max-w-2xl relative z-10">
      {screen === 'start' && (
        <div className="text-center cursor-pointer" onClick={handleStart}>
          <h1 className="text-4xl md:text-6xl text-yellow-400 mb-8 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] leading-relaxed">DONATION<br/>QUEST</h1>
          <p className="text-xl text-white blinking-cursor">PRESS START</p>
        </div>
      )}

      {screen === 'form' && (
        <div className="dialog-box">
          <h2 className="text-xl text-yellow-400 mb-6">PLAYER SETUP</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm">
            <div className="flex flex-col gap-2">
              <label className="text-white">NAME:</label>
              <input
                type="text"
                className="bg-transparent border-b-2 border-white text-white outline-none focus:border-yellow-400 uppercase font-mono text-lg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-white">HP (AMOUNT):</label>
              <input
                type="number"
                className="bg-transparent border-b-2 border-white text-white outline-none focus:border-yellow-400 font-mono text-lg"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                min="1000"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white">MESSAGE:</label>
              <input
                type="text"
                className="bg-transparent border-b-2 border-white text-white outline-none focus:border-yellow-400 uppercase font-mono text-lg"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className="mt-4 bg-white text-blue-900 py-3 px-4 hover:bg-yellow-400 hover:text-black uppercase cursor-pointer">
              CONTINUE
            </button>
          </form>
        </div>
      )}

      {screen === 'loading' && (
        <div className="text-center mt-20">
          <p className="text-2xl text-white blinking-cursor">NOW LOADING...</p>
        </div>
      )}

      {screen === 'qr' && (
        <div className="dialog-box flex flex-col items-center text-center">
          <h2 className="text-xl text-red-500 mb-4 blinking-cursor">BOSS BATTLE</h2>
          <p className="text-white text-xs mb-6 leading-relaxed">SCAN TO DEFEAT<br/>TARGET: {formData.amount} HP</p>
          
          <div className="bg-white p-4 mb-6 rounded">
            {qrisData && <QRCodeSVG value={qrisData} size={200} />}
          </div>

          <button 
            onClick={() => setScreen('start')}
            className="text-yellow-400 text-xs hover:text-white cursor-pointer mt-2"
          >
            [ RETURN TO TITLE ]
          </button>
        </div>
      )}
    </div>
  );
}
