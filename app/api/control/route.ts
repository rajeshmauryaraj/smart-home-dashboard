import { NextResponse } from "next/server";

const { TuyaContext } = require("@tuya/tuya-connector-nodejs");

const context = new TuyaContext({
  baseUrl: "https://openapi.tuyain.com",
  accessKey: process.env.TUYA_ACCESS_ID!,
  secretKey: process.env.TUYA_ACCESS_SECRET!,
});

const deviceId = process.env.TUYA_DEVICE_ID!;

export async function POST(req: Request) {
  try {
    const { device, state } = await req.json();

    const codeMap: any = {
      bulb_r1: "switch_1",
      fan_r1: "switch_2",
      tubelight_r1: "switch_3",

      bulb_r2: "switch_11",
      fan_r2: "switch_22",
      tubelight_r2: "switch_33",

      bulb_k: "switch_111",
      tubelight_k: "switch_333",
    };

    const result = await context.request({
      path: `/v1.0/iot-03/devices/${deviceId}/commands`,
      method: "POST",
      body: {
        commands: [
          {
            code: codeMap[device],
            value: state,
          },
        ],
      },
    });

    console.log("TUYA RESULT:", result);

    return NextResponse.json(result);

  } catch (error: any) {
    console.log(error);

    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}