import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import SubjectCard from '@/components/SubjectCard';
import { AuthProvider } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
}

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching subjects:', error);
      } else {
        setSubjects(data || []);
      }
      setLoading(false);
    };

    fetchSubjects();
  }, []);

  return (
    <AuthProvider>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              All Subjects
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our comprehensive courses in Physics, Chemistry, and Mathematics. 
              Each subject contains multiple topics with video lectures and practice tests.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-muted" />
                    <div className="flex-1">
                      <div className="h-6 bg-muted rounded w-24 mb-2" />
                      <div className="h-4 bg-muted rounded w-full mb-1" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <div key={subject.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <SubjectCard
                    name={subject.name}
                    slug={subject.slug}
                    description={subject.description || ''}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </AuthProvider>
  );
};

export default Subjects;
