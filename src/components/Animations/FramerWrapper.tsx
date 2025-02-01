"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
type FramerMotionProps = {
    children: React.ReactNode,
    className?:any,
    y?:number
    x?:number
    delay?:number
    duration?: number
}
function FramerWrapper({children,delay = 0.25 ,y = 15, x = 0, className,duration = .25}:FramerMotionProps) {
  return (
    <AnimatePresence>
      <motion.div
      initial={{opacity:0, y:y, x:x}}
      animate={{opacity:1, y:0, x:0}}
      exit={{opacity:0, y:15}}
      transition={{delay:delay, duration:duration}}
      className={className}
      >{children}</motion.div>
    </AnimatePresence>
  );
}

export default FramerWrapper;
