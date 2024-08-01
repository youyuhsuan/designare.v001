"use client";

import { Modal } from "@/src/ui/modal";
import Link from "next/link";

export default function Page() {
  return (
    <Modal>
      <h1>Create account</h1>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Enter the username..."
          required
        />
      </div>
      <div>
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter the email..."
          required
        />
      </div>

      <footer>
        <span>
          Already have an account? <Link href="/login">Sign In</Link>
        </span>
      </footer>
    </Modal>
  );
}
