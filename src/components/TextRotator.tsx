import React from "react";

function TextRotator() {
  return (
    <ul className="block text-left  text-4xl sm:text-[45px] leading-tight [&_li]:block animate-text-slide">
      <li>Amazon</li>
      <li>Flipkart</li>
      <li>Ajio</li>
      <li>Nike</li>
      <li>Croma</li>
      <li>And More</li>
    </ul>
  );
}

export default TextRotator;
