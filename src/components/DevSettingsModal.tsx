import React, { useState } from 'react';
import { useRoom } from '../context/RoomContext';
import { Database, X, ShieldCheck, Key, HelpCircle } from 'lucide-react';

interface DevSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevSettingsModal: React.FC<DevSettingsModalProps> = ({ isOpen, onClose }) => {
  const { isFirebaseActive, savedConfig, updateFirebaseSettings } = useRoom();

  const [apiKey, setApiKey] = useState(savedConfig?.apiKey || '');
  const [authDomain, setAuthDomain] = useState(savedConfig?.authDomain || '');
  const [databaseURL, setDatabaseURL] = useState(savedConfig?.databaseURL || '');
  const [projectId, setProjectId] = useState(savedConfig?.projectId || '');
  const [storageBucket, setStorageBucket] = useState(savedConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(savedConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(savedConfig?.appId || '');

  const [showHelp, setShowHelp] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || !databaseURL || !projectId) {
      alert('Firebase API Key, Project ID, and Realtime Database URL are required for cloud sync.');
      return;
    }

    updateFirebaseSettings({
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      databaseURL: databaseURL.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim()
    });

    onClose();
  };

  const handleDisconnect = () => {
    if (window.confirm('Disconnect from Firebase cloud database? The app will revert back to instant local-tab broadcast sync.')) {
      updateFirebaseSettings(null);
      setApiKey('');
      setAuthDomain('');
      setDatabaseURL('');
      setProjectId('');
      setStorageBucket('');
      setMessagingSenderId('');
      setAppId('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay flex items-center justify-center z-50">
      <div className="modal-content glass-card w-full max-w-md p-6 relative animate-zoomIn">
        {/* Close Button */}
        <button onClick={onClose} className="btn-close-sketch" title="Close">
          <X size={12} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Database size={22} className={isFirebaseActive ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h2 className="text-lg font-bold font-header text-indigo-950">Developer Settings</h2>
            <p className="text-xs text-slate-500">Configure real-time cloud integrations</p>
          </div>
        </div>

        {/* Sync Mode Status Badge */}
        <div className="mb-4">
          {isFirebaseActive ? (
            <div className="p-2.5 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-lg text-xs flex items-center justify-between font-header font-bold">
              <span className="flex items-center gap-1.5">
                ● Firebase Cloud Sync Connected
              </span>
              <button 
                onClick={handleDisconnect}
                className="text-[10px] bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold px-2 py-0.5 rounded hover:bg-rose-50 hover:border-rose-300 hover:text-rose-800 transition-colors cursor-pointer"
              >
                DISCONNECT
              </button>
            </div>
          ) : (
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg text-xs">
              <span className="font-semibold flex items-center gap-1.5 mb-1 text-indigo-950">
                <HelpCircle size={12} className="text-indigo-600" />
                Local-First Broadcast Active
              </span>
              All open browser tabs are synced in real-time using BroadcastChannel! Paste your Firebase settings below to enable cross-device cloud sync.
            </div>
          )}
        </div>

        {/* Help tutorial trigger */}
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="text-xs text-indigo-700 hover:text-indigo-900 mb-3 flex items-center gap-1 transition-colors underline decoration-dotted cursor-pointer"
        >
          <HelpCircle size={12} />
          {showHelp ? 'Hide setup tutorial' : 'How do I set up a Firebase cloud?'}
        </button>

        {showHelp && (
          <div className="p-3 bg-amber-50/80 border-2 border-dashed border-amber-300 rounded-lg text-[10px] text-slate-600 mb-4 flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1 relative">
            <div className="sticky-tape-header" style={{ width: '40px', height: '10px', left: '45%' }}></div>
            <p className="font-bold text-amber-900 font-header mt-1">To provision a cloud real-time DB:</p>
            <p>1. Open <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-bold">Firebase Console</a> and create a project.</p>
            <p>2. Add a new Web App under Project Settings.</p>
            <p>3. Go to Realtime Database on the left menu and create a database in your preferred region.</p>
            <p>4. Under database Rules, set read: true and write: true for quick demo access.</p>
            <p>5. Copy your config parameters from the Project Settings Web App panel and paste them below.</p>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div className="form-group">
            <label className="form-label text-[10px] flex items-center gap-1">
              <Key size={10} /> Realtime Database URL *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. https://project-default-rtdb.firebaseio.com/"
              value={databaseURL}
              onChange={e => setDatabaseURL(e.target.value)}
              className="form-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label text-[10px]">API Key *</label>
              <input
                type="password"
                required
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="form-input text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-[10px]">Project ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. chorewheel-12345"
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label text-[10px]">Auth Domain (Optional)</label>
              <input
                type="text"
                placeholder="chorewheel.firebaseapp.com"
                value={authDomain}
                onChange={e => setAuthDomain(e.target.value)}
                className="form-input text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-[10px]">Storage Bucket (Optional)</label>
              <input
                type="text"
                placeholder="chorewheel.appspot.com"
                value={storageBucket}
                onChange={e => setStorageBucket(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="form-group">
              <label className="form-label text-[10px]">Messaging Sender ID (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                value={messagingSenderId}
                onChange={e => setMessagingSenderId(e.target.value)}
                className="form-input text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-[10px]">App ID (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 1:12345:web:abcd1234"
                value={appId}
                onChange={e => setAppId(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-950 text-white font-bold font-header text-xs rounded-lg transition-all btn-sketch btn-blue cursor-pointer"
          >
            <ShieldCheck size={14} /> CONNECT CLOUD SYNC
          </button>
        </form>
      </div>
    </div>
  );
};
