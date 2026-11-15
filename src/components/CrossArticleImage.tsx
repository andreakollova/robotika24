'use client';

import { useState } from 'react';

export default function CrossArticleImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width: 220, height: 138, objectFit: 'cover', display: 'block' }}
    />
  );
}
