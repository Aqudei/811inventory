import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

const AlertContext = createContext();
export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const closeBtnRef = useRef(null);

  const showAlert = useCallback(
    ({ title, message, onConfirm, onClose, closeLabel, confirmLabel }) => {
      setAlert({ title, message, onConfirm, onClose, closeLabel, confirmLabel });
    },
    []
  );

  const handleClose = () => {
    if (alert?.onClose) alert.onClose();
    setAlert(null);
  };

  const handleConfirm = () => {
    if (alert?.onConfirm) alert.onConfirm();
    handleClose();
  };

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && alert) handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [alert]);

  // Autofocus close button for accessibility
  useEffect(() => {
    if (alert && closeBtnRef.current) closeBtnRef.current.focus();
  }, [alert]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={handleClose} // ✅ close on backdrop click
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()} // prevent backdrop click
          >
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800">
              {alert.title}
            </h2>

            {/* Message */}
            <p className="text-sm text-gray-600 mt-3">
              {alert.message}
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                ref={closeBtnRef}
                onClick={handleClose}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {alert?.closeLabel || "Close"}
              </button>

              {alert.onConfirm && (
                <button
                  onClick={handleConfirm}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {alert?.confirmLabel || "Confirm"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
