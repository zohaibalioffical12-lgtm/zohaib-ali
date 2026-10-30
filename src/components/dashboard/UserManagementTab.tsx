import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Student,
  SchoolClass,
  Section,
  Teacher,
} from '../../types';
import {
  getUserProfiles,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  logAudit,
} from '../../services/dataService';
import {
  Users,
  UserPlus,
  Shield,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  RefreshCw,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  X,
  Save,
  UserCheck,
} from 'lucide-react';

interface UserManagementTabProps {
  students: Student[];
  classes: SchoolClass[];
  sections: Section[];
  teachers: Teacher[];
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  students,
  classes,
  sections,
  teachers,
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Form State for Add User
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    role: 'teacher' as UserRole,
    phone: '',
    status: 'active' as 'active' | 'suspended' | 'inactive',
    assignedClasses: [] as string[],
    assignedSections: [] as string[],
    assignedSubjects: [] as string[],
    linkedStudentIds: [] as string[],
    staffRoleTitle: '',
    permittedModules: ['facilities', 'timetables', 'announcements'],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUserProfiles();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      displayName: '',
      email: '',
      role: 'teacher',
      phone: '',
      status: 'active',
      assignedClasses: ['cls_9', 'cls_10'],
      assignedSections: ['sec_9_b_a'],
      assignedSubjects: ['Physics'],
      linkedStudentIds: [],
      staffRoleTitle: '',
      permittedModules: ['facilities', 'timetables', 'announcements'],
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setFormData({
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      status: user.status || 'active',
      assignedClasses: user.assignedClasses || [],
      assignedSections: user.assignedSections || [],
      assignedSubjects: user.assignedSubjects || [],
      linkedStudentIds: user.linkedStudentIds || [],
      staffRoleTitle: user.staffRoleTitle || '',
      permittedModules: user.permittedModules || ['facilities', 'timetables', 'announcements'],
    });
    setShowEditModal(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.displayName) return;
    setIsSubmitting(true);
    try {
      const newProfile = await createUserProfile({
        displayName: formData.displayName,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        status: formData.status,
        createdAt: new Date().toISOString(),
        assignedClasses: formData.role === 'teacher' ? formData.assignedClasses : undefined,
        assignedSections: formData.role === 'teacher' ? formData.assignedSections : undefined,
        assignedSubjects: formData.role === 'teacher' ? formData.assignedSubjects : undefined,
        linkedStudentIds: formData.role === 'parent' ? formData.linkedStudentIds : undefined,
        staffRoleTitle: formData.role === 'staff' ? formData.staffRoleTitle : undefined,
        permittedModules: formData.role === 'staff' ? formData.permittedModules : undefined,
      });
      setUsers([newProfile, ...users]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to create user account:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await updateUserProfile(selectedUser.id, {
        displayName: formData.displayName,
        role: formData.role,
        phone: formData.phone,
        status: formData.status,
        assignedClasses: formData.role === 'teacher' ? formData.assignedClasses : undefined,
        assignedSections: formData.role === 'teacher' ? formData.assignedSections : undefined,
        assignedSubjects: formData.role === 'teacher' ? formData.assignedSubjects : undefined,
        linkedStudentIds: formData.role === 'parent' ? formData.linkedStudentIds : undefined,
        staffRoleTitle: formData.role === 'staff' ? formData.staffRoleTitle : undefined,
        permittedModules: formData.role === 'staff' ? formData.permittedModules : undefined,
      });

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                displayName: formData.displayName,
                role: formData.role,
                phone: formData.phone,
                status: formData.status,
                assignedClasses: formData.assignedClasses,
                assignedSections: formData.assignedSections,
                assignedSubjects: formData.assignedSubjects,
                linkedStudentIds: formData.linkedStudentIds,
                staffRoleTitle: formData.staffRoleTitle,
                permittedModules: formData.permittedModules,
              }
            : u
        )
      );
      setShowEditModal(false);
    } catch (err) {
      console.error('Failed to update user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: UserProfile) => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    try {
      await updateUserProfile(user.id, { status: nextStatus });
      setUsers(users.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)));
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to deactivate and remove account for ${name}?`)) return;
    try {
      await deleteUserProfile(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      u.displayName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone && u.phone.includes(term));
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-widest">
              Owner Security &amp; RBAC Control
            </span>
            <span className="text-xs text-amber-300 font-bold">• Zohaib Ali (Super Admin)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            User Account &amp; Role Management
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Provision, manage, link children, assign teacher classes, and toggle account activation status for all 9 institutional portals across The Muslim School &amp; College.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Refresh user list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="py-3 px-5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg flex items-center gap-2 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span>Create User Account</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="ceo">Owner / Super Admin</option>
              <option value="principal">Principal</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent / Guardian</option>
              <option value="accountant">Accountant</option>
              <option value="admissions_officer">Admissions Officer</option>
              <option value="librarian">Librarian</option>
              <option value="staff">Other Staff</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3.5">User / Member</th>
                <th className="px-4 py-3.5">Assigned Portal Role</th>
                <th className="px-4 py-3.5">Account Status</th>
                <th className="px-4 py-3.5">Role Allocations / Linked Details</th>
                <th className="px-4 py-3.5">Contact Number</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No user accounts match your search filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-400/30 shrink-0">
                          {user.displayName[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{user.displayName}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'ceo'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300'
                          : user.role === 'principal'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300'
                          : user.role === 'teacher'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                          : user.role === 'student'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                          : user.role === 'parent'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300'
                          : user.role === 'accountant'
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300'
                          : user.role === 'admissions_officer'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                          : user.role === 'librarian'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : user.status === 'suspended'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span>{user.status || 'active'}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      {user.role === 'teacher' ? (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {user.assignedClasses?.length ? `${user.assignedClasses.length} Classes Assigned` : 'General Faculty'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {user.assignedSubjects?.join(', ') || 'Physics, Mathematics'}
                          </p>
                        </div>
                      ) : user.role === 'parent' ? (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {user.linkedStudentIds?.length ? `${user.linkedStudentIds.length} Linked Children` : 'No wards linked'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {user.linkedStudentIds?.map(id => students.find(s => s.id === id)?.fullName || id).join(', ')}
                          </p>
                        </div>
                      ) : user.role === 'staff' ? (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {user.staffRoleTitle || 'General Support Staff'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Modules: {user.permittedModules?.join(', ') || 'Facilities'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">Standard Access</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {user.phone || '+92 313 9375355'}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          title={user.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            user.status === 'suspended'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          {user.status === 'suspended' ? (
                            <Unlock className="w-3.5 h-3.5" />
                          ) : (
                            <Lock className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(user)}
                          title="Edit Permissions & Allocations"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {user.role !== 'ceo' && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.displayName)}
                            title="Delete Account"
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Create Institutional User Account</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g. Dr. Asif Mehmood"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Email Address (Login Credential)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. asif.mehmood@muslimschool.edu.pk"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Assigned Portal Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="teacher">Teacher (Classroom &amp; Marks)</option>
                    <option value="student">Student (Timetable &amp; Results)</option>
                    <option value="parent">Parent / Guardian (Child Progress)</option>
                    <option value="principal">Principal (Academic Oversight)</option>
                    <option value="accountant">Accountant (Fee Vouchers)</option>
                    <option value="admissions_officer">Admissions Officer (Candidate Review)</option>
                    <option value="librarian">Librarian (Library Catalog)</option>
                    <option value="staff">Other Staff (Campus Facilities)</option>
                    <option value="ceo">Owner / Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Official Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              {/* Dynamic Role Fields */}
              {formData.role === 'teacher' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Teacher Class &amp; Subject Assignments
                  </h4>
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Assigned Classes (Hold Ctrl to select multiple)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {classes.map((c) => (
                        <label key={c.id} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                          <input
                            type="checkbox"
                            checked={formData.assignedClasses.includes(c.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, assignedClasses: [...formData.assignedClasses, c.id] });
                              } else {
                                setFormData({ ...formData, assignedClasses: formData.assignedClasses.filter((id) => id !== c.id) });
                              }
                            }}
                          />
                          <span>{c.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Teaching Subjects (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Physics, Applied Mechanics"
                      value={formData.assignedSubjects.join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assignedSubjects: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>
              )}

              {formData.role === 'parent' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Link Children / Wards to Parent Portal
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Select one or more students who belong to this guardian account:
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-white dark:bg-slate-800">
                    {students.map((s) => (
                      <label key={s.id} className="flex items-center justify-between text-xs py-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {s.fullName} ({s.admissionNo}) - {s.className}
                        </span>
                        <input
                          type="checkbox"
                          checked={formData.linkedStudentIds.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, linkedStudentIds: [...formData.linkedStudentIds, s.id] });
                            } else {
                              setFormData({ ...formData, linkedStudentIds: formData.linkedStudentIds.filter((id) => id !== s.id) });
                            }
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.role === 'staff' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Staff Job Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Transport & Facilities Supervisor"
                      value={formData.staffRoleTitle}
                      onChange={(e) => setFormData({ ...formData, staffRoleTitle: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Authorized Dashboard Modules
                    </label>
                    <div className="flex gap-4">
                      {['facilities', 'timetables', 'announcements', 'library'].map((mod) => (
                        <label key={mod} className="flex items-center gap-1.5 capitalize text-xs">
                          <input
                            type="checkbox"
                            checked={formData.permittedModules.includes(mod)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, permittedModules: [...formData.permittedModules, mod] });
                              } else {
                                setFormData({ ...formData, permittedModules: formData.permittedModules.filter((m) => m !== mod) });
                              }
                            }}
                          />
                          <span>{mod}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'Creating...' : 'Provision User Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-600" />
                <span>Edit User Account &amp; Permissions</span>
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Assigned Portal Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent / Guardian</option>
                    <option value="principal">Principal</option>
                    <option value="accountant">Accountant</option>
                    <option value="admissions_officer">Admissions Officer</option>
                    <option value="librarian">Librarian</option>
                    <option value="staff">Other Staff</option>
                    <option value="ceo">Owner / Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="active">Active (Granted Access)</option>
                    <option value="suspended">Suspended (Access Revoked)</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {formData.role === 'teacher' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Assigned Classes
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {classes.map((c) => (
                      <label key={c.id} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={formData.assignedClasses.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, assignedClasses: [...formData.assignedClasses, c.id] });
                            } else {
                              setFormData({ ...formData, assignedClasses: formData.assignedClasses.filter((id) => id !== c.id) });
                            }
                          }}
                        />
                        <span>{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.role === 'parent' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Linked Children / Wards
                  </h4>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-white dark:bg-slate-800">
                    {students.map((s) => (
                      <label key={s.id} className="flex items-center justify-between text-xs py-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {s.fullName} ({s.admissionNo})
                        </span>
                        <input
                          type="checkbox"
                          checked={formData.linkedStudentIds.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, linkedStudentIds: [...formData.linkedStudentIds, s.id] });
                            } else {
                              setFormData({ ...formData, linkedStudentIds: formData.linkedStudentIds.filter((id) => id !== s.id) });
                            }
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Permissions'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
