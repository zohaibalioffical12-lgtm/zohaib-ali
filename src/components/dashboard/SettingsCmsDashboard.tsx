import React, { useState, useEffect } from 'react';
import { SchoolSettings, WebsiteContent, AuditLog } from '../../types';
import {
  updateSchoolSettings,
  updateWebsiteContent,
  getAuditLogs,
  logAudit,
} from '../../services/dataService';
import {
  Settings,
  Globe,
  Save,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Eye,
  ShieldCheck,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  BookOpen,
  Calendar,
  Share2,
  Search,
  ExternalLink,
  X,
  History,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

interface SettingsCmsDashboardProps {
  settings: SchoolSettings;
  content: WebsiteContent;
  onSettingsUpdated: (newSettings: SchoolSettings) => void;
  onContentUpdated: (newContent: WebsiteContent) => void;
}

export const SettingsCmsDashboard: React.FC<SettingsCmsDashboardProps> = ({
  settings,
  content,
  onSettingsUpdated,
  onContentUpdated,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'cms' | 'identity' | 'academic' | 'audit'>('cms');
  const [cmsSection, setCmsSection] = useState<'hero' | 'about' | 'principal' | 'admissions' | 'contact' | 'seo'>('hero');

  // Form states
  const [settingsForm, setSettingsForm] = useState<SchoolSettings>(settings);
  const [contentForm, setContentForm] = useState<WebsiteContent>(content);
  const [auditLogsList, setAuditLogsList] = useState<AuditLog[]>([]);

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Load audit logs
  useEffect(() => {
    getAuditLogs().then((logs) => setAuditLogsList(logs));
  }, []);

  // Preset image gallery for quick selection
  const presetImages = [
    { label: 'Main Campus Gate', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80' },
    { label: 'Physics & STEM Lab', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Islamic Library', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Boys Campus Courtyard', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Computer Science Lab', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Publish All Live to Firestore
  const handlePublishLive = async () => {
    setSaving(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const updatedSettings = await updateSchoolSettings({
        ...settingsForm,
        updatedAt: new Date().toISOString(),
      });
      const updatedContent = await updateWebsiteContent({
        ...contentForm,
        status: 'published',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      onSettingsUpdated(updatedSettings);
      onContentUpdated(updatedContent);

      await logAudit({
        action: 'CMS_PUBLISHED_LIVE',
        performedBy: 'Zohaib Ali (Owner / Super Admin)',
        targetResource: 'Public Website & School Settings',
        details: `Published live changes to public website, official contact numbers, and school configurations.`,
      });

      const freshLogs = await getAuditLogs();
      setAuditLogsList(freshLogs);

      setStatusMessage('ALL CHANGES PUBLISHED LIVE! The public website and school portals have been updated in Firestore.');
    } catch (err: unknown) {
      console.error('Failed to publish changes:', err);
      setErrorMessage('Could not save to Firebase. Please verify connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  // Save Draft (does not mark as published)
  const handleSaveDraft = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const updatedContent = await updateWebsiteContent({
        ...contentForm,
        status: 'draft',
        updatedAt: new Date().toISOString(),
      });
      onContentUpdated(updatedContent);
      setStatusMessage('Draft saved successfully in Firestore. Click "Publish All Live" when ready to make public.');
    } catch (err: unknown) {
      console.error('Failed to save draft:', err);
      setErrorMessage('Failed to save draft.');
    } finally {
      setSaving(false);
    }
  };

  // Revert all form fields back to prop states
  const handleRevert = () => {
    setSettingsForm(settings);
    setContentForm(content);
    setStatusMessage('Reverted unsaved edits back to last saved Firebase state.');
  };

  return (
    <div className="space-y-6">
      {/* Top Super Admin Suite Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/40 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-widest shadow-xs">
              Super Admin Control Suite
            </span>
            <span className="text-xs text-amber-300 font-bold">• Owner: Zohaib Ali (Full Master Access)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Institutional Website Editor &amp; Master Settings
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Complete authorized control over every public page, heading, photograph, academic structure,
            official contact, fee rules, and database-managed content. All changes persist directly to Cloud Firestore.
          </p>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
            title="Preview changes before publishing"
          >
            <Eye className="w-4 h-4 text-amber-300" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={handleRevert}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer"
            title="Discard current unsaved changes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revert</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-slate-300" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handlePublishLive}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-900/50 border border-amber-300 transition-all cursor-pointer disabled:opacity-50 transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{saving ? 'Publishing to Firebase...' : 'Publish All Live'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs flex items-center justify-between gap-3 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 text-xs flex items-center justify-between gap-3 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-bold">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveMainTab('cms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMainTab === 'cms'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe className="w-4 h-4 text-amber-300" />
          <span>1. Website Content Editor (CMS)</span>
        </button>

        <button
          onClick={() => setActiveMainTab('identity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMainTab === 'identity'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4 text-amber-300" />
          <span>2. School Identity &amp; Secretariat</span>
        </button>

        <button
          onClick={() => setActiveMainTab('academic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMainTab === 'academic'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>3. Academic Structures &amp; Grading</span>
        </button>

        <button
          onClick={() => setActiveMainTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMainTab === 'audit'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4 text-amber-300" />
          <span>4. Audit Trail &amp; Security Logs ({auditLogsList.length})</span>
        </button>
      </div>

      {/* TAB 1: WEBSITE CONTENT EDITOR (CMS) */}
      {activeMainTab === 'cms' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          {/* CMS Section Pills */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-200">
            {[
              { id: 'hero', label: 'Hero & Headlines' },
              { id: 'about', label: 'About, Mission & Vision' },
              { id: 'principal', label: 'Principal Desk' },
              { id: 'admissions', label: 'Admissions & Marquee' },
              { id: 'contact', label: 'Contact & Gates' },
              { id: 'seo', label: 'SEO & Metadata' },
            ].map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setCmsSection(sec.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  cmsSection === sec.id
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Section: Hero & Headlines */}
          {cmsSection === 'hero' && (
            <div className="space-y-5 animate-in fade-in">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Hero Banner, Titles &amp; Counters
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Top Announcement Badge Text
                </label>
                <input
                  type="text"
                  value={contentForm.heroBadgeText || ''}
                  onChange={(e) => setContentForm({ ...contentForm, heroBadgeText: e.target.value })}
                  placeholder="e.g. Admissions Open for Academic Session 2026–2027 • Playgroup to Class 12"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Main Hero Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.heroHeadline}
                  onChange={(e) => setContentForm({ ...contentForm, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-black text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hero Subtitle / Introductory Paragraph *
                </label>
                <textarea
                  rows={3}
                  required
                  value={contentForm.heroSubtitle}
                  onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Primary CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={contentForm.heroCtaPrimary || ''}
                    onChange={(e) => setContentForm({ ...contentForm, heroCtaPrimary: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Secondary CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={contentForm.heroCtaSecondary || ''}
                    onChange={(e) => setContentForm({ ...contentForm, heroCtaSecondary: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Statistical Highlights */}
              <div className="pt-3 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Highlight Statistics Counters
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">Levels Metric:</span>
                    <input
                      type="text"
                      value={contentForm.statLevels || '15 Academic Levels'}
                      onChange={(e) => setContentForm({ ...contentForm, statLevels: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">Students Metric:</span>
                    <input
                      type="text"
                      value={contentForm.statStudents || '1,450+ Enrolled'}
                      onChange={(e) => setContentForm({ ...contentForm, statStudents: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">Pass Metric:</span>
                    <input
                      type="text"
                      value={contentForm.statPassRatio || '100% Board Pass'}
                      onChange={(e) => setContentForm({ ...contentForm, statPassRatio: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">Faculty Metric:</span>
                    <input
                      type="text"
                      value={contentForm.statFaculty || '45+ Scholars'}
                      onChange={(e) => setContentForm({ ...contentForm, statFaculty: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: About, Mission & Vision */}
          {cmsSection === 'about' && (
            <div className="space-y-5 animate-in fade-in">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Institutional Story, Mission &amp; Prophetic Ethos
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  About Section Title
                </label>
                <input
                  type="text"
                  value={contentForm.aboutUsTitle || ''}
                  onChange={(e) => setContentForm({ ...contentForm, aboutUsTitle: e.target.value })}
                  placeholder="About The Muslim School & College"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Main About Narrative / History *
                </label>
                <textarea
                  rows={4}
                  required
                  value={contentForm.aboutUsText}
                  onChange={(e) => setContentForm({ ...contentForm, aboutUsText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mission Statement *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contentForm.missionText}
                    onChange={(e) => setContentForm({ ...contentForm, missionText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Vision Statement *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contentForm.visionText}
                    onChange={(e) => setContentForm({ ...contentForm, visionText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Boys Wing Campus Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={contentForm.boysWingDesc || ''}
                    onChange={(e) => setContentForm({ ...contentForm, boysWingDesc: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Girls Wing Campus Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={contentForm.girlsWingDesc || ''}
                    onChange={(e) => setContentForm({ ...contentForm, girlsWingDesc: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Principal's Desk */}
          {cmsSection === 'principal' && (
            <div className="space-y-5 animate-in fade-in">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Principal&apos;s Official Address &amp; Academic Leadership
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Principal&apos;s Message Body *
                </label>
                <textarea
                  rows={5}
                  required
                  value={contentForm.principalMessage}
                  onChange={(e) => setContentForm({ ...contentForm, principalMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Principal Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contentForm.principalName}
                    onChange={(e) => setContentForm({ ...contentForm, principalName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Principal Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={contentForm.principalDesignation}
                    onChange={(e) => setContentForm({ ...contentForm, principalDesignation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Principal Photograph URL
                </label>
                <input
                  type="text"
                  value={contentForm.principalPhotoUrl || ''}
                  onChange={(e) => setContentForm({ ...contentForm, principalPhotoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono text-slate-700 bg-white"
                />
              </div>
            </div>
          )}

          {/* Section: Admissions & Marquee */}
          {cmsSection === 'admissions' && (
            <div className="space-y-5 animate-in fade-in">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Admissions Policy &amp; Public News Ticker
              </h4>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="admissionsOpen"
                  checked={contentForm.admissionsOpen}
                  onChange={(e) => setContentForm({ ...contentForm, admissionsOpen: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="admissionsOpen" className="text-xs font-bold text-slate-900 cursor-pointer">
                  Admissions Status: {contentForm.admissionsOpen ? 'OPEN (Candidates Can Apply Online)' : 'CLOSED (Display Registration Paused)'}
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Live Marquee / Announcements Ticker *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.announcementsTicker}
                  onChange={(e) => setContentForm({ ...contentForm, announcementsTicker: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-emerald-900 bg-emerald-50/50"
                />
                <p className="text-[10px] text-slate-500 mt-1">Appears as real-time broadcast banner across the public website.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Admissions Guidelines Intro
                </label>
                <textarea
                  rows={3}
                  value={contentForm.admissionsIntro || ''}
                  onChange={(e) => setContentForm({ ...contentForm, admissionsIntro: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Scholarship &amp; Hifz Concession Notice
                </label>
                <textarea
                  rows={2}
                  value={contentForm.admissionsNotice || ''}
                  onChange={(e) => setContentForm({ ...contentForm, admissionsNotice: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>
          )}

          {/* Section: Contact & Gates */}
          {cmsSection === 'contact' && (
            <div className="space-y-5 animate-in fade-in">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Public Contact, Entrance Gate Protocols &amp; Social Channels
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Gate 1 (Boys Wing) Visitor Directive
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.gate1Notice || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gate1Notice: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Gate 2 (Girls Wing) Visitor Directive
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.gate2Notice || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gate2Notice: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={contentForm.facebookUrl || ''}
                    onChange={(e) => setContentForm({ ...contentForm, facebookUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">YouTube Channel URL</label>
                  <input
                    type="text"
                    value={contentForm.youtubeUrl || ''}
                    onChange={(e) => setContentForm({ ...contentForm, youtubeUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Direct Link</label>
                  <input
                    type="text"
                    value={contentForm.whatsappUrl || ''}
                    onChange={(e) => setContentForm({ ...contentForm, whatsappUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-700 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: SEO & Metadata */}
          {cmsSection === 'seo' && (
            <div className="space-y-5 animate-in fade-in">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Website Meta Tags &amp; SEO Optimization
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Browser Title / OG Title *
                </label>
                <input
                  type="text"
                  value={contentForm.seoTitle || ''}
                  onChange={(e) => setContentForm({ ...contentForm, seoTitle: e.target.value })}
                  placeholder="The Muslim School & College, Mardan | Admissions Open"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Search Engine Meta Description
                </label>
                <textarea
                  rows={3}
                  value={contentForm.seoDescription || ''}
                  onChange={(e) => setContentForm({ ...contentForm, seoDescription: e.target.value })}
                  placeholder="Premier Islamic School & College in Mardan, Pakistan..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>
          )}

          {/* Preset Photographs Selector */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
              <span>Quick High-Resolution Campus Image Presets:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {presetImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setContentForm({ ...contentForm, heroBannerUrl: img.url });
                    setStatusMessage(`Selected "${img.label}" as banner image.`);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 border border-slate-200 transition-colors cursor-pointer"
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHOOL IDENTITY & SECRETARIAT */}
      {activeMainTab === 'identity' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-200">
              <Building className="w-5 h-5 text-emerald-700" />
              <span>Official Institutional Parameters &amp; Legal Signatures</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              These details are permanently stamped on report cards, fee receipts, vouchers, and legal credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={settingsForm.institutionName}
                onChange={(e) => setSettingsForm({ ...settingsForm, institutionName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Owner / Super Admin Name *
              </label>
              <input
                type="text"
                required
                value={settingsForm.ownerName}
                onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Owner / Super Admin Email *
              </label>
              <input
                type="email"
                required
                value={settingsForm.ownerEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, ownerEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Official School Email (Exact) *
              </label>
              <input
                type="text"
                required
                value={settingsForm.officialEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, officialEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-emerald-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Official Telephone / WhatsApp Hotline *
              </label>
              <input
                type="text"
                required
                value={settingsForm.contactNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Current Academic Session
              </label>
              <input
                type="text"
                value={settingsForm.academicYear}
                onChange={(e) => setSettingsForm({ ...settingsForm, academicYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Campus Physical Address *
            </label>
            <textarea
              rows={2}
              required
              value={settingsForm.address}
              onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Institutional Motto
            </label>
            <input
              type="text"
              value={settingsForm.motto}
              onChange={(e) => setSettingsForm({ ...settingsForm, motto: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
            />
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC STRUCTURES & GRADING */}
      {activeMainTab === 'academic' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-200">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>Academic Structure, Campus Wings &amp; Grading Scales</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure attendance rules, grade boundaries, and segregation policies for Boys and Girls wings.
            </p>
          </div>

          {/* Grading Scale Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Grade</th>
                  <th className="px-4 py-2.5">Marks Range</th>
                  <th className="px-4 py-2.5">GPA Point</th>
                  <th className="px-4 py-2.5">Islamic Scholastic Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2 font-bold text-emerald-700">A+</td>
                  <td className="px-4 py-2">90% - 100%</td>
                  <td className="px-4 py-2 font-mono">4.0</td>
                  <td className="px-4 py-2 font-bold text-slate-800">Mumtaz (Exceptional Distinction)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-emerald-600">A</td>
                  <td className="px-4 py-2">80% - 89%</td>
                  <td className="px-4 py-2 font-mono">3.7</td>
                  <td className="px-4 py-2 font-bold text-slate-800">Jayyid Jiddan (Excellent)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-blue-600">B</td>
                  <td className="px-4 py-2">70% - 79%</td>
                  <td className="px-4 py-2 font-mono">3.0</td>
                  <td className="px-4 py-2 font-bold text-slate-800">Jayyid (Very Good)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-amber-600">C</td>
                  <td className="px-4 py-2">60% - 69%</td>
                  <td className="px-4 py-2 font-mono">2.0</td>
                  <td className="px-4 py-2 font-bold text-slate-800">Maqbool (Good / Pass)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-rose-600">F</td>
                  <td className="px-4 py-2">Below 33%</td>
                  <td className="px-4 py-2 font-mono">0.0</td>
                  <td className="px-4 py-2 font-bold text-slate-800">Needs Remedial Attention</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-slate-900">Attendance Policy Guidelines:</p>
            <p>• Mandatory 75% class attendance required to be eligible for terminal and Board examinations.</p>
            <p>• Automatic SMS alerts triggered to parents when student is marked Absent or Late.</p>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL & SECURITY LOGS */}
      {activeMainTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>Immutable Security Audit Log</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full chronological ledger of attendance submissions, fee collections, user actions, and CMS publications.
              </p>
            </div>

            <button
              onClick={() => getAuditLogs().then((logs) => setAuditLogsList(logs))}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer"
            >
              Refresh Log
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Action Type</th>
                  <th className="px-4 py-3">Performed By</th>
                  <th className="px-4 py-3">Target Resource</th>
                  <th className="px-4 py-3">Details &amp; Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogsList.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                    </td>
                    <td className="px-4 py-2.5 font-bold text-emerald-800">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900">{log.performedBy}</td>
                    <td className="px-4 py-2.5 text-slate-700 font-bold">{log.targetResource}</td>
                    <td className="px-4 py-2.5 text-slate-600 font-sans text-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visual Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Live Visual Preview (Simulated Public Website)
                </span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 max-h-[80vh] overflow-y-auto space-y-8 bg-slate-50">
              {/* Marquee ticker preview */}
              <div className="bg-emerald-900 text-amber-300 text-xs py-2 px-4 rounded-xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold">{contentForm.announcementsTicker}</span>
              </div>

              {/* Hero preview */}
              <div className="bg-slate-900 text-white p-8 rounded-2xl text-center space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-800/80 text-amber-300 border border-amber-400/30">
                  {contentForm.heroBadgeText}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                  {contentForm.heroHeadline}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                  {contentForm.heroSubtitle}
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white">
                    {contentForm.heroCtaPrimary}
                  </span>
                  <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white">
                    {contentForm.heroCtaSecondary}
                  </span>
                </div>
              </div>

              {/* About & Principal preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Our Mission</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{contentForm.missionText}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Principal&apos;s Message</h4>
                  <p className="text-xs text-slate-600 leading-relaxed italic">&ldquo;{contentForm.principalMessage}&rdquo;</p>
                  <p className="text-xs font-bold text-emerald-800 mt-2">— {contentForm.principalName}</p>
                </div>
              </div>

              {/* Secretariat preview */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Official Contact Information</h4>
                <p>Address: <strong className="text-slate-800">{settingsForm.address}</strong></p>
                <p>Phone: <strong className="text-slate-800">{settingsForm.contactNumber}</strong></p>
                <p>Official School Email: <strong className="text-emerald-800">{settingsForm.officialEmail}</strong></p>
                <p>Super Admin / Owner Email: <strong className="text-slate-800">{settingsForm.ownerEmail}</strong></p>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Preview generated from current form draft</span>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  handlePublishLive();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
              >
                Looks Good — Publish Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
