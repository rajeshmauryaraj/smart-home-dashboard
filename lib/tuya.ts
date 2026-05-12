import crypto from "crypto";

const accessId = process.env.TUYA_ACCESS_ID!;
const accessSecret = process.env.TUYA_ACCESS_SECRET!;

export async function getToken() {
  const t = Date.now().toString();

  // 🔥 Correct Sign
  const stringToSign = accessId + t;

  const sign = crypto
    .createHmac("sha256", accessSecret)
    .update(stringToSign)
    .digest("hex")
    .toUpperCase();

  const res = await fetch(
    "https://openapi.tuyain.com/v1.0/token?grant_type=1",
    {
      method: "GET",
      headers: {
        client_id: accessId,
        sign: sign,
        t: t,
        sign_method: "HMAC-SHA256",
      },
    }
  );

  const data = await res.json();

  console.log("TOKEN RESPONSE:", data);

  return data.result.access_token;
}