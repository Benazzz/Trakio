import Modal from "./Modal";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="confirm-body">
        <p>{message}</p>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
