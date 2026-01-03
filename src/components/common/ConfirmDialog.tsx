interface ConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message: string;
}

export function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <h3>{title}</h3>
                <p>{message}</p>
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onConfirm}>Confirm</button>
            </div>
        </div>
    );
}
