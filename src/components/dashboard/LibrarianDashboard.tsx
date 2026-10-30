import React, { useState } from 'react';
import { LibraryBook } from '../../types';
import { BookOpen, Search, Filter, CheckCircle, Plus } from 'lucide-react';

interface LibrarianDashboardProps {
  books: LibraryBook[];
}

export const LibrarianDashboard: React.FC<LibrarianDashboardProps> = ({ books }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredBooks = (books || []).filter((b) => {
    if (!b) return false;
    const term = (searchTerm || '').trim().toLowerCase();
    const title = (b.title || '').toLowerCase();
    const author = (b.author || '').toLowerCase();
    const isbn = (b.isbn || '').toLowerCase();
    const matchesSearch =
      !term ||
      title.includes(term) ||
      author.includes(term) ||
      isbn.includes(term);
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-400/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Dar-ul-Hikmah Central Library
            </span>
            <span className="text-xs text-indigo-300 font-semibold">• Librarian Portal</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Repository Catalog &amp; Circulation</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Preserving classical Quranic literature, Hadith commentaries, and modern collegiate science texts.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['all', 'Islamic Studies', 'Sciences', 'Mathematics', 'Literature'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-indigo-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">ISBN / Acc No</th>
                <th className="px-4 py-3">Book Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3 text-center">Shelf Location</th>
                <th className="px-4 py-3 text-center">Available / Total</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((bk) => (
                <tr key={bk.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono font-bold text-slate-500">{bk.isbn}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{bk.title}</td>
                  <td className="px-4 py-3 text-slate-600">{bk.author}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {bk.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-slate-700">
                    {bk.shelfLocation}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">
                    {bk.copiesAvailable} / {bk.copiesTotal}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      bk.copiesAvailable > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {bk.copiesAvailable > 0 ? 'In Stock' : 'Issued Out'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
