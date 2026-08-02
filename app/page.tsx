'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function DonatePage() {
  const [formData, setFormData] = useState({ name: '', amount: 10000, message: '' });
  const [qrisData, setQrisData] = useState<string | null>(null);
  const [screen, setScreen] = useState<'form' | 'qr'>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    const { data, message } = await res.json();
    
    if (data?.qr_string) {
      setQrisData(data.qr_string);
      setScreen('qr');
    } else {
      setScreen('form');
      alert(`ERROR: ${message || 'GAGAL GENERATE QRIS'}`); 
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">Support Creator</h1>
      
      {screen === 'form' ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nama"
            className="border p-2 rounded text-black"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Nominal"
            className="border p-2 rounded text-black"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            min="1000"
            required
          />
          <textarea
            placeholder="Pesan"
            className="border p-2 rounded text-black"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Generate QRIS
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold text-black">Scan QRIS untuk Donasi</p>
          {qrisData && <QRCodeSVG value={qrisData} size={250} />}
          <button 
            onClick={() => {
              setQrisData(null);
              setScreen('form');
            }}
            className="mt-4 text-blue-600 font-medium"
          >
            Buat Donasi Baru
          </button>
        </div>
      )}
    </div>
  );
}
