import { v4 as uuidv4 } from "uuid";

export function getUserId(): string {
  let userId = localStorage.getItem("formBuilderUserId");

  if (!userId) {
    userId = uuidv4();
    localStorage.setItem("formBuilderUserId", userId);
    console.log("New User ID created:", userId);
  }

  return userId;
}

// We don't need getAuthHeaders anymore because we aren't using fetch() to our own API.
// But we can keep a helper if we need to pass ID to other services.
export function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    "x-user-id": getUserId(),
  };
}

export function clearUserId(): void {
  localStorage.removeItem("formBuilderUserId");
}
