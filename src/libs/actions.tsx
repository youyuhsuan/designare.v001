// "use server";

// import { z } from "zod";
// import {
//   authenticateFirebase,
//   AuthResult,
//   AuthAction,
// } from "@/app/libs/authenticateFirebase";
// import { cookies } from "next/headers";
// import Evervault from "@evervault/sdk";

// type Fields = {
//   email: string;
//   password?: string;
// };

// type AuthFormState = {
//   message: string;
//   errors: Partial<Record<keyof Fields, string>> | undefined;
//   fieldValues: Fields;
// };

// const evervault = new Evervault(
//   process.env.EVERVAULT_APP_ID as string,
//   process.env.EVERVAULT_API_KEY as string
// );

// async function handleLogin(insertSessionData: any) {
//   try {
//     const encryptedSessionData = await evervault.encrypt(insertSessionData);
//     const cookieValue =
//       typeof encryptedSessionData === "string"
//         ? encryptedSessionData
//         : JSON.stringify(encryptedSessionData);

//     cookies().set("session", cookieValue, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60 * 24 * 7, // One week
//       path: "/",
//     });
//   } catch (error) {
//     console.error("Failed to set session:", error);
//     throw new Error("Failed to set session");
//   }
// }

// const schema = z.object({
//   email: z.string().email("Invalid email format"),
//   password: z.string().min(6, "Password must be at least 6 characters long"),
// });

// async function authenticate(
//   _currentState: unknown,
//   formData: FormData
// ): Promise<AuthFormState> {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const action = formData.get("action") as AuthAction;

//   // Zod 驗證
//   const validationResult = schema.safeParse({ email, password });
//   if (!validationResult.success) {
//     return handleValidationError(validationResult.error, email);
//   }
//   try {
//     const authenticateFirebaseData = await authenticateFirebase(
//       action,
//       "credentials",
//       email,
//       password
//     );
//     return handleAuthenticationResult(authenticateFirebaseData, action, email);
//   } catch (error) {
//     return handleAuthenticationError(error, email);
//   }
// }

// function handleValidationError(
//   error: z.ZodError,
//   email: string
// ): AuthFormState {
//   const errors = error.issues.reduce((acc, issue) => {
//     const path = issue.path[0] as keyof Fields;
//     acc[path] = issue.message;
//     return acc;
//   }, {} as Partial<Record<keyof Fields, string>>);

//   return {
//     message: "Validation failed",
//     errors,
//     fieldValues: { email, password: "" },
//   };
// }

// function handleAuthenticationResult(
//   result: AuthResult,
//   action: AuthAction,
//   email: string
// ): AuthFormState {
//   if (result.userCredential) {
//     return {
//       message: `${action} successful`,
//       errors: undefined,
//       fieldValues: { email, password: "" },
//     };
//   } else if (result.error) {
//     const { errorMessage, errors } = parseFirebaseError(result.error);
//     console.log(`errorMessage, errors:`, errorMessage, errors);
//     return {
//       message: errorMessage,
//       errors,
//       fieldValues: { email, password: "" },
//     };
//   } else {
//     return {
//       message: "An unexpected error occurred",
//       errors: undefined,
//       fieldValues: { email, password: "" },
//     };
//   }
// }

// function parseFirebaseError(error: string): {
//   errorMessage: string;
//   errors: Partial<Record<keyof Fields, string>>;
// } {
//   let errorMessage = "Authentication failed";
//   let errors: Partial<Record<keyof Fields, string>> = {};

//   switch (error) {
//     case "auth/user-not-found":
//     case "auth/wrong-password":
//       errors = {
//         email: "Invalid email or password",
//         password: "Invalid email or password",
//       };
//       errorMessage = "Invalid credentials";
//       break;
//     case "auth/invalid-email":
//       errors = { email: "Invalid email format" };
//       errorMessage = "Invalid email format";
//       break;
//     case "auth/email-already-in-use":
//       errors = { email: "Email already in use" };
//       errorMessage = "Email already registered";
//       break;
//     default:
//       errorMessage = "An unexpected error occurred";
//   }

//   return { errorMessage, errors };
// }

// function handleAuthenticationError(
//   error: unknown,
//   email: string
// ): AuthFormState {
//   console.error("Authentication error:", error);
//   return {
//     message: "An unexpected error occurred",
//     errors: { email: "Please try again", password: "Please try again" },
//     fieldValues: { email, password: "" },
//   };
// }

// type FormState = {
//   error: string | null;
//   success: boolean;
//   data: any | null;
// };

// const initialState: FormState = {
//   error: null,
//   success: false,
//   data: null,
// };

// export { authenticate, handleLogin };
// export type { Fields, AuthFormState, FormState };
