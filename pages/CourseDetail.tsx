
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PlayCircle, 
  ChevronLeft, 
  CheckCircle2, 
  BookOpen, 
  MessageSquare, 
  Send, 
  BrainCircuit,
  Lock,
  Clock
} from 'lucide-react';
import { User, Lesson, Course } from '../types';
import { getLessonQA } from '../services/gemini';

interface CourseDetailProps {
  user: User;
  setUser: (u: User) => void;
  courses: Course[];
}

const CourseDetail: React.FC<CourseDetailProps> = ({ user, setUser, courses }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courses.find(c => c.id === courseId);
  
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(
    course?.chapters[0]?.lessons[0] || null
  );
  
  const [qaInput, setQaInput] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [qaResponse, setQaResponse] = useState<string | null>(null);

  if (!course) return <div className="p-10 text-center text-zinc-500 uppercase font-black tracking-widest">Course not found</div>;

  const handleQA = async () => {
    if (!qaInput.trim() || !activeLesson) return;
    setQaLoading(true);
    setQaResponse(null);
    try {
      const response = await getLessonQA(qaInput, `Lesson: ${activeLesson.title}. Content Summary: ${activeLesson.content.substring(0, 300)}`);
      setQaResponse(response || "No response from AI.");
    } catch (e) {
      setQaResponse("Maaf kijiye, Rashid AI is waqt masroof hai. Dobara koshish karein.");
    } finally {
      setQaLoading(false);
    }
  };

  const isCompleted = (lessonId: string) => user.completedLessons?.includes(lessonId);

  const toggleComplete = (lessonId: string) => {
    const current = user.completedLessons || [];
    const updated = current.includes(lessonId) 
      ? current.filter(id => id !== lessonId)
      : [...current, lessonId];
    setUser({ ...user, completedLessons: updated });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 animate-in fade-in duration-500">
      <Link to="/academy" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
        <ChevronLeft size={16} /> Back to Academy
      </Link>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass rounded-[2.5rem] overflow-hidden border-zinc-800 bg-zinc-950 aspect-video shadow-2xl relative group">
             {activeLesson?.videoUrl ? (
               <iframe 
                  src={activeLesson.videoUrl} 
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={activeLesson.title}
                  loading="lazy"
               ></iframe>
             ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8 bg-zinc-950">
                  <PlayCircle size={64} className="text-blue-500 opacity-20" />
                  <h2 className="text-xl font-bold text-zinc-600 uppercase tracking-tight">Video content is being updated...</h2>
               </div>
             )}
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-zinc-800 space-y-6 bg-zinc-900/10 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-3xl font-black uppercase tracking-tight">{activeLesson?.title}</h1>
              {activeLesson && (
                <button 
                  onClick={() => toggleComplete(activeLesson.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isCompleted(activeLesson.id) 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-green-500/50 hover:text-green-500'
                  }`}
                >
                  <CheckCircle2 size={16} /> {isCompleted(activeLesson.id) ? 'Lesson Finished' : 'Mark as Done'}
                </button>
              )}
            </div>
            <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed font-medium text-sm">
              <p className="whitespace-pre-wrap">{activeLesson?.content}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="glass rounded-[2.5rem] border-zinc-800 shadow-2xl overflow-hidden sticky top-24">
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
               <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <BookOpen size={16} className="text-blue-500" /> Syllabus
               </h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto no-scrollbar">
              {course.chapters.map((chapter, cIdx) => (
                <div key={chapter.id} className="border-b border-zinc-800/50 last:border-0">
                  <div className="px-6 py-4 bg-zinc-900/20">
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Module {cIdx + 1}</p>
                     <h4 className="text-xs font-bold text-zinc-300">{chapter.title}</h4>
                  </div>
                  <div className="py-1">
                    {chapter.lessons.map(lesson => (
                      <button 
                        key={lesson.id}
                        onClick={() => {
                          setActiveLesson(lesson);
                          setQaResponse(null);
                        }}
                        className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all group ${
                          activeLesson?.id === lesson.id 
                            ? 'bg-blue-600/10 border-r-4 border-blue-600' 
                            : 'hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                           {isCompleted(lesson.id) ? (
                             <CheckCircle2 size={16} className="text-green-500" />
                           ) : (
                             <PlayCircle size={16} className={`group-hover:text-blue-500 ${activeLesson?.id === lesson.id ? 'text-blue-500' : 'text-zinc-700'}`} />
                           )}
                           <span className={`text-[11px] font-bold ${activeLesson?.id === lesson.id ? 'text-blue-500' : 'text-zinc-500'}`}>
                             {lesson.title}
                           </span>
                        </div>
                        <Clock size={12} className="text-zinc-800" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
