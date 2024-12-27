import { ConfirmDeleteDialogProps } from '@/types';
import { X } from 'lucide-react';



export function ConfirmDeleteDialog({ onConfirm, onCancel,title }: ConfirmDeleteDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Delete {title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this sheet? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}