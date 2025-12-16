import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Atom, FlaskConical, Calculator } from 'lucide-react';
import Layout from '@/components/Layout';
import TopicCard from '@/components/TopicCard';
import { AuthProvider } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  order_index: number;
}

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
}

const iconMap: Record<string, typeof Atom> = {
  physics: Atom,
  chemistry: FlaskConical,
  mathematics: Calculator,
};

const colorMap: Record<string, string> = {
  physics: 'from-physics/20 to-physics/5',
  chemistry: 'from-chemistry/20 to-chemistry/5',
  mathematics: 'from-mathematics/20 to-mathematics/5',
};

const iconColorMap: Record<string, string> = {
  physics: 'text-physics',
  chemistry: 'text-chemistry',
  mathematics: 'text-mathematics',
};

const SubjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      // Fetch subject
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('slug', slug)
        .single();

      if (subjectError) {
        console.error('Error fetching subject:', subjectError);
        setLoading(false);
        return;
      }

      setSubject(subjectData);

      // Fetch topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('subject_id', subjectData.id)
        .order('order_index');

      if (topicsError) {
        console.error('Error fetching topics:', topicsError);
      } else {
        setTopics(topicsData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [slug]);

  const Icon = slug ? iconMap[slug] || Atom : Atom;
  const gradientClass = slug ? colorMap[slug] || 'from-primary/20 to-primary/5' : 'from-primary/20 to-primary/5';
  const iconClass = slug ? iconColorMap[slug] || 'text-primary' : 'text-primary';

  if (loading) {
    return (
      <AuthProvider>
        <Layout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-32 mb-8" />
              <div className="h-12 bg-muted rounded w-64 mb-4" />
              <div className="h-6 bg-muted rounded w-full max-w-xl" />
            </div>
          </div>
        </Layout>
      </AuthProvider>
    );
  }

  if (!subject) {
    return (
      <AuthProvider>
        <Layout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="font-serif text-2xl font-bold mb-4">Subject Not Found</h1>
            <Link to="/subjects" className="text-accent hover:underline">
              Back to Subjects
            </Link>
          </div>
        </Layout>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Layout>
        {/* Header */}
        <div className={`bg-gradient-to-b ${gradientClass}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/subjects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All Subjects
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-2xl bg-card shadow-card flex items-center justify-center`}>
                <Icon className={`w-8 h-8 ${iconClass}`} />
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  {subject.name}
                </h1>
                <p className="text-muted-foreground">{topics.length} Topics</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {subject.description}
            </p>
          </div>
        </div>

        {/* Topics List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
            Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                name={topic.name}
                slug={topic.slug}
                description={topic.description || ''}
                index={index}
              />
            ))}
          </div>
        </div>
      </Layout>
    </AuthProvider>
  );
};

export default SubjectDetail;
