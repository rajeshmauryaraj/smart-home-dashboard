import { NextResponse } from "next/server";

const { TuyaContext } =
  require("@tuya/tuya-connector-nodejs");

const context = new TuyaContext({
  baseUrl: "https://openapi.tuyain.com",
  accessKey: process.env.TUYA_ACCESS_ID!,
  secretKey: process.env.TUYA_ACCESS_SECRET!,
});

const deviceId = process.env.TUYA_DEVICE_ID!;

export async function GET() {
  try {

    const result = await context.request({
      path: `/v1.0/iot-03/devices/${deviceId}/status`,
      method: "GET",
    });

    return NextResponse.json(result);

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}