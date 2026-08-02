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
        'x-license-key': process.env.CASAKU_LICENSE_KEY as string
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

    return NextResponse.json({ 
      success: true, 
      data: {
        qr_string: trx.data.qr_string,
        transaction_id: trx.data.transactionId
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
