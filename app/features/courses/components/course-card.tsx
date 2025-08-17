import { Clock, Users } from 'lucide-react';
import { Link } from 'react-router';
import type { CoursesQueryResult } from 'sanity.types';
import { Badge } from '~/components/ui/badge';
import { urlFor } from '~/lib/sanity-client';
import { CourseBadge } from './course-badge';

export const CourseCard = (props: CoursesQueryResult[number]) => {
  const imageUrl = props.thumbnail ? urlFor(props.thumbnail)?.url() : '';

  return (
    <Link className="group block h-full" to={`/courses/${props.slug}`}>
      <div className="hover:-translate-y-1 relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-border hover:shadow-black/5 hover:shadow-xl">
        {/* Image Container with Overlay */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
          <h3 className="line-clamp-2 font-semibold text-foreground text-xl tracking-tight transition-colors duration-200 group-hover:text-primary">
            {props.title}
          </h3>

          {/* Description */}
          <p className="line-clamp-3 flex-1 text-muted-foreground text-sm leading-relaxed">
            {props.description}
          </p>

          {/* Course Stats */}
          <div className="flex items-center gap-4 text-muted-foreground text-xs">
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
                <Badge
                  className="bg-muted/50 px-2 py-1 text-xs transition-colors hover:bg-muted"
                  key={topic._id}
                  variant="secondary"
                >
                  {topic.title}
                </Badge>
              ))}
              {props.topics.length > 3 && (
                <Badge
                  className="bg-muted/50 px-2 py-1 text-xs"
                  variant="secondary"
                >
                  +{props.topics.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Call to Action */}
          <div className="flex items-center justify-end border-border/50 border-t pt-3">
            <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="font-medium text-primary text-xs">
                View Course →
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
