import { SparklesIcon, UsersIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { HeroVideoDialog } from '~/components/ui/hero-video-dialog';
import Star25 from '~/components/ui/s25';
import Star26 from '~/components/ui/s26';

interface ICourseTrailerProps {
  trailerUrl: string;
  youtubeId: string;
}
function Trailer(props: ICourseTrailerProps) {
  return (
    <Card className=" group gap-0 overflow-hidden p-0 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
      <CardHeader className="bg-pink-500 pt-4 pb-2 transition-all duration-300">
        <div className="flex items-center gap-2">
          <Star25 className="text-white" size={20} />
          <h3 className="font-mono font-semibold text-base text-white">
            Course Trailer
          </h3>
        </div>
      </CardHeader>
      <CardContent className="w-full overflow-hidden p-0">
        <HeroVideoDialog
          className="transition-transform duration-300 group-hover:scale-105"
          title="Course Trailer"
          videoUrl={props.trailerUrl}
          youtubeId={props.youtubeId}
        />
      </CardContent>
    </Card>
  );
}

function HelpCard() {
  return (
    <Card className="group overflow-hidden pt-0 transition-all duration-300 hover:shadow-green-500/20 hover:shadow-lg">
      <CardHeader className="bg-green-500 pt-4 pb-2 transition-all duration-300">
        <div className="flex items-center gap-2">
          <Star26 className="text-white" size={20} />
          <h3 className="font-mono font-semibold text-base text-white">
            Need Help?
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 transition-colors duration-200 hover:bg-green-100">
          <div className="rounded-full bg-green-500 p-2">
            <UsersIcon className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              Community Support
            </p>
            <p className="text-gray-600 text-xs">
              Get help from peers & mentors
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 transition-colors duration-200 hover:bg-blue-100">
          <div className="rounded-full bg-blue-500 p-2">
            <SparklesIcon className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">AI Assistant</p>
            <p className="text-gray-600 text-xs">24/7 coding help available</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const DetailInformation = {
  HelpCard,
  Trailer,
};
