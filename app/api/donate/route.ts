import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount } = body;
    const qrId = crypto.randomUUID();

    const response = await fetch('https://api.casaku.id/api/generate/v2/qris', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-license-key': process.env.CASAKU_LICENSE_KEY || ''
      },
      body: JSON.stringify({
        qr_id: qrId,
        amount: amount,
        packageIds: ["id.dana", "com.shopee.id"],
        qrType: "dynamic",
        paymentMethod: "qris",
        useQris: true,
        useUniqueCode: true,
        expiredInMinutes: 60
      })
    });

    const trx = await response.json();

    if (!response.ok || trx.status !== 200) {
       return NextResponse.json({ 
         success: false, 
         message: trx.message || JSON.stringify(trx) 
       }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        qr_string: trx.data?.qr_string,
        transaction_id: trx.data?.transactionId
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
