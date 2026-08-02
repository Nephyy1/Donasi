import { NextResponse } from 'next/server';
import { Casaku } from 'casaku';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount } = body;

    const casaku = new Casaku({ 
      licenseKey: process.env.CASAKU_LICENSE_KEY as string 
    });

    const qrId = crypto.randomUUID();

    const trx = await casaku.generateQRISv2({
      qr_id: qrId,
      amount: amount,
      packageIds: ["id.dana", "com.shopee.id"],
      qrType: "dynamic",
      paymentMethod: "qris",
      useQris: true,
      useUniqueCode: true,
      expiredInMinutes: 60
    });

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
