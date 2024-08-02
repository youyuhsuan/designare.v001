// import { firebase_auth } from "@/src/config/firebase";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   UserCredential,
// } from "firebase/auth";
// import { sessionDB } from "";
// import { handleLogin } from "@/app/libs/actions";
// import { Timestamp } from "firebase/firestore";
// type AuthProvider = "credentials" | "google";
// type AuthAction = "signin" | "signup";

// type AuthResult = {
//   userCredential?: UserCredential;
//   error?: string;
// };

// export async function createSession(user: any) {
//   const sessionId = generateUniqueId();
//   const sessionData = {
//     sessionId,
//     userId: user.uid,
//     userEmail: user.email,
//     createdAt: Timestamp.now(),
//     expiresAt: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
//   };
//   await sessionDB.insertSession(sessionData);
//   return sessionData;
// }

// async function authenticateFirebase(
//   action: AuthAction,
//   provider: AuthProvider,
//   email: string,
//   password: string
// ): Promise<AuthResult> {
//   try {
//     let userCredential: UserCredential;
//     if (provider === "credentials") {
//       if (action === "signup") {
//         userCredential = await createUserWithEmailAndPassword(
//           firebase_auth,
//           email,
//           password
//         );
//       } else {
//         userCredential = await signInWithEmailAndPassword(
//           firebase_auth,
//           email,
//           password
//         );
//         const user = userCredential.user;
//         // console.log(
//         //   `authenticateFirebase user: ${JSON.stringify(user, null, 2)}`
//         // );
//         const sessionData = await createSession(user);
//         await handleLogin(sessionData);
//       }
//     } else {
//       throw new Error("Authentication method not implemented");
//     }
//     console.log(`${action === "signup" ? "SignUp" : "SignIn"} successful`);
//     return { userCredential };
//   } catch (error) {
//     if (
//       typeof error === "object" &&
//       error !== null &&
//       "code" in error &&
//       "message" in error
//     ) {
//       // console.log(
//       //   `${action === "signup" ? "SignUp" : "SignIn"} error:`,
//       //   error.code
//       // );
//       return {
//         error: error.code as string,
//       };
//     }
//     return {
//       error: "unknown_error",
//     };
//   }
// }

// function SignUp(provider: AuthProvider, email: string, password: string) {
//   return authenticateFirebase("signup", provider, email, password);
// }

// function SignIn(provider: AuthProvider, email: string, password: string) {
//   return authenticateFirebase("signin", provider, email, password);
// }

// export { authenticateFirebase, SignUp, SignIn };
// export type { AuthResult, AuthAction };
