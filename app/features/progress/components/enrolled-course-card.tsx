import { CheckCircle, Play } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { urlFor } from '~/lib/sanity-client';
import {
  formatProgressPercentage,
  getCourseStatusInfo,
  getProgressBarColor,
} from '../utils/progressCalculations';

interface EnrolledCourseCardProps {
  course: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    difficulty: string;
    thumbnail?: {
      asset?: {
        _ref: string;
        _type: string;
      };
      hotspot?: unknown;
      crop?: unknown;
    };
    topics?: Array<{ _id: string; title: string; slug: string }>;
  };
  percentComplete: number;
  dateCompleted?: string;
}

export const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({
  course,
  percentComplete,
  dateCompleted,
}) => {
  const imageUrl = course.thumbnail ? urlFor(course.thumbnail)?.url() : '';
  const { status, statusText, statusColor } = getCourseStatusInfo(
    percentComplete,
    dateCompleted
  );
  const progressBarColor = getProgressBarColor(percentComplete);

  return (
    <div className="tinted-blur-subtle group hover:-translate-y-1 relative flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:bg-white/8">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <img
          alt={course.title}
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          src={imageUrl || '/api/placeholder/400/225'}
        />

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-20">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 font-medium text-xs ${statusColor} backdrop-blur-sm`}
          >
            {status === 'completed' && <CheckCircle className="h-3 w-3" />}
            {status === 'in-progress' && <Play className="h-3 w-3" />}
            {statusText}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col space-y-4 p-6">
        {/* Title */}
        <h3 className="line-clamp-2 font-medium text-text-primary text-xl tracking-tight">
          {course.title}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-text-secondary leading-relaxed">
          {course.description}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Progress</span>
            <span className="font-medium text-text-primary">
              {formatProgressPercentage(percentComplete)}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-700">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${progressBarColor}`}
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Topics */}
        {course.topics && course.topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {course.topics.slice(0, 2).map((topic) => (
              <span
                className="inline-flex items-center rounded-full border border-hairline bg-white/5 px-2 py-1 text-text-secondary text-xs"
                key={topic._id}
              >
                {topic.title}
              </span>
            ))}
            {course.topics.length > 2 && (
              <span className="inline-flex items-center rounded-full border border-hairline bg-white/5 px-2 py-1 text-text-muted text-xs">
                +{course.topics.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-1 items-end">
          <Button
            asChild
            className="w-full"
            variant={status === 'completed' ? 'secondary' : 'default'}
          >
            <Link to={`/courses/${course.slug}`}>
              {status === 'completed' ? 'Review Course' : 'Continue Learning'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
