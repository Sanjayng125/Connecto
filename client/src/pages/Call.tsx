import { MessageCircle, Users, Phone, Video } from "lucide-react";

const Call = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-2 max-md:hidden">
      <div className="text-center max-w-md px-6 py-8">
        <div className="relative mb-3">
          <div className="w-28 h-28 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
            <Phone className="text-white" size={40} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Select a Contact to Call
        </h1>

        <p className="text-gray-600 mb-3">
          Choose a contact from the list to start a voice call or view their
          profile
        </p>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <FeatureCard
            icon={<Video className="text-yellow-600" size={24} />}
            title="Voice Calls"
            description="Crystal clear audio quality"
          />
          <FeatureCard
            icon={<Users className="text-yellow-600" size={24} />}
            title="Contact Management"
            description="Add, favorite, and organize contacts"
          />
          <FeatureCard
            icon={<MessageCircle className="text-yellow-600" size={24} />}
            title="Quick Connect"
            description="One-click calling experience"
          />
        </div>

        <div className="mt-8 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">💡 Tip:</span> Click on any contact
            from the left sidebar to get started
          </p>
        </div>
      </div>
    </div>
  );
};

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="p-2 bg-yellow-50 rounded-lg shrink-0">{icon}</div>
      <div className="text-left">
        <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default Call;
