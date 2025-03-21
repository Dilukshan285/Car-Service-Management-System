// DeleteConfirmationModal.jsx
import React from "react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, workerName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-96 z-50">
        <div className="flex items-center mb-4">
          <svg
            className="h-6 w-6 text-red-500 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-white">Delete Worker</h2>
          <button
            className="ml-auto text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <span className="font-semibold">{workerName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            className="bg-gray-600 text-white rounded-lg py-2 px-4 hover:bg-gray-500 transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition-all duration-200"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;