import { Link } from 'react-router-dom';
import { PlayCircle, FileText, ArrowRight } from 'lucide-react';

interface TopicCardProps {
  name: string;
  slug: string;
  description: string;
  videoCount?: number;
  hasTest?: boolean;
  index: number;
}

const TopicCard = ({ name, slug, description, videoCount = 2, hasTest = true, index }: TopicCardProps) => {
  return (
    <Link to={`/topics/${slug}`}>
      <div 
        className="bg-card rounded-lg shadow-card card-hover p-5 animate-slide-up"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 font-semibold text-secondary-foreground">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground mb-1 truncate">{name}</h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <PlayCircle className="w-4 h-4" />
                {videoCount} Videos
              </span>
              {hasTest && (
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Practice Test
                </span>
              )}
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;
