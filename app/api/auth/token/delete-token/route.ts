export async function deleteServerToken(userId: string): Promise<void> {
  try {
    await tokenDB.deleteToken(userId);
    cookies().delete("token");
    console.log("Token deleted successfully");
  } catch (error) {
    console.error("Failed to delete token:", error);
    throw new Error("Failed to delete token");
  }
}
