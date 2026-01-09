
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, PlayCircle, Star, Brain, Lightbulb, Layers, ChevronRight } from 'lucide-react';
import { Course, SiteSettings } from '../types';

const CATEGORIES = [
  { id: 'all', name: 'All Modules', icon: Book },
  { id: 'basics', name: 'Trading ABC', icon: Lightbulb },
  { id: 'strategies', name: 'Master Strategies', icon: Star },
  { id: 'psychology', name: 'Mindset & Psychology', icon: Brain },
];

const Academy = ({ courses, settings }: { courses: Course[], settings: SiteSettings }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-10 py-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 uppercase">
            <span className="text-zinc-100">
              {settings.brandName}
            </span> 
            <span className="ml-3 text-blue-500 underline decoration-blue-700 underline-offset-[12px] decoration-4">
              Academy
            </span>
          </h1>
          <p className="text-zinc-500 font-medium mt-4">{settings.announcement}</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap text-[10px] font-bold uppercase tracking-widest ${
              selectedCategory === cat.id 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            <cat.icon size={16} />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map(course => (
          <Link 
            key={course.id}
            to={`/academy/${course.id}`}
            className="group glass rounded-[2.5rem] border-zinc-800/50 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all duration-500 flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="aspect-video relative overflow-hidden">
               <img src={course.thumbnail} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={course.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
               <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-[8px] font-bold uppercase tracking-widest rounded-lg">
                    {course.level}
                  </span>
               </div>
            </div>
            <div className="p-8 space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-zinc-100 group-hover:text-blue-500 transition-colors">{course.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                 <div className="flex items-center gap-2 text-zinc-400">
                    <Layers size={14} />
                    <span className="text-[10px] font-bold uppercase">{course.chapters.length} Chapters</span>
                 </div>
                 <div className="text-blue-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start Learning <ChevronRight size={14} />
                 </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Academy;
