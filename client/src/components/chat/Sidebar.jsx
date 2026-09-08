import React, { useState } from 'react';
import UserItem from './UserItem';
import { SearchIcon, LogoutIcon, ShieldIcon } from '../common/Icons';
import { useAppContext } from '../../context/AppContext';

export default function Sidebar() {
  // 1. Consuming shared context state via useContext (useAppContext)
  const {
    currentUser,
    users,
    selectedUser,
    selectUser,
    logout,
    showChatOnMobile,
  } = useAppContext();

  // 2. Local interactive state using useState
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'online'

  // Filter users based on search term & online filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOnline = filterMode === 'online' ? user.status === 'online' : true;
    return matchesSearch && matchesOnline;
  });

  const onlineCount = users.filter((u) => u.status === 'online').length;

  return (
    <aside
      className={`w-full md:w-80 lg:w-96 flex flex-col h-full bg-slate-900 border-r border-slate-800 ${
        !showChatOnMobile ? 'flex' : 'hidden md:flex'
      }`}
    >
      {/* Current User Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/50"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white">{currentUser.name}</h3>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <ShieldIcon className="w-2.5 h-2.5" /> {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[150px]">{currentUser.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign Out (Mock)"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
        >
          <LogoutIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input Bar (Demonstrating useState for controlled inputs) */}
      <div className="p-3 border-b border-slate-800/60">
        <div className="relative">
          <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users or contacts..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills (Demonstrating useState for view/filter toggles) */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              filterMode === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setFilterMode('online')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition-all ${
              filterMode === 'online'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Online ({onlineCount})
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-500 text-xs">
            No users match "{searchTerm}"
          </div>
        ) : (
          filteredUsers.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              isSelected={selectedUser?.id === user.id}
              onSelect={selectUser}
            />
          ))
        )}
      </div>

      {/* Footer Info Badge */}
      <div className="p-3 bg-slate-950/40 border-t border-slate-800 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>Experiment 2: React Hooks Active</span>
      </div>
    </aside>
  );
}
