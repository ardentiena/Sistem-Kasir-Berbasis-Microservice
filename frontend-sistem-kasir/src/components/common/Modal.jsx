function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h3>{title}</h3>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Tutup">
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default Modal;