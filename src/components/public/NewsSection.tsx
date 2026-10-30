import React from 'react';
import { Announcement } from '../../types';
import { Bell, Calendar, Tag, AlertTriangle, ArrowRight } from 'lucide-react';

export const NewsSection: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => {
  return (
    <section id="news" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Latest Bulletins &amp; Circulars
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            School News &amp; Official Notices
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Stay informed with official circulars, academic calendar alerts, examinations, and
            institutional conferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`rounded-2xl p-6 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                ann.priority === 'urgent'
                  ? 'bg-amber-50/60 border-amber-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {ann.priority === 'urgent' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                    <span>{ann.category}</span>
                  </span>

                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ann.date}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {ann.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-4">
                  {ann.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-emerald-800">{ann.authorName}</span>
                <span className="text-[11px] text-slate-400 capitalize">Audience: {ann.targetAudience}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
