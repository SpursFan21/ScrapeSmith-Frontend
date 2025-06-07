//frontend\src\app\_components\Toast.tsx

"use client";

import { Fragment } from "react";
import { Transition } from "@headlessui/react";

interface ToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ show, message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Transition
        show={show}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-4 opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transform ease-in duration-200 transition"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="translate-y-4 opacity-0"
      >
        <div className="bg-green-600 text-white px-4 py-3 rounded shadow-lg flex items-center space-x-3">
          <span className="font-medium">{message}</span>
          <button
            onClick={onClose}
            className="text-sm underline hover:text-white focus:outline-none"
          >
            Close
          </button>
        </div>
      </Transition>
    </div>
  );
};

export default Toast;
