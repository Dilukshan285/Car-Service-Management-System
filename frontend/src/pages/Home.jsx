
import React, { useState, useEffect, useRef } from 'react';
import Footer from "../../src/components/Footer.jsx";
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from "lucide-react"; // Added lucide-react icons



const Home = () => {
  // State for contact form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  // State for model viewer loading
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);

  // State to toggle additional services visibility
  const [showAllServices, setShowAllServices] = useState(false);

  // State for highlighting the Contact Us heading
  const [highlight, setHighlight] = useState(false);

  // Ref for the Contact Us heading section
  const contactHeadingRef = useRef(null);

  // Access query parameters
  const location = useLocation();

  // Load the model-viewer script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.onload = () => setModelViewerLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Auto-scroll to Contact section if query parameter is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('scrollTo') === 'contact') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        // Scroll to the section
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Adjust scroll position to account for a fixed header (e.g., 80px height)
        const headerOffset = 80; // Adjust this value based on your header height
        const elementPosition = contactSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Trigger highlight effect
        setHighlight(true);
      }
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  // Toggle visibility of additional services
  const handleViewAllServices = () => {
    setShowAllServices(!showAllServices);
  };

  // Scroll to services section
  const handleScrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="flex-1 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Hero Section with 3D Model */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-800/60 to-gray-700/40 z-10" />
        <div className="container mx-auto relative z-20 h-[600px] text-white px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between h-full">
            {/* Text and Buttons */}
            <div className="flex flex-col items-start justify-center lg:w-1/2 space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                Professional Auto Care <br /> You Can Trust
              </h1>
              <p className="text-lg md:text-xl max-w-md text-gray-200">
                Expert mechanics, quality parts, and exceptional service for all your vehicle needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg">
                  <Link to="/appointment">Book Service Now</Link>
                </button>
                <button
                  onClick={handleScrollToServices}
                  className="border border-gray-300 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-100/10 transition-all duration-300"
                >
                  View Services
                </button>
              </div>
            </div>

            {/* 3D Model */}
            {modelViewerLoaded && (
              <model-viewer
                id="threedd"
                src="/v8_engine.glb"
                alt="A 3D model of a Mazda RX-7 car"
                auto-rotate
                camera-controls
                disable-zoom
                ar
                animation-name="v8_engine"
                autoplay
                animation-loop
                className="lg:w-1/2 w-full"
                style={{
                  maxWidth: '700px',
                  height: '500px',
                  opacity: 1,
                }}
              >
                <p slot="default" style={{ textAlign: 'center', fontSize: '1.2rem', color: 'white' }}>
                  Next Level Car
                </p>
              </model-viewer>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Technicians</h3>
              <p className="text-gray-700">
                Our certified mechanics have years of experience with all vehicle makes and models.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Service</h3>
              <p className="text-gray-700">
                We value your time and work efficiently to get you back on the road quickly.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-700">
                All our repairs and services come with a satisfaction guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              We offer a comprehensive range of automotive services to keep your vehicle running at its best.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Initial Services (Always Visible) */}
            <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🛢️</span>
                <h3 className="text-lg font-semibold text-gray-900">Oil Changes</h3>
              </div>
              <p className="text-gray-700">
                Regular oil changes to keep your engine running smoothly and extend its life.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🚘</span>
                <h3 className="text-lg font-semibold text-gray-900">Brake Service</h3>
              </div>
              <p className="text-gray-700">
                Inspection, repair, and replacement of brake pads, rotors, and brake systems.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔋</span>
                <h3 className="text-lg font-semibold text-gray-900">Battery Service</h3>
              </div>
              <p className="text-gray-700">
                Testing, maintenance, and replacement of car batteries for reliable starts.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🛠️</span>
                <h3 className="text-lg font-semibold text-gray-900">Engine Repair</h3>
              </div>
              <p className="text-gray-700">
                Diagnostic and repair services for all types of engine problems and maintenance.
              </p>
            </div>

            {/* Additional Services (Shown on Button Click) */}
            {showAllServices && (
              <>
                <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🍩</span>
                    <h3 className="text-lg font-semibold text-gray-900">Tire Service</h3>
                  </div>
                  <p className="text-gray-700">
                    Tire rotation, alignment, and replacement for optimal performance and safety.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">⚙️</span>
                    <h3 className="text-lg font-semibold text-gray-900">Transmission Repair</h3>
                  </div>
                  <p className="text-gray-700">
                    Expert repair and maintenance for automatic and manual transmissions.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🌡️</span>
                    <h3 className="text-lg font-semibold text-gray-900">Suspension Work</h3>
                  </div>
                  <p className="text-gray-700">
                    Suspension inspection, repair, and upgrades for a smooth ride.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">❄️</span>
                    <h3 className="text-lg font-semibold text-gray-900">AC Service</h3>
                  </div>
                  <p className="text-gray-700">
                    AC repair, recharge, and maintenance for a comfortable driving experience.
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={handleViewAllServices}
              className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {showAllServices ? 'Hide Services' : 'View All Services'}
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center items-center bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 border border-gray-300">
              {modelViewerLoaded && (
                <model-viewer
                  id="car3d"
                  src="/car.glb"
                  alt="A 3D model of a car"
                  auto-rotate
                  camera-controls
                  disable-zoom
                  ar
                  animation-name="car"
                  autoplay
                  animation-loop
                  loading="eager"
                  className="w-full"
                  style={{
                    maxWidth: '450px',
                    height: '450px',
                    opacity: 0.9,
                    border: 'none',
                    outline: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <p
                    slot="default"
                    style={{
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      color: 'white',
                      margin: 0,
                      padding: '5px',
                      background: 'transparent',
                    }}
                  >
                    Explore Our Car
                  </p>
                  <style>
                    {`
                      model-viewer::part(default-progress-bar) {
                        display: none !important;
                      }
                    `}
                  </style>
                </model-viewer>
              )}
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">About RevUp</h2>
              <p className="text-gray-700 mb-6">
                For over 15 years, RevUp has been providing top-quality automotive services to our community.
                We take pride in our work and are committed to delivering exceptional service at fair prices.
              </p>
              <p className="text-gray-700 mb-6">
                Our team of certified mechanics has the expertise and experience to handle all makes and models. We use
                the latest diagnostic equipment and quality parts to ensure your vehicle performs at its best.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  <span className="text-gray-800">Certified Mechanics</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  <span className="text-gray-800">Quality Parts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  <span className="text-gray-800">Fair Pricing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  <span className="text-gray-800">Warranty Offered</span>
                </div>
              </div>
              <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about our services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-yellow-500"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-gray-700">
                "I've been taking my cars to RevUp for years. They're always honest, fair, and do excellent work. I wouldn't trust my vehicles with anyone else!"
              </p>
              <div className="font-semibold text-gray-800">- Dilani Jayasinghe</div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-yellow-500"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-gray-700">
                "The team at RevUp is amazing! They fixed my car quickly and at a reasonable price. Their customer service is top-notch. Highly recommend!"
              </p>
              <div className="font-semibold text-gray-800">- Ravi Dissanayake</div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-yellow-500"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-gray-700">
                "I was impressed by how thorough and professional the mechanics were. They explained everything clearly and didn't try to sell me services I didn't need. Great experience!"
              </p>
              <div className="font-semibold text-gray-800">- Suresh Gunawardena</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-gradient-to-br from-gray-100 via-gray-200 to-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div
                ref={contactHeadingRef}
                className={`transition-all duration-1000 ${
                  highlight ? 'bg-blue-50 p-4 rounded-lg shadow-md' : ''
                }`}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <p className="text-gray-700 mb-8">
                  Have questions or want to schedule a service? Reach out to us using the form or contact information below.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-700">123 Auto Service Lane, Cartown, CT 12345</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-700">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-700">info@revup.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Hours</h3>
                    <p className="text-gray-700">Monday - Friday: 8am - 6pm</p>
                    <p className="text-gray-700">Saturday: 8am - 2pm</p>
                    <p className="text-gray-700">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-white rounded-lg shadow-lg p-8 border border-gray-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Send Us a Message</h3>
                <p className="text-gray-700 mb-6">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-800">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-800">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your email"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-800">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-800">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your vehicle and service needs"
                      className="w-full p-3 border border-gray-300 rounded-lg h-28 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <Footer/>

    </main>
  );
};

export default Home;