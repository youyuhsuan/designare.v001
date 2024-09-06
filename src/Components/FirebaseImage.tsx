import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ref, getDownloadURL } from "firebase/storage";
import { firebase_storage } from "../config/firebaseClient";

interface FirebaseImageProps {
  id: string;
  src: string;
  style?: React.CSSProperties;
  alt: string;
}

const FirebaseImage: React.FC<FirebaseImageProps> = ({
  id,
  src,
  style = {},
  alt,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (typeof src === "string") {
          const imageRef = ref(firebase_storage, src);
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } else {
          setImageUrl(src);
        }
      } catch (err) {
        console.error("Error fetching image:", err);
        setError("Failed to load image");
      }
    };
    fetchImage();
  }, [src]);

  if (error) {
    return <div style={style}>{error}</div>;
  }

  if (!imageUrl) {
    return <div style={style}>Loading...</div>;
  }

  const width = style.width ? parseInt(style.width.toString()) : 100;
  const height = style.height ? parseInt(style.height.toString()) : 100;

  const { width: _, height: __, ...restStyle } = style;

  return (
    <div style={{ position: "relative", width, height }}>
      <Image
        key={id}
        src={imageUrl}
        alt={alt || ""}
        layout="fill"
        objectFit={
          (style.objectFit as
            | "cover"
            | "contain"
            | "fill"
            | "none"
            | "scale-down") || "cover"
        }
        style={restStyle}
      />
    </div>
  );
};

export default FirebaseImage;
