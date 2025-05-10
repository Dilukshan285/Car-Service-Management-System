import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, X, ArrowLeft, Check, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUploadForm = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [damageResults, setDamageResults] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const serviceCardsRef = useRef([]);

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' },
    }),
    hover: { scale: 1.03, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)' },
    tap: { scale: 0.98 },
  };

  // Fetch service types from API
  const fetchServiceTypes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/service-types');
      const data = await response.json();
      if (data.success) {
        setServiceTypes(data.data);
      } else {
        console.error('Failed to fetch service types:', data.message);
        alert('Failed to fetch services: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching service types:', error);
      alert('Error fetching services. Please try again.');
    }
  }, []);

  const handleImageUpload = useCallback((e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => [...prev, ...newImageUrls]);
    }
  }, []);

  const removeImage = useCallback((index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newImageUrls = [...imageUrls];
    URL.revokeObjectURL(newImageUrls[index]);
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);

    const newResults = [...damageResults];
    newResults.splice(index, 1);
    setDamageResults(newResults);
  }, [images, imageUrls, damageResults]);

  const analyzeImage = useCallback(async (file) => {
    try {
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });

      const response = await fetch(
        'https://serverless.roboflow.com/etiquetado-de-danos/1?api_key=2bVKk8Gqsb2u59bGvmoK',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: base64Image,
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error analyzing image:', error);
      return { error: 'Failed to analyze image' };
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const analysisPromises = images.map(analyzeImage);
        const results = await Promise.all(analysisPromises);
        setDamageResults(results);
        await fetchServiceTypes();
        setUploaded(true);
      } catch (error) {
        console.error('Error during analysis:', error);
        alert('Failed to analyze images. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [images, analyzeImage, fetchServiceTypes]
  );

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full mx-auto my-12 p-8 bg-white rounded-2xl shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/appointments2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
              <span className="sr-only">Back to booking form</span>
            </motion.button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Upload Car Images</h2>
            <p className="text-sm text-gray-600 mt-1">Upload images to analyze car damage.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {uploaded ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="py-12 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="bg-green-100 rounded-full p-4 mb-6 inline-block"
              >
                <Check className="h-10 w-10 text-green-600" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Analysis Complete</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your images have been analyzed. Review the results and services below.
              </p>

              {/* Damage Results */}
              <div className="w-full max-w-2xl space-y-6 mx-auto">
                {damageResults.map((result, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="p-4 bg-gray-50 rounded-lg shadow-md"
                  >
                    <img
                      src={imageUrls[index]}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-gray-700">
                      {result.error ? (
                        result.error
                      ) : (
                        <>
                          <span className="font-semibold">Detected Damage:</span>{' '}
                          {result.predictions?.length > 0
                            ? result.predictions.map((p) => p.class).join(', ')
                            : 'No damage detected'}
                        </>
                      )}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Service Types Section */}
              {serviceTypes.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full max-w-2xl mt-12 mx-auto"
                >
                  <motion.h3
                    className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Wrench className="h-6 w-6 text-blue-600" />
                    Recommended Services
                  </motion.h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {serviceTypes.map((service, index) => (
                      <motion.div
                        key={service._id}
                        ref={(el) => (serviceCardsRef.current[index] = el)}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        whileTap="tap"
                        custom={index}
                        className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:border-blue-200 transition-all duration-300"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
                          <Wrench className="h-5 w-5 text-blue-600" />
                          {service.name}
                        </h4>
                        {service.description && (
                          <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                        )}
                        {service.features.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
                            {service.features.map((feature, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.2 + i * 0.05 }}
                              >
                                {feature}
                              </motion.li>
                            ))}
                          </ul>
                        )}
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Estimated Time:</span> {service.estimatedTime} minutes
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <Link to="/booking">
                <motion.button
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold mt-8"
                >
                  Back to Booking
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Image Upload Area */}
              <div className="space-y-6">
                <motion.div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50"
                  whileHover={{ borderColor: '#9CA3AF' }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <Upload className="h-12 w-12 text-gray-500" />
                    <p className="text-lg font-medium text-gray-800">Drop or select images</p>
                    <p className="text-sm text-gray-500">JPG, PNG (up to 5MB)</p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <motion.button
                      type="button"
                      variants={cardVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Select Files
                    </motion.button>
                  </div>
                </motion.div>

                {/* Image Previews */}
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                    {imageUrls.map((url, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative group rounded-lg overflow-hidden shadow-md"
                      >
                        <img src={url} alt={`Image ${index + 1}`} className="w-full h-32 object-cover" />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Footer */}
          {!uploaded && (
            <div className="flex justify-between items-center mt-10">
              <Link to="/booking">
                <motion.button
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Booking
                </motion.button>
              </Link>
              <motion.button
                type="submit"
                disabled={loading || images.length === 0}
                variants={cardVariants}
                whileHover={loading || images.length === 0 ? {} : 'hover'}
                whileTap={loading || images.length === 0 ? {} : 'tap'}
                className={`px-6 py-3 rounded-lg font-semibold text-white shadow-md ${
                  loading || images.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Images'
                )}
              </motion.button>
            </div>
          )}
        </form>
      </motion.div>

      {/* Loading Sidebar */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 right-0 h-full w-80 bg-blue-600 text-white p-6 shadow-2xl"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center justify-center h-full"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="mb-4"
              >
                <svg className="h-12 w-12 text-white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Processing Images</h3>
              <p className="text-sm text-blue-100 text-center">Please wait while we analyze your images...</p>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
                className="w-full h-2 bg-blue-300 rounded-full mt-4"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploadForm;