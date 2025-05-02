import { Clock, MapPin, Phone, Shield, PenTool as Tool, Wrench } from "lucide-react";
import { Link } from "react-router-dom"; // Uncommented for navigation
import image from "../../assets/about.jpg";
import image2 from "../../assets/Aboutus1.jpg";
import member1 from "../../assets/member1.jpg";
import member2 from "../../assets/member2.jpg";
import member3 from "../../assets/member3.jpg";
import member4 from "../../assets/member4.jpg";

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Hero Section */}
      <section className="relative w-full h-[300px] md:h-[400px] bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About RevUp</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Your trusted partner for quality automotive care since 2005
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2005, RevUp began with a simple mission: to provide honest, reliable automotive service at
                  fair prices. What started as a small family-owned garage has grown into a full-service automotive
                  center trusted by thousands of customers.
                </p>
                <p>
                  Our founder, Senthuran Wijesinghe, believed that car maintenance shouldn't be intimidating or confusing.
                  He built RevUp on the principles of transparency, expertise, and customer education.
                </p>
                <p>
                  Today, we continue that tradition with state-of-the-art facilities, ASE-certified technicians, and a
                  commitment to embracing the latest automotive technologies while maintaining our personalized approach
                  to customer service.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/services">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Explore Our Services
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <img
                src={image2}
                alt="RevUp Service Center"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              At RevUp, we're driven by a commitment to excellence and customer satisfaction in everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Tool className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every repair and service, using quality parts and thorough workmanship.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-gray-600">
                We believe in honest recommendations, transparent pricing, and never suggesting unnecessary services.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously invest in the latest diagnostic equipment and training to service modern vehicles
                properly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our ASE-certified technicians bring decades of combined experience to every vehicle they service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Senthuran Wijesinghe", role: "Founder & Master Technician", image: member1 },
              { name: "Lakshmi Silva", role: "Service Manager", image: member2 },
              { name: "Shalini Fernando", role: "Customer Service Director", image: member3 },
              { name: "Arjun Dissanayake", role: "Lead Diagnostician", image: member4 },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            {/* Removed as per the commented-out section in the provided code */}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Facilities</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our 10,000 square foot service center is equipped with the latest diagnostic equipment and tools to
                  handle everything from routine maintenance to complex repairs.
                </p>
                <p>
                  We've designed our facility with both efficiency and comfort in mind. While your vehicle is being
                  serviced, enjoy our comfortable waiting area with complimentary Wi-Fi, refreshments, and a kids'
                  corner.
                </p>
                <p>
                  For longer repairs, take advantage of our courtesy shuttle service or discounted rental cars to ensure
                  minimal disruption to your day.
                </p>
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-700">1234 Automotive Drive, Anytown, USA 12345</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-700">(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-700">Mon-Fri: 7:30AM-6:00PM | Sat: 8:00AM-2:00PM</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <img
                src={image}
                alt="RevUp Facilities"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about their RevUp experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dilani Jayasinghe",
                text: "I've been bringing my vehicles to RevUp for over 5 years. Their honesty and quality of work is unmatched. They take the time to explain everything and never push unnecessary services.",
              },
              {
                name: "Ravi Dissanayake",
                text: "As someone who knows very little about cars, I appreciate how the team at RevUp educates me without making me feel foolish. Fair prices, excellent work, and they've earned my trust completely.",
              },
              {
                name: "Suresh Gunawardena",
                text: "The convenience of their digital inspection reports and text updates while my car was being serviced was impressive. Modern approach to car repair with old-fashioned quality service.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-blue-700 rounded-lg shadow-lg p-6">
                <p className="italic mb-4">"{testimonial.text}"</p>
                <p className="font-semibold">— {testimonial.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            {/*<Link to="/testimonials">*/}
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Read More Reviews
              </button>
           {/* </Link> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Experience the RevUp Difference?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Schedule your appointment today and see why so many drivers trust us with their vehicles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/appointment">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                Schedule Service
              </button>
            </Link>
            <Link to="/?scrollTo=contact">
              <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}