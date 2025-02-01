'use client'
import { useEffect } from "react";

const AdSense = (adSlot:any) => {
  useEffect(() => {
    if ((window as any)) {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your publisher ID
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSense;