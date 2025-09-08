export default function ConfirmationModal({ isOpen, todoText, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Delete Todo?</h3>
                <p>Are you sure you want to delete "<span className="todo-text">{todoText}</span>"?</p>
                <div className="modal-actions">
                    <button onClick={onCancel}>Cancel</button>
                    <button className="btn-delete" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}