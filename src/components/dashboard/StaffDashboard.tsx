import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Timetable,
  Announcement,
  LibraryBook,
  SchoolSettings,
} from '../../types';
import {
  Wrench,
  Building,
  Bus,
  Clock,
  Bell,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Plus,
  Send,
  Zap,
  ShieldCheck,
} from 'lucide-react';

interface StaffDashboardProps {
  timetables: Timetable[];
  announcements: Announcement[];
  books: LibraryBook[];
  settings?: SchoolSettings;
  onNavigateTab: (tab: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  timetables,
  announcements,
  books,
  settings,
  onNavigateTab,
}) => {
  const { userProfile } = useAuth();
  const staffRole = userProfile?.staffRoleTitle || 'Transport & Facilities Officer';
  const permittedModules = userProfile?.permittedModules || ['facilities', 'timetables', 'announcements'];

  const [activeStaffTab, setActiveStaffTab] = useState<string>('facilities');
  const [maintenanceTickets, setMaintenanceTickets] = useState([
    { id: 'tkt_01', item: 'Computer Lab 2 - AC Servicing', location: 'Boys Wing 1st Floor', priority: 'High', status: 'In Progress', reportedDate: '2026-10-28' },
    { id: 'tkt_02', item: 'Solar Inverter 15kW Battery Check', location: 'Main Admin Block', priority: 'Medium', status: 'Completed', reportedDate: '2026-10-27' },
    { id: 'tkt_03', item: 'School Bus #4 - Routine Brake & Tire Inspection', location: 'Campus Parking', priority: 'High', status: 'Scheduled', reportedDate: '2026-10-29' },
    { id: 'tkt_04', item: 'Chemistry Lab Gas Burner Replacement', location: 'Girls Wing Lab 1', priority: 'Normal', status: 'Pending Approval', reportedDate: '2026-10-29' },
  ]);

  const [showAddTicket, setShowAddTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({ item: '', location: '', priority: 'Medium' });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.item) return;
    const newTicket = {
      id: `tkt_${Date.now()}`,
      item: ticketForm.item,
      location: ticketForm.location || 'General Campus',
      priority: ticketForm.priority,
      status: 'Pending Review',
      reportedDate: new Date().toISOString().split('T')[0],
    };
    setMaintenanceTickets([newTicket, ...maintenanceTickets]);
    setTicketForm({ item: '', location: '', priority: 'Medium' });
    setShowAddTicket(false);
  };

  return (
    <div className="space-y-6">
      {/* Staff Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-widest">
              Staff Portal
            </span>
            <span className="text-xs text-amber-300 font-bold">• {staffRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Operations &amp; Support Services
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Institutional infrastructure, scheduling oversight, transport logistics, and facility management for The Muslim School &amp; College, Mardan.
          </p>
        </div>

        <button
          onClick={() => setShowAddTicket(true)}
          className="py-3 px-5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Log Maintenance / Duty Report</span>
        </button>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Power &amp; Utilities</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">100% Online</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Solar 40kW + Backup Gen</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">School Transport</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">8 Coasters / Vans</p>
          <p className="text-[11px] text-slate-500 mt-1">Routes: Mardan City, Cantt, Gujrat</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Open Work Orders</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {maintenanceTickets.filter((t) => t.status !== 'Completed').length} Pending
          </p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Scheduled for this week</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Permitted Modules</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {permittedModules.length} Modules
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Configured by Super Admin</p>
        </div>
      </div>

      {/* Module Selector Tabs for Staff */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        {permittedModules.includes('facilities') && (
          <button
            onClick={() => setActiveStaffTab('facilities')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeStaffTab === 'facilities'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Campus Facilities &amp; Maintenance
          </button>
        )}

        {permittedModules.includes('timetables') && (
          <button
            onClick={() => setActiveStaffTab('timetables')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeStaffTab === 'timetables'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Master Timetable &amp; Rooms
          </button>
        )}

        {permittedModules.includes('announcements') && (
          <button
            onClick={() => setActiveStaffTab('announcements')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeStaffTab === 'announcements'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Staff Bulletins &amp; Notices ({announcements.length})
          </button>
        )}
      </div>

      {/* Facilities Tab Content */}
      {activeStaffTab === 'facilities' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Active Campus Maintenance &amp; Work Orders
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log of facility maintenance, lab equipment upkeep, and transport service logs.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-y border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Item / Task Description</th>
                  <th className="px-4 py-3">Location / Wing</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Reported Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {maintenanceTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t.item}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{t.location}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'High'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{t.reportedDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : t.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {t.status !== 'Completed' && (
                        <button
                          onClick={() => {
                            setMaintenanceTickets(
                              maintenanceTickets.map((item) =>
                                item.id === t.id ? { ...item, status: 'Completed' } : item
                              )
                            );
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-[11px] cursor-pointer"
                        >
                          Mark Done
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timetables Tab Content */}
      {activeStaffTab === 'timetables' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Room &amp; Hall Schedules (Campus Operational View)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily period schedules for Boys &amp; Girls academic blocks to coordinate security and facility bell chimes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timetables.slice(0, 4).map((tt) => (
              <div key={tt.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {tt.className} - {tt.sectionName}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {tt.dayOfWeek}
                  </span>
                </div>
                <div className="space-y-1.5 mt-3">
                  {tt.periods.map((p) => (
                    <div key={p.periodNumber} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        P{p.periodNumber}: {p.subject}
                      </span>
                      <span className="text-slate-500 text-[11px]">{p.room} • {p.startTime} - {p.endTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcements Tab Content */}
      {activeStaffTab === 'announcements' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Administrative Circulars &amp; Operational Directives
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {announcements.map((ann) => (
              <div key={ann.id} className="py-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">
                    {ann.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{ann.content}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                  <span>Issued By: {ann.authorName}</span>
                  <span>•</span>
                  <span>{ann.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Maintenance Modal */}
      {showAddTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Log Maintenance Request / Campus Report
            </h3>
            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Equipment / Maintenance Issue
                </label>
                <input
                  type="text"
                  placeholder="e.g. Science Lab 1 Water Tap Leakage"
                  value={ticketForm.item}
                  onChange={(e) => setTicketForm({ ...ticketForm, item: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campus Location / Block
                </label>
                <input
                  type="text"
                  placeholder="e.g. Boys Wing 2nd Floor, Room B-201"
                  value={ticketForm.location}
                  onChange={(e) => setTicketForm({ ...ticketForm, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Urgency / Priority
                </label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Normal">Normal</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Immediate Action)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTicket(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
