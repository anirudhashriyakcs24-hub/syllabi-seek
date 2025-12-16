import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, Award } from 'lucide-react';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface Test {
  id: string;
  title: string;
  description: string;
  total_marks: number;
  topic_id: string;
}

interface Topic {
  id: string;
  name: string;
  slug: string;
  subject_id: string;
}

interface Subject {
  id: string;
  name: string;
  slug: string;
}

const Tests = () => {
  const [tests, setTests] = useState<(Test & { topic: Topic; subject: Subject })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      const { data: testsData } = await supabase.from('tests').select('*');
      const { data: topicsData } = await supabase.from('topics').select('*');
      const { data: subjectsData } = await supabase.from('subjects').select('*');

      if (testsData && topicsData && subjectsData) {
        const enrichedTests = testsData.map((test) => {
          const topic = topicsData.find((t) => t.id === test.topic_id)!;
          const subject = subjectsData.find((s) => s.id === topic?.subject_id)!;
          return { ...test, topic, subject };
        });
        setTests(enrichedTests);
      }
      setLoading(false);
    };
    fetchTests();
  }, []);

  return (
    <AuthProvider>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Practice Tests</h1>
            <p className="text-muted-foreground max-w-2xl">Test your knowledge with MCQ-based practice tests for each topic.</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test, index) => (
                <div key={test.id} className="bg-card rounded-lg shadow-card p-6 card-hover animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{test.title}</h3>
                      <p className="text-sm text-muted-foreground">{test.subject?.name} • {test.topic?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Award className="w-4 h-4" />{test.total_marks} marks</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />5 questions</span>
                  </div>
                  <Link to={`/tests/${test.id}`}>
                    <Button className="w-full btn-accent">Start Test</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </AuthProvider>
  );
};

export default Tests;
