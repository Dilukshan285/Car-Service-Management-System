import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col items-center">
        <FaExclamationTriangle className="text-yellow-500 text-6xl mb-4" />
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Unauthorized</h1>
        <p className="text-gray-600 text-lg mb-6 text-center">
          You do not have permission to access this page.
        </p>

        <Link
          to="/"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
