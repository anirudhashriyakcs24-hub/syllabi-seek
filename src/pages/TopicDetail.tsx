import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, FileText, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  subject_id: string;
}

interface Video {
  id: string;
  title: string;
  youtube_url: string;
  description: string;
  order_index: number;
}

interface Test {
  id: string;
  title: string;
  description: string;
  total_marks: number;
}

interface Subject {
  id: string;
  name: string;
  slug: string;
}

const getYouTubeEmbedUrl = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

const TopicDetail = () => {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!topicSlug) return;

      // Fetch topic
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('*')
        .eq('slug', topicSlug)
        .single();

      if (topicError) {
        console.error('Error fetching topic:', topicError);
        setLoading(false);
        return;
      }

      setTopic(topicData);

      // Fetch subject
      const { data: subjectData } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', topicData.subject_id)
        .single();

      setSubject(subjectData);

      // Fetch videos
      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .eq('topic_id', topicData.id)
        .order('order_index');

      setVideos(videosData || []);
      if (videosData && videosData.length > 0) {
        setActiveVideo(videosData[0]);
      }

      // Fetch tests
      const { data: testsData } = await supabase
        .from('tests')
        .select('*')
        .eq('topic_id', topicData.id);

      setTests(testsData || []);
      setLoading(false);
    };

    fetchData();
  }, [topicSlug]);

  if (loading) {
    return (
      <AuthProvider>
        <Layout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-32 mb-8" />
              <div className="h-12 bg-muted rounded w-64 mb-4" />
              <div className="aspect-video bg-muted rounded-xl" />
            </div>
          </div>
        </Layout>
      </AuthProvider>
    );
  }

  if (!topic) {
    return (
      <AuthProvider>
        <Layout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="font-serif text-2xl font-bold mb-4">Topic Not Found</h1>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/subjects" className="hover:text-foreground transition-colors">
              Subjects
            </Link>
            <span>/</span>
            {subject && (
              <>
                <Link to={`/subjects/${subject.slug}`} className="hover:text-foreground transition-colors">
                  {subject.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{topic.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                {topic.name}
              </h1>
              <p className="text-muted-foreground mb-6">{topic.description}</p>

              {/* Video Player */}
              {activeVideo && (
                <div className="mb-8">
                  <div className="aspect-video rounded-xl overflow-hidden bg-muted shadow-card mb-4">
                    <iframe
                      src={getYouTubeEmbedUrl(activeVideo.youtube_url)}
                      title={activeVideo.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{activeVideo.title}</h3>
                  {activeVideo.description && (
                    <p className="text-muted-foreground text-sm">{activeVideo.description}</p>
                  )}
                </div>
              )}

              {/* Video List */}
              {videos.length > 1 && (
                <div className="mb-8">
                  <h2 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-accent" />
                    Video Lectures
                  </h2>
                  <div className="space-y-2">
                    {videos.map((video, index) => (
                      <button
                        key={video.id}
                        onClick={() => setActiveVideo(video)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          activeVideo?.id === video.id
                            ? 'border-accent bg-accent/5'
                            : 'border-border hover:border-accent/50 hover:bg-secondary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            activeVideo?.id === video.id
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{video.title}</h4>
                            {video.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">{video.description}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Practice Test Card */}
              {tests.length > 0 && (
                <div className="bg-card rounded-xl shadow-card p-6 mb-6">
                  <h2 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    Practice Tests
                  </h2>
                  <div className="space-y-3">
                    {tests.map((test) => (
                      <Link key={test.id} to={`/tests/${test.id}`}>
                        <div className="p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-secondary/30 transition-all">
                          <h3 className="font-medium text-foreground mb-1">{test.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {test.total_marks} marks • MCQ based
                          </p>
                          <Button size="sm" className="mt-3 w-full btn-accent">
                            Start Test
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-card rounded-xl shadow-card p-6">
                <h2 className="font-semibold text-foreground mb-4">Quick Links</h2>
                <div className="space-y-2">
                  {subject && (
                    <Link 
                      to={`/subjects/${subject.slug}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to {subject.name}
                    </Link>
                  )}
                  <Link 
                    to="/tests"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    All Tests
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AuthProvider>
  );
};

export default TopicDetail;
