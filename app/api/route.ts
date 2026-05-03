import crypto from "crypto";

const accessId = process.env.TUYA_ACCESS_ID!;
const accessSecret = process.env.TUYA_ACCESS_SECRET!;

export async function getToken() {
  const t = Date.now().toString();

  const sign = crypto
    .createHmac("sha256", accessSecret)
    .update(accessId + t)
    .digest("hex")
    .toUpperCase();

  const res = await fetch(
    `https://openapi.tuya.in/v1.0/token?grant_type=1`,
    {
      method: "GET",
      headers: {
        client_id: accessId,
        sign,
        t,
        sign_method: "HMAC-SHA256",
      },
    }
  );

  const data = await res.json();
  return data.result?.access_token;
}