import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, FileText, Users, Award } from 'lucide-react';
import Layout from '@/components/Layout';
import SubjectCard from '@/components/SubjectCard';
import { AuthProvider } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const subjects = [
  {
    name: 'Physics',
    slug: 'physics',
    description: 'Master the fundamental laws of nature and motion',
  },
  {
    name: 'Chemistry',
    slug: 'chemistry',
    description: 'Explore the composition and reactions of matter',
  },
  {
    name: 'Mathematics',
    slug: 'mathematics',
    description: 'Build strong foundations in mathematical concepts',
  },
];

const stats = [
  { icon: PlayCircle, value: '45+', label: 'Video Lectures' },
  { icon: FileText, value: '15+', label: 'Practice Tests' },
  { icon: Users, value: '1000+', label: 'Students' },
  { icon: Award, value: '3', label: 'Subjects' },
];

const Index = () => {
  return (
    <AuthProvider>
      <Layout>
        {/* Hero Section */}
        <section className="gradient-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
                Master Physics, Chemistry & Mathematics
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-slide-up">
                Your comprehensive learning platform with video lectures from top educators 
                and practice tests to help you excel in your exams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Link to="/subjects">
                  <Button size="lg" className="btn-accent w-full sm:w-auto gap-2">
                    Start Learning <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="text-center animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subjects Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Choose Your Subject
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select from our comprehensive courses in Physics, Chemistry, and Mathematics. 
                Each subject includes video lectures and practice tests.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <div key={subject.slug} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                  <SubjectCard {...subject} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Learn With Us?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-physics/10 flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-physics" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Video Lectures</h3>
                <p className="text-muted-foreground text-sm">
                  Curated video content from Physics Wallah and other top educators
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-chemistry/10 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-chemistry" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Practice Tests</h3>
                <p className="text-muted-foreground text-sm">
                  MCQ-based tests to evaluate your understanding of each topic
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-mathematics/10 flex items-center justify-center">
                  <Award className="w-8 h-8 text-mathematics" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
                <p className="text-muted-foreground text-sm">
                  Monitor your test scores and identify areas for improvement
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                Join thousands of students who are mastering Physics, Chemistry, and Mathematics with LearnHub.
              </p>
              <Link to="/auth?mode=signup">
                <Button size="lg" className="btn-accent">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </AuthProvider>
  );
};

export default Index;
