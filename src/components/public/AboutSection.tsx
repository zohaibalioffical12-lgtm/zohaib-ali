import React from 'react';
import { Compass, Heart, Award, CheckCircle2, Quote } from 'lucide-react';
import { WebsiteContent, SchoolSettings } from '../../types';

interface AboutSectionProps {
  content?: WebsiteContent;
  settings?: SchoolSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content, settings }) => {
  const institution = settings?.institutionName || 'The Muslim School & College';
  const aboutTitle = content?.aboutUsTitle || `About ${institution}`;
  const aboutText =
    content?.aboutUsText ||
    'Established with a vision to harmonize modern scientific inquiry with timeless prophetic character. We provide an intellectually challenging and morally protective environment for both young men and young women in Mardan, Pakistan.';
  const missionText =
    content?.missionText ||
    'To cultivate well-rounded, God-conscious Muslim citizens equipped with the intellectual rigor, technological proficiency, and moral courage necessary to excel in higher education and lead societal development.';
  const visionText =
    content?.visionText ||
    'To be the premier benchmark Islamic educational institution globally, recognized for producing trailblazing scientists, physicians, engineers, and scholars who personify Islamic integrity and service to humanity.';
  const principalMsg =
    content?.principalMessage ||
    'At The Muslim School & College, Mardan, we cultivate intellectual passion, modesty, and academic discipline. Our students excel in science, college pre-medical/pre-engineering, and Quranic recitation under qualified scholars.';
  const principalName = content?.principalName || 'Dr. Tariq Mahmood, Ph.D.';
  const principalDesignation = content?.principalDesignation || `Principal, ${institution}, Mardan`;

  return (
    <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Legacy of Knowledge &amp; Virtue
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            {aboutTitle}
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
            {aboutText}
          </p>
        </div>

        {/* Mission, Vision & Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{missionText}</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Balanced secular and religious education</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Critical thinking &amp; STEM excellence</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Islamic ethics &amp; personal responsibility</span>
              </li>
            </ul>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{visionText}</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>100% University admission placement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Pioneering research and innovation labs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Preservation of pristine Islamic heritage</span>
              </li>
            </ul>
          </div>

          {/* Values */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Core Pillars (Ihsan)</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our culture is grounded on foundational Islamic pillars:
            </p>
            <div className="mt-4 space-y-2 text-xs text-slate-700">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-emerald-800">1. Iman (Faith):</span> Deepening conviction in Allah and living by Quranic guidance.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-emerald-800">2. Ilm (Knowledge):</span> Pursuing scientific truth and intellectual mastery.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-emerald-800">3. Adab (Character):</span> Exemplary manners, humility, and compassion.
              </div>
            </div>
          </div>
        </div>

        {/* Principal's Message */}
        <div className="mt-16 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white relative shadow-xl overflow-hidden border border-amber-400/30">
          <Quote className="absolute right-8 bottom-6 w-32 h-32 text-white/5 pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-slate-800 border-2 border-amber-400/60 p-1 shrink-0 overflow-hidden shadow-md flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-800 text-amber-300 font-bold text-2xl flex items-center justify-center mb-1">
                  TM
                </div>
                <span className="text-[10px] text-slate-300">{principalName}</span>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block px-3 py-1 rounded-md bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                Message from the Principal
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                &ldquo;Educating the Mind without Educating the Heart is No Education at All&rdquo;
              </h3>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                {principalMsg}
              </p>
              <div className="mt-4">
                <p className="font-bold text-white text-base">{principalName}</p>
                <p className="text-xs text-amber-300">{principalDesignation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
