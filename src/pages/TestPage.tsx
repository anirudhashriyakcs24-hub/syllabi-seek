import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  marks: number;
}

interface Test {
  id: string;
  title: string;
  description: string;
  total_marks: number;
}

const TestPageContent = () => {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;
      const { data: testData } = await supabase.from('tests').select('*').eq('id', testId).single();
      const { data: questionsData } = await supabase.from('test_questions').select('*').eq('test_id', testId).order('order_index');
      setTest(testData);
      setQuestions(questionsData || []);
      setLoading(false);
    };
    fetchTest();
  }, [testId]);

  const handleSubmit = async () => {
    let totalScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) totalScore += q.marks;
    });
    setScore(totalScore);
    setSubmitted(true);

    if (user) {
      await supabase.from('test_attempts').insert({
        user_id: user.id,
        test_id: testId,
        score: totalScore,
        total_marks: test?.total_marks || 5,
        answers,
      });
    }
    toast({ title: 'Test Submitted!', description: `You scored ${totalScore} out of ${test?.total_marks || 5}` });
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-12"><div className="animate-pulse"><div className="h-8 bg-muted rounded w-64 mb-4" /></div></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/tests" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="w-4 h-4" />All Tests</Link>
      <h1 className="font-serif text-2xl font-bold text-foreground mb-2">{test?.title}</h1>
      <p className="text-muted-foreground mb-8">{test?.description}</p>

      {submitted && (
        <div className={`p-6 rounded-xl mb-8 ${score >= (test?.total_marks || 5) / 2 ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'}`}>
          <h2 className="font-serif text-xl font-bold mb-2">Your Score: {score}/{test?.total_marks || 5}</h2>
          <p className="text-muted-foreground">{score >= (test?.total_marks || 5) / 2 ? 'Great job!' : 'Keep practicing!'}</p>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-card rounded-xl shadow-card p-6">
            <h3 className="font-medium mb-4">Q{idx + 1}. {q.question}</h3>
            <div className="space-y-2">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const optionText = q[`option_${opt.toLowerCase()}` as keyof Question] as string;
                const isSelected = answers[q.id] === opt;
                const isCorrect = q.correct_option === opt;
                let bgClass = 'border-border hover:border-accent/50';
                if (submitted) {
                  if (isCorrect) bgClass = 'border-success bg-success/10';
                  else if (isSelected && !isCorrect) bgClass = 'border-destructive bg-destructive/10';
                } else if (isSelected) {
                  bgClass = 'border-accent bg-accent/10';
                }
                return (
                  <button key={opt} disabled={submitted} onClick={() => setAnswers({ ...answers, [q.id]: opt })} className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${bgClass}`}>
                    <span className="w-6 h-6 rounded-full border flex items-center justify-center text-sm font-medium">{opt}</span>
                    <span className="flex-1">{optionText}</span>
                    {submitted && isCorrect && <CheckCircle className="w-5 h-5 text-success" />}
                    {submitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="mt-8 flex gap-4">
          <Button onClick={handleSubmit} className="btn-accent" disabled={Object.keys(answers).length !== questions.length}>Submit Test</Button>
          <Button variant="outline" onClick={() => navigate('/tests')}>Cancel</Button>
        </div>
      )}
      {submitted && <div className="mt-8"><Link to="/tests"><Button className="btn-accent">Back to Tests</Button></Link></div>}
    </div>
  );
};

const TestPage = () => (
  <AuthProvider>
    <Layout>
      <TestPageContent />
    </Layout>
  </AuthProvider>
);

export default TestPage;
