import fs from "fs";
import path from "path";

const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const runEmailSimulator = async () => {

  const filePath = path.join(
    __dirname,
    "../../email-data-advanced.json"
  );

  const rawData = fs.readFileSync(filePath, "utf-8");

  const emails = JSON.parse(rawData);

  for (const email of emails) {

    console.log(
      `Streaming email: ${email.message_id}`
    );

    await delay(1000);
  }
};