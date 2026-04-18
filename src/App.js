import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTask, setActiveTask] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  
  // রুটিন স্টেট - যা আপনি এডিট করতে পারবেন
  const [routine, setRoutine] = useState(() => {
    const saved = localStorage.getItem("st_star_routine");
    return saved ? JSON.parse(saved) : [
      { start: "01:00", end: "07:30", task: "Sleep (Deep Rest)" },
      { start: "07:30", end: "08:00", task: "Wake up & Breakfast" },
      { start: "08:00", end: "10:00", task: "Professional Study" },
      { start: "10:00", end: "15:00", task: "University Session" },
      { start: "15:00", end: "16:00", task: "Lunch & Rest" },
      { start: "16:00", end: "18:00", task: "Academic Study" },
      { start: "18:00", end: "21:00", task: "Organization Activities" },
      { start: "21:00", end: "22:00", task: "Online Work" },
      { start: "22:00", end: "23:00", task: "Dinner & Family Time" },
      { start: "23:00", end: "01:00", task: "Academic Study (Night)" },
    ];
  });

  const alertSound = new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'],
    volume: 0.5,
  });

  useEffect(() => {
    localStorage.setItem("st_star_routine", JSON.stringify(routine));
  }, [routine]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const timeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                      now.getMinutes().toString().padStart(2, '0');
      
      const current = routine.find(r => timeStr >= r.start && timeStr < r.end);
      if (current && current.task !== activeTask) {
        setActiveTask(current.task);
        alertSound.play();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [routine, activeTask]);

  return (
    <div style={styles.container}>
      {/* ব্যাকগ্রাউন্ড এনিমেশন */}
      <div style={styles.bgOverlay}>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={styles.glowCircle} 
        />
      </div>

      {/* মেইন ইন্টারফেস */}
      <div style={styles.glassBox}>
        <h2 style={styles.brand}>ST STAR</h2>
        <h1 style={styles.time}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</h1>
        <div style={styles.divider} />
        <p style={styles.statusLabel}>CURRENT STATUS</p>
        <motion.h3 key={activeTask} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.activeTaskText}>
          {activeTask || "Resting"}
        </motion.h3>
      </div>

      {/* সেটিংস বাটন */}
      <button onClick={() => setShowSettings(!showSettings)} style={styles.settingsBtn}>
        {showSettings ? "✕ Close" : "⚙ Edit Routine"}
      </button>

      {/* এডিটর প্যানেল */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} style={styles.sidePanel}>
            <h3>Edit Your Day</h3>
            {routine.map((item, idx) => (
              <div key={idx} style={styles.editRow}>
                <input style={styles.input} value={item.task} onChange={(e) => {
                  const newR = [...routine]; newR[idx].task = e.target.value; setRoutine(newR);
                }} />
                <input type="time" style={styles.timeInput} value={item.start} onChange={(e) => {
                  const newR = [...routine]; newR[idx].start = e.target.value; setRoutine(newR);
                }} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  container: { height: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: 'Inter, sans-serif' },
  bgOverlay: { position: 'absolute', width: '100%', height: '100%', zIndex: 0 },
  glowCircle: { width: '400px', height: '400px', background: 'radial-gradient(circle, #fbbf2433 0%, transparent 70%)', position: 'absolute', top: '20%', left: '30%', borderRadius: '50%' },
  glassBox: { zIndex: 1, textAlign: 'center', padding: '50px', borderRadius: '40px', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
  brand: { letterSpacing: '10px', color: '#fbbf24', fontSize: '18px', opacity: 0.8 },
  time: { fontSize: '80px', margin: '20px 0', fontWeight: '200' },
  divider: { height: '1px', background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)', margin: '20px 0' },
  statusLabel: { fontSize: '10px', color: '#666', letterSpacing: '3px' },
  activeTaskText: { fontSize: '28px', color: '#fbbf24', marginTop: '10px' },
  settingsBtn: { position: 'fixed', bottom: '30px', right: '30px', padding: '10px 20px', borderRadius: '30px', background: '#fbbf24', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer', zIndex: 10 },
  sidePanel: { position: 'fixed', right: 0, top: 0, height: '100%', width: '320px', background: '#0a0a0a', padding: '20px', borderLeft: '1px solid #222', zIndex: 9, overflowY: 'auto' },
  editRow: { display: 'flex', marginBottom: '10px', gap: '5px' },
  input: { background: '#111', border: '1px solid #333', color: '#fff', padding: '5px', flex: 1, borderRadius: '4px' },
  timeInput: { background: '#111', border: '1px solid #333', color: '#fff', width: '80px', borderRadius: '4px' }
};

export default App;