import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Award, Clock } from 'lucide-react';
import Layout from '@/components/Layout';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TestAttempt {
  id: string;
  score: number;
  total_marks: number;
  completed_at: string;
  test_id: string;
}

interface Test {
  id: string;
  title: string;
}

const ProfileContent = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<(TestAttempt & { test: Test })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchAttempts = async () => {
      if (!user) return;
      const { data: attemptsData } = await supabase.from('test_attempts').select('*').eq('user_id', user.id).order('completed_at', { ascending: false });
      const { data: testsData } = await supabase.from('tests').select('*');
      if (attemptsData && testsData) {
        const enriched = attemptsData.map((a) => ({ ...a, test: testsData.find((t) => t.id === a.test_id)! }));
        setAttempts(enriched);
      }
      setLoading(false);
    };
    fetchAttempts();
  }, [user]);

  if (authLoading || !user) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-card rounded-xl shadow-card p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <User className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4" />{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-card p-8">
        <h2 className="font-serif text-xl font-bold text-foreground mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-accent" />Test History</h2>
        {loading ? (
          <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted rounded" />)}</div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">You haven't taken any tests yet.</p>
            <Link to="/tests" className="text-accent hover:underline">Browse Tests</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <h3 className="font-medium text-foreground">{attempt.test?.title || 'Test'}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(attempt.completed_at).toLocaleDateString()}</p>
                </div>
                <div className={`text-lg font-bold ${attempt.score >= attempt.total_marks / 2 ? 'text-success' : 'text-destructive'}`}>
                  {attempt.score}/{attempt.total_marks}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Profile = () => (
  <AuthProvider>
    <Layout>
      <ProfileContent />
    </Layout>
  </AuthProvider>
);

export default Profile;
