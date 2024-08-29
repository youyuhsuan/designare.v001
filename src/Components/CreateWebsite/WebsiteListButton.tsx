"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../Button";

const WebsiteListButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const createResponse = await fetch("/api/website", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Website",
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || "Failed to create website");
      }

      const newWebsite = await createResponse.json();
      router.push(`/website/${newWebsite.id}`);
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button $variant="outlined" onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Loading..." : "建立新網站"}
    </Button>
  );
};

export default WebsiteListButton;
