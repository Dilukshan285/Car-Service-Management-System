import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, X, ArrowLeft, Check } from 'lucide-react';

const ImageUploadForm = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages([...images, ...filesArray]);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newImageUrls]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newImageUrls = [...imageUrls];
    URL.revokeObjectURL(newImageUrls[index]);
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUploaded(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto my-12 p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/appointments2">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
              <span className="sr-only">Back to booking form</span>
            </button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Upload Your Car Images</h2>
            <p className="text-sm text-gray-600 mt-1">Show us your car or any issues—make it quick and easy!</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {uploaded ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
              <div className="bg-green-100 rounded-full p-4 mb-6 animate-bounce">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Images Uploaded Successfully!</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Your images are now linked to your appointment. We’ll review them soon!
              </p>
              <Link to="/appointments2">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg">
                  Back to Booking
                </button>
              </Link>
            </div>
          ) : (
            <>
              {/* Image Upload Area */}
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center bg-gradient-to-b from-gray-50 to-gray-100 hover:border-gray-500 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Upload className="h-12 w-12 text-gray-500" />
                    <p className="text-lg font-medium text-gray-800">Drop files here or click to upload</p>
                    <p className="text-sm text-gray-500">JPG, PNG, or PDF (up to 5MB)</p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <button
                      type="button"
                      className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Select Files
                    </button>
                  </div>
                </div>

                {/* Image Previews */}
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                    {imageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <img
                          src={url}
                          alt={`Uploaded image ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label htmlFor="description" className="text-sm font-semibold text-gray-800">
                  Image Description (Optional)
                </label>
                <textarea
                  id="description"
                  className="w-full min-h-[120px] rounded-lg border border-gray-300 p-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-gray-50"
                  placeholder="Tell us what these images show (e.g., 'Dent on left door', 'Engine warning light')"
                />
              </div>
            </>
          )}

          {/* Footer */}
          {!uploaded && (
            <div className="flex justify-between items-center mt-10">
              <Link to="/appointment">
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Booking
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading || images.length === 0}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md ${
                  loading || images.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  'Upload Images'
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ImageUploadForm;