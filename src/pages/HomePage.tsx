import React from 'react';
import { Search, MapPin, BarChart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Land property"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Your Perfect Land Investment
            </h1>
            <p className="text-xl text-white opacity-90 mb-8">
              LandRise empowers you to find, analyze, and evaluate land opportunities with professional tools and insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/search">
                <Button 
                  variant="primary" 
                  size="lg"
                  icon={<Search size={20} />}
                >
                  Find Land
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose LandRise</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides everything you need to make confident land investment decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Search className="text-green-600" size={40} />}
              title="Powerful Search"
              description="Find the perfect land with our advanced search filters and mapping tools."
            />
            <FeatureCard 
              icon={<MapPin className="text-green-600" size={40} />}
              title="Interactive Maps"
              description="View property boundaries, elevations, and nearby points of interest."
            />
            <FeatureCard 
              icon={<BarChart className="text-green-600" size={40} />}
              title="Data Analysis"
              description="Get insights on property values, development potential, and ROI estimates."
            />
            <FeatureCard 
              icon={<Clock className="text-green-600" size={40} />}
              title="Save Time"
              description="Streamline your land buying process with all tools in one platform."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-12 text-center shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Find Your Next Land Opportunity?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of investors, developers, and buyers who have found their perfect property with LandRise.
            </p>
            <div className="flex justify-center flex-wrap gap-4">
              <Link to="/search">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  Start Searching
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from land buyers, developers, and investors who use LandRise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="LandRise helped me find the perfect 10-acre property for my development project. The tools saved me countless hours of research."
              author="Michael J."
              role="Real Estate Developer"
            />
            <TestimonialCard 
              quote="As a first-time land buyer, I was overwhelmed until I found LandRise. Their platform made the search process simple and understandable."
              author="Sarah T."
              role="Land Investor"
            />
            <TestimonialCard 
              quote="I've been in real estate for 15 years, and LandRise has become my go-to tool for finding and analyzing land opportunities for my clients."
              author="David M."
              role="Real Estate Agent"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role }) => {
  return (
    <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
      <div className="text-green-600 mb-4">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-gray-700 mb-6">{quote}</p>
      <div className="mt-auto">
        <p className="font-semibold text-gray-800">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>
  );
};

export default HomePage;