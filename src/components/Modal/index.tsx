
import React, { ReactNode } from "react";

import clsx from "clsx";
import { motion } from "framer-motion";

interface IModalProps {
  isVisible: boolean;
  children: ReactNode | ReactNode[];
  rootClassName?: string;
}

const Modal = ({ isVisible, children, rootClassName }: IModalProps) => {
  // Variants for the modal animation
  const variants = {
    hidden: { opacity: 0, scale: 0.75 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    isVisible && (
      <div className="fixed votigram-grid inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000]">
        <motion.div
          className={clsx(
            `bg-modal-background rounded-lg shadow-lg w-full`,
            rootClassName
          )}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={variants}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {children}
        </motion.div>
      </div>
    )
  );
};

export default Modal;
