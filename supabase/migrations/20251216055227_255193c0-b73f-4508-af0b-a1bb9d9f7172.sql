-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create topics table
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(subject_id, slug)
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create tests table
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_marks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create test_questions table
CREATE TABLE public.test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  marks INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create test_attempts table
CREATE TABLE public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  answers JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read for subjects, topics, videos, tests, questions
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Anyone can view topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Anyone can view tests" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Anyone can view test questions" ON public.test_questions FOR SELECT USING (true);

-- Test attempts policies
CREATE POLICY "Users can view own attempts" ON public.test_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON public.test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample subjects
INSERT INTO public.subjects (name, slug, description, icon, color) VALUES
('Physics', 'physics', 'Master the fundamental laws of nature and motion', 'atom', '#3b82f6'),
('Chemistry', 'chemistry', 'Explore the composition and reactions of matter', 'flask', '#10b981'),
('Mathematics', 'mathematics', 'Build strong foundations in mathematical concepts', 'calculator', '#f59e0b');

-- Insert Physics topics
INSERT INTO public.topics (subject_id, name, slug, description, order_index)
SELECT s.id, t.name, t.slug, t.description, t.order_index
FROM public.subjects s,
(VALUES 
  ('Motion in One Dimension', 'motion-1d', 'Study of objects moving in a straight line', 1),
  ('Laws of Motion', 'laws-of-motion', 'Newton''s three fundamental laws of mechanics', 2),
  ('Work, Energy and Power', 'work-energy-power', 'Understanding energy transformation and conservation', 3),
  ('Gravitation', 'gravitation', 'Universal law of gravitation and planetary motion', 4),
  ('Thermodynamics', 'thermodynamics-physics', 'Heat, temperature, and energy transfer', 5)
) AS t(name, slug, description, order_index)
WHERE s.slug = 'physics';

-- Insert Chemistry topics
INSERT INTO public.topics (subject_id, name, slug, description, order_index)
SELECT s.id, t.name, t.slug, t.description, t.order_index
FROM public.subjects s,
(VALUES 
  ('Atomic Structure', 'atomic-structure', 'Structure of atoms and electronic configuration', 1),
  ('Periodic Table', 'periodic-table', 'Organization and trends in the periodic table', 2),
  ('Chemical Bonding', 'chemical-bonding', 'Types of chemical bonds and molecular structure', 3),
  ('Thermodynamics', 'thermodynamics-chemistry', 'Energy changes in chemical reactions', 4),
  ('Equilibrium', 'equilibrium', 'Chemical equilibrium and Le Chatelier''s principle', 5)
) AS t(name, slug, description, order_index)
WHERE s.slug = 'chemistry';

-- Insert Mathematics topics
INSERT INTO public.topics (subject_id, name, slug, description, order_index)
SELECT s.id, t.name, t.slug, t.description, t.order_index
FROM public.subjects s,
(VALUES 
  ('Sets & Relations', 'sets-relations', 'Fundamentals of set theory and relations', 1),
  ('Trigonometry', 'trigonometry', 'Trigonometric functions and identities', 2),
  ('Quadratic Equations', 'quadratic-equations', 'Solving and analyzing quadratic equations', 3),
  ('Permutations & Combinations', 'permutations-combinations', 'Counting principles and arrangements', 4),
  ('Limits & Continuity', 'limits-continuity', 'Introduction to calculus concepts', 5)
) AS t(name, slug, description, order_index)
WHERE s.slug = 'mathematics';