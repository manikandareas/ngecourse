import { Clock, Users } from 'lucide-react';
import { Link } from 'react-router';
import type { CoursesQueryResult } from 'sanity.types';
import { urlFor } from '~/lib/sanity-client';
import { CourseBadge } from './course-badge';

export const CourseCard = (props: CoursesQueryResult[number]) => {
  const imageUrl = props.thumbnail ? urlFor(props.thumbnail)?.url() : '';

  return (
    <Link
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      to={`/courses/${props.slug}`}
    >
      <div className="glass-content group hover:-translate-y-1 relative flex h-full flex-col overflow-hidden transition-all duration-200">
        {/* Image Container with Overlay */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <img
            alt={props.title}
            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            src={imageUrl}
          />

          {/* Difficulty Badge - Floating */}
          <div className="absolute top-3 left-3 z-20">
            <CourseBadge difficulty={props.difficulty || 'beginner'} />
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-1 flex-col space-y-4 p-6">
          {/* Title */}
          <h3 className="line-clamp-2 font-medium text-text-primary text-xl tracking-tight transition-colors duration-200">
            {props.title}
          </h3>

          {/* Description */}
          <p className="line-clamp-3 flex-1 text-sm text-text-secondary leading-relaxed">
            {props.description}
          </p>

          {/* Course Stats */}
          <div className="flex items-center gap-4 text-text-muted text-xs">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>2-3 hours</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>1.2k students</span>
            </div>
          </div>

          {/* Topics */}
          {props.topics && props.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {props.topics.slice(0, 3).map((topic) => (
                <span
                  className="inline-flex items-center rounded-full border border-hairline bg-white/5 px-2 py-1 text-text-secondary text-xs transition-colors hover:bg-white/10"
                  key={topic._id}
                >
                  {topic.title}
                </span>
              ))}
              {props.topics.length > 3 && (
                <span className="inline-flex items-center rounded-full border border-hairline bg-white/5 px-2 py-1 text-text-muted text-xs">
                  +{props.topics.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
