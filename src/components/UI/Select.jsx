import React, { useState, forwardRef } from "react";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { cn } from "../../lib/utils"; // Ensure you have this utility function properly imported or defined in your project

const Select = forwardRef(({ children, className, ...props }, ref) => {
  const radius = 100; // Change this value to increase the radius of the hover effect
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${
              visible ? `${radius}px` : "0px"
            } circle at ${mouseX}px ${mouseY}px,
            var(--blue-500),
            transparent 80%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[2px] rounded-lg transition duration-300 group/select"
    >
      <select
        className={cn(
          `flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent 
           file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
           focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
           disabled:cursor-not-allowed disabled:opacity-50
           dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
           group-hover/select:shadow-none transition duration-400
          `,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    </motion.div>
  );
});

Select.displayName = "Select";

export { Select };
