"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Phone, FileText, Upload, CheckCircle, 
  MapPin, Clock, Search, Lock, Activity, Users, Settings, 
  EyeOff, Copy, Volume2, Plus, Info, AlertOctagon, MessageSquare,
  TrendingUp, ShieldCheck
} from 'lucide-react';

// --- THEME COLORS ---
const colors = {
  purple: '#7655C9',
  green: '#23875A',
};

// --- FAKE CALL UTILITY ---
const playRingtone = (audioCtxRef: React.MutableRefObject<AudioContext | null>) => {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  const ctx = audioCtxRef.current!;
  
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc1.type = 'sine';
  osc2.type = 'sine';
  osc1.frequency.setValueAtTime(440, ctx.currentTime);
  osc2.frequency.setValueAtTime(480, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
  gainNode.gain.setValueAtTime(0.5, ctx.currentTime + 2);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.1);
  
  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc1.start(ctx.currentTime);
  osc2.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 2.1);
  osc2.stop(ctx.currentTime + 2.1);
};

// --- PORTAL COMPONENTS ---

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState('report'); 
  const [reportStep, setReportStep] = useState(0);
  const [trackingId, setTrackingId] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const [agreedToTerms, setAgreedToTerms] = useState({ police: false, privacy: false });
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isFakeCalling, setIsFakeCalling] = useState(false);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleFakeCall = () => {
    if (isFakeCalling) {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
      setIsFakeCalling(false);
    } else {
      setIsFakeCalling(true);
      playRingtone(audioCtxRef);
      callIntervalRef.current = setInterval(() => playRingtone(audioCtxRef), 4000);
    }
  };

  useEffect(() => {
    return () => {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    };
  }, []);

  const generateTrackingId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'CS-';
    for(let i=0; i<8; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    setTrackingId(id);
    setReportStep(5);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans w-full text-black">
      <div className="w-full md:w-64 bg-[#17233D] text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <Shield size={32} color={colors.purple} />
          <span className="text-xl font-bold tracking-wide">CampusShield</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('report')} className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === 'report' ? 'bg-[#7655C9] text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <AlertOctagon size={20} /> Report Incident
          </button>
          <button onClick={() => setActiveTab('track')} className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === 'track' ? 'bg-[#7655C9] text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <Search size={20} /> Track Report
          </button>
          <button onClick={() => setActiveTab('sos')} className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === 'sos' ? 'bg-[#D93645] text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <AlertTriangle size={20} /> Emergency SOS
          </button>
        </nav>

        <button 
          onClick={handleFakeCall}
          className={`mt-auto w-full flex items-center justify-center gap-2 p-4 rounded-xl font-bold transition-all ${isFakeCalling ? 'bg-red-500 animate-pulse' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
          <Volume2 size={20} />
          {isFakeCalling ? 'End Fake Call' : 'Fake Call'}
        </button>
      </div>

      <div className="flex-1 p-4 md:p-10 overflow-y-auto">
        {activeTab === 'sos' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-8">
              <h3 className="text-red-800 font-bold flex items-center gap-2"><Info size={20}/> Not a Monitored Line</h3>
              <p className="text-red-700 text-sm mt-1">CampusShield reports are NOT monitored in real-time. If you are in immediate danger, call emergency services directly.</p>
            </div>
            
            <a href="tel:112" className="w-full bg-[#D93645] hover:bg-red-700 text-white rounded-2xl p-12 flex flex-col items-center justify-center shadow-lg transition-transform transform hover:scale-105">
              <Phone size={64} className="mb-4 animate-bounce" />
              <span className="text-4xl font-bold">112</span>
              <span className="text-xl mt-2 opacity-90">National Emergency Number</span>
            </a>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="tel:181" className="bg-white border border-gray-200 p-6 rounded-xl flex items-center justify-between hover:border-[#7655C9] hover:shadow-md transition-all">
                <div>
                  <span className="block text-xl font-bold text-gray-800">181</span>
                  <span className="text-gray-500 text-sm">Women Helpline</span>
                </div>
                <Phone size={24} color={colors.purple} />
              </a>
              <button className="bg-white border border-gray-200 p-6 rounded-xl flex items-center justify-between hover:border-[#7655C9] hover:shadow-md transition-all text-left">
                <div>
                  <span className="block text-xl font-bold text-gray-800">Campus Security</span>
                  <span className="text-gray-500 text-sm">24/7 Rapid Response</span>
                </div>
                <Phone size={24} color={colors.purple} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#17233D] mb-2">Track Your Report</h2>
            <p className="text-gray-500 mb-6">Enter your 11-character Tracking ID to check the status of your case.</p>
            <input type="text" placeholder="e.g., CS-A1B2C3D4" className="w-full p-4 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-[#7655C9]" />
            <button className="w-full bg-[#17233D] text-white p-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors">Check Status</button>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {reportStep === 0 && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-[#17233D] mb-6 flex items-center gap-2">
                    <Shield color={colors.purple} /> Privacy & Limitations
                  </h2>
                  <div className="space-y-4 mb-8">
                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer border border-gray-200">
                      <input type="checkbox" className="mt-1 w-5 h-5 accent-[#7655C9]" checked={agreedToTerms.police} onChange={(e) => setAgreedToTerms({...agreedToTerms, police: e.target.checked})} />
                      <span className="text-gray-700 text-sm">I understand this platform submits a grievance to College Management. <strong>This is NOT a formal police complaint (FIR).</strong></span>
                    </label>
                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer border border-gray-200">
                      <input type="checkbox" className="mt-1 w-5 h-5 accent-[#7655C9]" checked={agreedToTerms.privacy} onChange={(e) => setAgreedToTerms({...agreedToTerms, privacy: e.target.checked})} />
                      <span className="text-gray-700 text-sm">I understand that highly specific details may inadvertently reveal my identity to college staff.</span>
                    </label>
                  </div>
                  <button 
                    disabled={!agreedToTerms.police || !agreedToTerms.privacy}
                    onClick={() => setReportStep(1)} 
                    className="w-full bg-[#7655C9] text-white p-4 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    I Understand, Continue
                  </button>
                </div>
              )}

              {reportStep === 1 && (
                <div className="p-8">
                  <h2 className="text-xl font-bold text-[#17233D] mb-6">Incident Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select College *</label>
                      <select className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#7655C9] bg-white">
                        <option>XYZ Engineering College</option>
                        <option>ABC Medical Institute</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                      <select className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#7655C9] bg-white">
                        <option>Physical Harassment</option>
                        <option>Stalking</option>
                        <option>Verbal Harassment</option>
                        <option>Online Harassment</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button onClick={() => setReportStep(0)} className="px-6 py-2 text-gray-500 font-medium">Back</button>
                    <button onClick={() => setReportStep(2)} className="bg-[#17233D] text-white px-8 py-2 rounded-lg font-semibold hover:bg-gray-800">Next</button>
                  </div>
                </div>
              )}

              {reportStep === 2 && (
                <div className="p-8">
                  <h2 className="text-xl font-bold text-[#17233D] mb-6">Description & Evidence</h2>
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4 flex gap-2">
                    <EyeOff size={16} className="mt-0.5" />
                    <p><strong>Anonymity Tip:</strong> Avoid mentioning exact class times or small group sizes.</p>
                  </div>
                  <textarea 
                    placeholder="Describe what happened in detail..." 
                    className="w-full p-4 border border-gray-200 rounded-xl h-32 mb-6 focus:outline-none focus:border-[#7655C9]"
                  ></textarea>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600 mb-1">Upload Photos, Videos or Documents</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-green-600 bg-green-50 w-fit mx-auto px-3 py-1 rounded-full mt-2">
                      <Shield size={12} /> Exif/GPS data automatically stripped
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button onClick={() => setReportStep(1)} className="px-6 py-2 text-gray-500 font-medium">Back</button>
                    <button onClick={() => setReportStep(3)} className="bg-[#17233D] text-white px-8 py-2 rounded-lg font-semibold hover:bg-gray-800">Next</button>
                  </div>
                </div>
              )}

              {reportStep === 3 && (
                <div className="p-8">
                  <h2 className="text-xl font-bold text-[#17233D] mb-6">Follow-up Contact (Optional)</h2>
                  <p className="text-gray-600 text-sm mb-6">Provide a safe way for investigators to reach you, or rely solely on your Tracking ID.</p>
                  
                  <div className="space-y-4">
                    <label className="block border border-gray-200 p-4 rounded-xl cursor-pointer hover:border-[#7655C9]">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="contact" className="accent-[#7655C9]" defaultChecked />
                        <span className="font-semibold text-gray-800">Use Tracking ID Only (Highest Privacy)</span>
                      </div>
                    </label>

                    <label className="block border border-gray-200 p-4 rounded-xl cursor-pointer hover:border-[#7655C9]">
                      <div className="flex items-center gap-3 mb-2">
                        <input type="radio" name="contact" className="accent-[#7655C9]" />
                        <span className="font-semibold text-gray-800">Provide an Email Address</span>
                      </div>
                      <input type="email" placeholder="e.g., anonymous@proton.me" className="w-full p-2 border border-gray-200 rounded-lg ml-7 w-[calc(100%-1.75rem)] text-sm focus:outline-none focus:border-[#7655C9]" />
                    </label>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button onClick={() => setReportStep(2)} className="px-6 py-2 text-gray-500 font-medium">Back</button>
                    <button onClick={generateTrackingId} className="bg-[#23875A] text-white px-8 py-2 rounded-lg font-semibold hover:bg-green-700">Submit Report</button>
                  </div>
                </div>
              )}

              {reportStep === 5 && (
                <div className="p-10 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} color={colors.green} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#17233D] mb-2">Report Submitted Securely</h2>
                  
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
                    <p className="text-red-800 font-bold mb-2">CRITICAL: Save this Tracking ID</p>
                    <p className="text-sm text-red-600 mb-4">If you lose this ID, you will permanently lose access to updates regarding this report.</p>
                    
                    <div className="bg-white border-2 border-dashed border-red-300 rounded-lg p-4 flex items-center justify-between">
                      <span className="text-2xl font-mono font-bold tracking-widest text-gray-800">{trackingId}</span>
                      <button 
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                      >
                        {isCopied ? <CheckCircle size={16} className="text-green-600"/> : <Copy size={16} />}
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <button onClick={() => {setReportStep(0); setActiveTab('track');}} className="text-[#7655C9] font-semibold hover:underline">
                    Go to Tracking Portal
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CollegeStaffPortal = () => {
  return (
    <div className="flex h-screen bg-gray-50 text-black w-full">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={24} color={colors.purple} />
            <span className="font-bold text-[#17233D]">CampusShield</span>
          </div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Staff Portal</span>
        </div>
        <div className="p-4">
          <div className="bg-[#F0EDFA] text-[#7655C9] p-3 rounded-lg text-sm font-semibold mb-6 flex items-center gap-2">
            <MapPin size={16} /> XYZ Eng College
          </div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 p-2 bg-gray-50 text-[#17233D] rounded-md font-medium"><Activity size={18} /> Dashboard</a>
            <a href="#" className="flex items-center gap-3 p-2 text-gray-500 hover:bg-gray-50 rounded-md font-medium"><FileText size={18} /> Active Cases</a>
          </nav>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#17233D]">Case Dashboard</h1>
          <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold animate-pulse">2 SLA Breaches</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Tracking ID</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">SLA Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-mono font-medium text-gray-800">CS-A1B2C3D4</td>
                <td className="p-4"><span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">Stalking</span></td>
                <td className="p-4"><span className="text-red-600 font-semibold flex items-center gap-1"><AlertTriangle size={14}/> Overdue 48h</span></td>
                <td className="p-4"><button className="text-[#7655C9] font-medium hover:underline">Review</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SuperAdminPortal = () => {
  return (
    <div className="flex h-screen bg-[#17233D] text-white w-full">
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <Shield size={24} color={colors.purple} />
          <span className="font-bold text-xl">CampusShield</span>
        </div>
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg text-white font-medium"><Users size={18} /> Colleges (Tenants)</a>
          <a href="#" className="flex items-center gap-3 p-3 text-gray-400 hover:bg-gray-800 rounded-lg font-medium"><Settings size={18} /> Global Settings</a>
        </nav>
      </div>
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Tenant Management</h1>
          <button className="bg-[#7655C9] hover:bg-purple-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"><Plus size={18}/> Onboard New College</button>
        </div>
        
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-gray-400 text-sm">
              <tr>
                <th className="p-4">Institution Name</th>
                <th className="p-4">Active Cases</th>
                <th className="p-4">SLA Compliance</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-t border-gray-700">
                <td className="p-4 font-semibold">XYZ Engineering College</td>
                <td className="p-4 text-gray-300">14</td>
                <td className="p-4"><span className="text-green-400">92%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('landing');
  
  // Fake statistics data - we will connect this to the real database later
  const [stats, setStats] = useState({ 
    total: 1284, 
    latestTime: '2 mins ago' 
  });

  if (view === 'student') return <StudentPortal />;
  if (view === 'staff') return <CollegeStaffPortal />;
  if (view === 'superadmin') return <SuperAdminPortal />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-black">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#17233D] rounded-3xl mb-6 shadow-xl">
          <Shield size={40} color={colors.purple} />
        </div>
        <h1 className="text-4xl font-black text-[#17233D] mb-4">CampusShield</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">Select your portal to continue. Access is strictly separated to ensure maximum security and privacy.</p>
        
        {/* NEW LIVE STATS BANNER */}
        <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-green-100 p-3 rounded-xl"><TrendingUp size={24} className="text-green-700"/></div>
            <div className="text-left">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Protected Reports</p>
              <p className="text-2xl font-black text-[#17233D]">{stats.total.toLocaleString()}</p>
            </div>
          </div>
          <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-xl"><ShieldCheck size={24} className="text-purple-700"/></div>
            <div className="text-left">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Latest Platform Activity</p>
              <p className="text-sm font-bold text-[#17233D]">Anonymous report secured • {stats.latestTime}</p>
            </div>
          </div>
        </div>
        {/* END NEW LIVE STATS BANNER */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <button onClick={() => setView('student')} className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#7655C9] hover:shadow-lg transition-all group text-left">
          <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users size={24} color={colors.purple} />
          </div>
          <h2 className="text-xl font-bold text-[#17233D] mb-2">Student Portal</h2>
          <p className="text-sm text-gray-500">Report incidents anonymously, track your case, or access emergency SOS.</p>
        </button>

        <button onClick={() => setView('staff')} className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#17233D] hover:shadow-lg transition-all group text-left relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full"><Lock size={12}/> Secure</div>
          <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileText size={24} className="text-gray-700" />
          </div>
          <h2 className="text-xl font-bold text-[#17233D] mb-2">College Staff</h2>
          <p className="text-sm text-gray-500">For authorized ICC members and management to review and resolve cases.</p>
        </button>

        <button onClick={() => setView('superadmin')} className="bg-[#17233D] p-8 rounded-2xl border border-[#17233D] hover:shadow-xl transition-all group text-left relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full"><Lock size={12}/> Owner</div>
          <div className="bg-gray-800 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Settings size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Super Admin</h2>
          <p className="text-sm text-gray-400">Platform owner dashboard to manage tenant colleges.</p>
        </button>
      </div>
    </div>
  );
}