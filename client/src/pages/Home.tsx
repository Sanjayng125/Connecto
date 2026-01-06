import {
  Phone,
  Video,
  Users,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Star,
} from "lucide-react";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 via-white to-orange-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-600 mx-auto">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                >
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                  <path d="M8.5 12h7" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Connecto
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-yellow-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-yellow-600 transition-colors font-medium"
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-yellow-600 transition-colors font-medium"
              >
                Testimonials
              </a>
              <Link
                to="/login"
                className="px-6 py-2 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full mb-6 shadow-sm">
              <Zap className="text-yellow-600" size={16} />
              <span className="text-sm font-semibold text-yellow-700">
                Crystal Clear WebRTC Voice Calls
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Connect Instantly with
              <span className="bg-linear-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {" "}
                Voice Calls
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience seamless real-time voice communication with your
              contacts. Built with cutting-edge WebRTC technology for
              crystal-clear audio quality.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="group px-8 py-4 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all font-semibold text-lg flex items-center gap-2"
              >
                Start Calling Now
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Link>
              <button className="px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:border-yellow-500 hover:shadow-lg transition-all font-semibold text-lg">
                Watch Demo
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-gray-600 mt-1">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  1M+
                </div>
                <div className="text-gray-600 mt-1">Calls Made</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-gray-600 mt-1">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for seamless voice communication, all in one
              place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group p-8 bg-linear-to-br from-yellow-50 to-orange-50 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-linear-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Phone className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                HD Voice Quality
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Crystal-clear audio powered by WebRTC technology with echo
                cancellation and noise suppression.
              </p>
            </div>

            <div className="group p-8 bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Instant Connection
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with your contacts in seconds. No waiting, no delays -
                just instant voice communication.
              </p>
            </div>

            <div className="group p-8 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-600 leading-relaxed">
                End-to-end encryption ensures your conversations stay private
                and secure at all times.
              </p>
            </div>

            <div className="group p-8 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Contact Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Organize your contacts, add favorites, and manage your
                communication effortlessly.
              </p>
            </div>

            <div className="group p-8 bg-linear-to-br from-red-50 to-orange-50 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-linear-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Globe className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Global Reach
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with anyone, anywhere in the world. No borders, no
                limitations.
              </p>
            </div>

            <div className="group p-8 bg-linear-to-br from-indigo-50 to-blue-50 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Video className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Coming Soon: Video
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Video calling feature is coming soon. Stay tuned for
                face-to-face conversations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        id="how-it-works"
        className="py-24 bg-linear-to-br from-yellow-50 to-orange-50"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Create Account
                </h3>
                <p className="text-gray-600">
                  Sign up in seconds and set up your profile
                </p>
              </div>

              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Add Contacts
                </h3>
                <p className="text-gray-600">
                  Find and add your friends to your contact list
                </p>
              </div>

              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Start Calling
                </h3>
                <p className="text-gray-600">
                  Hit the call button and connect instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy users who trust Connecto
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 bg-linear-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-yellow-500 fill-yellow-500"
                    size={20}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Incidunt dolorum beatae sed voluptatibus voluptates qui."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                  S
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Sarah Johnson
                  </div>
                  <div className="text-sm text-gray-600">Product Manager</div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-yellow-500 fill-yellow-500"
                    size={20}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Maiores distinctio nostrum cumque nemo eaque quidem sit et."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Michael Chen
                  </div>
                  <div className="text-sm text-gray-600">Software Engineer</div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-yellow-500 fill-yellow-500"
                    size={20}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Similique consectetur quidem et laudantium!."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                  E
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Emily Rodriguez
                  </div>
                  <div className="text-sm text-gray-600">Designer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-linear-to-br from-yellow-500 to-orange-500">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-yellow-50 mb-10">
              Join thousands of users and experience crystal-clear voice calls
              today
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-orange-600 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all font-semibold text-lg"
              >
                Create Free Account
              </Link>
              <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-orange-600 transition-all font-semibold text-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-600 mx-auto">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                >
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                  <path d="M8.5 12h7" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Connecto</span>
            </div>

            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 Connecto. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
