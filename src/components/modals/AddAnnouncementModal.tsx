import React, { useState } from 'react';
import { Announcement } from '../../types';
import { createAnnouncement } from '../../services/dataService';
import { X, Bell, AlertTriangle } from 'lucide-react';

interface AddAnnouncementModalProps {
  onClose: () => void;
  onAdded: (ann: Announcement) => void;
}

export const AddAnnouncementModal: React.FC<AddAnnouncementModalProps> = ({
  onClose,
  onAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'teachers' | 'students' | 'parents'>('all');
  const [category, setCategory] = useState<'academic' | 'exam' | 'fee' | 'event' | 'holiday'>('academic');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      const newAnn = await createAnnouncement({
        title: title.trim(),
        content: content.trim(),
        targetAudience,
        category,
        priority,
        date: new Date().toISOString().split('T')[0],
        authorName: 'Office of the Principal',
      });
      onAdded(newAnn);
      onClose();
    } catch (err) {
      console.error('Failed to create announcement:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              Issue Official School Notice
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Headline *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Schedule for Annual Quranic Recitation Competition"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
              >
                <option value="all">Entire School</option>
                <option value="students">Students Only</option>
                <option value="parents">Parents Only</option>
                <option value="teachers">Faculty Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
              >
                <option value="academic">Academic</option>
                <option value="exam">Examination</option>
                <option value="fee">Fee Circular</option>
                <option value="event">Campus Event</option>
                <option value="holiday">Holiday Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Notice Details *</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the complete circular text..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Publishing...' : 'Publish Announcement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
