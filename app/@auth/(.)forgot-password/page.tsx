"use client";

import { Modal } from "@/src/ui/modal";
import Link from "next/dist/client/link";

export default function Page() {
  return (
    <Modal>
      <h1>忘記密碼?</h1>
      <span>
        請輸入您註冊時使用的電子郵件地址，我們將向您發送重設密碼的指示。
        出於安全考慮，我們不會儲存您的密碼。請放心，我們絕不會通過電子郵件發送您的密碼。
      </span>
      <form>
        <label htmlFor="Email">電子郵件</label>
        <input
          type="email"
          name="email"
          placeholder="請輸入您的電子郵件..."
          required
        />
        <button type="submit">重設密碼</button>
      </form>
    </Modal>
  );
}
