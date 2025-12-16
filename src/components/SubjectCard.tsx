import { Link } from 'react-router-dom';
import { Atom, FlaskConical, Calculator, ArrowRight } from 'lucide-react';

interface SubjectCardProps {
  name: string;
  slug: string;
  description: string;
  topicCount?: number;
}

const iconMap: Record<string, typeof Atom> = {
  physics: Atom,
  chemistry: FlaskConical,
  mathematics: Calculator,
};

const colorMap: Record<string, string> = {
  physics: 'subject-card-physics',
  chemistry: 'subject-card-chemistry',
  mathematics: 'subject-card-mathematics',
};

const bgColorMap: Record<string, string> = {
  physics: 'bg-physics/10',
  chemistry: 'bg-chemistry/10',
  mathematics: 'bg-mathematics/10',
};

const iconColorMap: Record<string, string> = {
  physics: 'text-physics',
  chemistry: 'text-chemistry',
  mathematics: 'text-mathematics',
};

const SubjectCard = ({ name, slug, description, topicCount = 5 }: SubjectCardProps) => {
  const Icon = iconMap[slug] || Atom;
  const cardClass = colorMap[slug] || 'border-l-primary';
  const bgClass = bgColorMap[slug] || 'bg-primary/10';
  const iconClass = iconColorMap[slug] || 'text-primary';

  return (
    <Link to={`/subjects/${slug}`}>
      <div className={`bg-card rounded-lg shadow-card card-hover p-6 ${cardClass}`}>
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-7 h-7 ${iconClass}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-xl font-semibold text-card-foreground mb-2">{name}</h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{topicCount} Topics</span>
              <span className={`flex items-center gap-1 text-sm font-medium ${iconClass}`}>
                Explore <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;
