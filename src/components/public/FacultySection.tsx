import React from 'react';
import { Teacher } from '../../types';
import { Mail, GraduationCap, Award, Phone } from 'lucide-react';

export const FacultySection: React.FC<{ teachers: Teacher[] }> = ({ teachers }) => {
  return (
    <section id="faculty" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Distinguished Faculty &amp; Mentors
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Meet Our Esteemed Scholars &amp; Educators
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Our instructional team comprises Ph.D. holders, M.Phil researchers, experienced board
            examiners, and certified Islamic scholars committed to unlocking student excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-slate-900 text-amber-300 font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md">
                    {teacher.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      teacher.gender === 'male'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {teacher.gender === 'male' ? "Boys Wing Faculty" : "Girls Wing Faculty"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
                      {teacher.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-800 truncate">
                      {teacher.designation}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-4 pt-3 border-t border-slate-100">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-700">{teacher.qualification}</span>
                  </div>
                  {teacher.specialization && (
                    <div className="flex items-start gap-2">
                      <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{teacher.specialization}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {teacher.assignedSubjects.map((sub, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <a
                  href={`mailto:${teacher.email}`}
                  className="flex items-center gap-1.5 hover:text-emerald-700 truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
