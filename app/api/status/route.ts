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

    // 🔥 DEVICE INFO
    const deviceInfo = await context.request({
      path: `/v1.0/iot-03/devices/${deviceId}`,
      method: "GET",
    });

    // 🔥 DEVICE STATUS
    const deviceStatus = await context.request({
      path: `/v1.0/iot-03/devices/${deviceId}/status`,
      method: "GET",
    });

    return NextResponse.json({
      online: deviceInfo.result.online,
      result: deviceStatus.result,
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}