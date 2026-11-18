import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, type) => {
      const id = nextId++;
      setToasts((list) => [...list, { id, message, type }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (message) => show(message, "success"),
      error: (message) => show(message, "error"),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            {t.type === "error" ? (
              <CircleAlert className="toast-icon" size={20} aria-hidden="true" />
            ) : (
              <CircleCheck className="toast-icon" size={20} aria-hidden="true" />
            )}
            <span>{t.message}</span>
            <button
              type="button"
              className="icon-button"
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
