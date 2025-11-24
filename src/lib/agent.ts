import { getUserId } from "../utils/userId";

const FUNCTION_URL = import.meta.env.VITE_APPWRITE_FUNCTION_AGENT_URL;

export async function agent(userInput: string) {
  const userId = getUserId();

  if (!userInput?.trim()) {
    throw new Error("Missing userInput");
  }

  if (!FUNCTION_URL) {
    console.error("Agent Function URL is missing in .env");
    return {
      text_answer: "خطای تنظیمات: آدرس هوش مصنوعی یافت نشد.",
      success: false,
    };
  }

  try {
    const payload = {
      userInput,
      userId: userId || "",
    };

    // Call the Appwrite Function directly via HTTP
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId || "",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Function responded with error:", response.status);
      throw new Error(`Function call failed: ${response.status}`);
    }

    // Parse response
    // Appwrite functions usually return JSON, but sometimes plain text if misconfigured
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const result = await response.json();
      return result;
    } else {
      const text = await response.text();
      return { text_answer: text, success: true };
    }
  } catch (error: unknown) {
    console.error("Agent client error:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";

    return {
      text_answer: "خطا در پردازش. لطفاً دوباره تلاش کنید.",
      success: false,
      error: errorMsg,
    };
  }
}
