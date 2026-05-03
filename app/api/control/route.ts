import { NextResponse } from "next/server";
import crypto from "crypto";
import { getToken } from "@/lib/tuya";

const accessId = process.env.TUYA_ACCESS_ID!;
const accessSecret = process.env.TUYA_ACCESS_SECRET!;
const deviceId = process.env.TUYA_DEVICE_ID!;
const USE_MOCK = process.env.USE_MOCK === "true";

function generateSign(t: string, token: string) {
  return crypto
    .createHmac("sha256", accessSecret)
    .update(accessId + token + t)
    .digest("hex")
    .toUpperCase();
}

export async function POST(req: Request) {
  const { device, state } = await req.json();

  // 🔥 MOCK MODE
  if (USE_MOCK) {
    return NextResponse.json({
      success: true,
      mode: "mock",
      device,
      state,
    });
  }

  // 🔥 REAL MODE
  const token = await getToken();
  const t = Date.now().toString();
  const sign = generateSign(t, token);

  const codeMap: any = {
    bulb: "switch_1",
    fan: "switch_2",
    tubelight: "switch_3",
  };

  const res = await fetch(
    `https://openapi.tuya.in/v1.0/iot-03/devices/${deviceId}/commands`,
    {
      method: "POST",
      headers: {
        client_id: accessId,
        access_token: token,
        sign,
        t,
        sign_method: "HMAC-SHA256",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commands: [
          {
            code: codeMap[device],
            value: state,
          },
        ],
      }),
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}