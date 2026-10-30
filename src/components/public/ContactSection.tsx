import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { SchoolSettings } from '../../types';

interface ContactSectionProps {
  settings?: SchoolSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Admissions Inquiry',
    message: '',
  });

  const address = settings?.address || 'Main Road, Gujrat Near Ground, Mardan, Pakistan';
  const phone = settings?.contactNumber || '+92 313 9375355';
  const email = settings?.officialEmail || 'themuslimschool&collage12@gmail.com';
  const ownerEmail = settings?.ownerEmail || 'zohaibalioffical12@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            We Are Here to Assist You
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Contact Us &amp; Campus Locations
          </h2>
          <div className="w-20 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Have questions regarding admissions, curriculum, or visiting our campuses in Mardan? Get in touch
            with our administrative secretariat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details & Campuses */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-700" />
                <span>Central Campus Information</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Main Campus Address:</p>
                    <p>{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Official Telephone / WhatsApp:</p>
                    <p>Hotline: {phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Official Electronic Correspondence:</p>
                    <p>Official School Email: <span className="font-bold text-emerald-800">{email}</span></p>
                    <p>Super Admin / Owner: <span className="text-slate-700">{ownerEmail}</span></p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Office &amp; Visitor Hours:</p>
                    <p>Monday to Thursday: 07:45 AM – 02:30 PM</p>
                    <p>Friday: 07:45 AM – 12:30 PM (Zuhr Jumu&apos;ah prayer at 01:15 PM)</p>
                    <p>Saturday: 08:30 AM – 01:30 PM (Admissions &amp; Information Desk Only)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Boys & Girls Wings Entrance Note */}
            <div className="p-5 rounded-2xl bg-emerald-950 text-white border border-amber-400/30 text-xs leading-relaxed">
              <div className="flex items-center gap-2 text-amber-300 font-bold mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Notice Regarding Campus Entry:</span>
              </div>
              <p className="text-slate-300">
                In strict adherence to our institutional modesty guidelines, male visitors must report
                to the Main Gate &amp; Boys Wing Secretariat (Gate 1). Female guardians and visitors
                enter through the designated Girls Wing Executive Reception (Gate 2).
              </p>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Send an Official Inquiry</h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out this message form and our public relations office will respond promptly.
            </p>

            {submitted ? (
              <div className="text-center py-10 bg-white rounded-xl border border-emerald-200 p-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="font-bold text-base text-slate-900">Message Received!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Thank you for reaching out to Muslim School &amp; College. Our secretariat will get
                  back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Salman Jamil"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 300 0000000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Admissions Inquiry">Admissions Inquiry (Classes PG to 12)</option>
                    <option value="Fee Structure & Scholarship">Fee Structure &amp; Scholarship Questions</option>
                    <option value="Tahfeez-ul-Quran Enrollment">Tahfeez-ul-Quran Enrollment</option>
                    <option value="College Wing (FSc / ICS)">College Wing (FSc / ICS)</option>
                    <option value="Employment / Faculty Application">Employment / Faculty Application</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please specify your query..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
