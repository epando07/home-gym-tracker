import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// ─── MASTER SCHEDULE DATABASE LOOKUP ───
const WEEK_DAYS = [
  { name: 'Monday', short: 'MON', focus: 'Push — Chest & Shoulders', type: 'Work' },
  { name: 'Tuesday', short: 'TUE', focus: 'Pull — Back & Biceps', type: 'Work' },
  { name: 'Wednesday', short: 'WED', focus: 'Active Recovery / Mobility', type: 'Rest' },
  { name: 'Thursday', short: 'THU', focus: 'Legs — Quads & Glutes', type: 'Work' },
  { name: 'Friday', short: 'FRI', focus: 'Upper Body Hypertrophy', type: 'Work' },
  { name: 'Saturday', short: 'SAT', focus: 'Conditioning Circuit / HIIT', type: 'Work' },
  { name: 'Sunday', short: 'SUN', focus: 'Full Rest & Muscle Repair', type: 'Rest' },
]

function App() {
  const [count, setCount] = useState(0)
  const [members, setMembers] = useState([])
  const [exercises, setExercises] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [equipment, setEquipment] = useState([])

  const [view, setView] = useState('clients') 

  // --- Tier 2 & 3 States ---
  const [selectedMemberId, setSelectedMemberId] = useState(null)
  const [memberHistory, setMemberHistory] = useState([])
  const [muscleGroups, setMuscleGroups] = useState([])
  const [selectedMuscle, setSelectedMuscle] = useState('')

  // --- Global Timeline State Tracker ---
  const [selectedDayIdx, setSelectedDayIdx] = useState(0) 

  // --- Profile Inspector Tab States ---
  const [profileTab, setProfileTab] = useState('history') // 'history' or 'manage'
  const [editingLogId, setEditingLogId] = useState(null)  
  const [editSets, setEditSets] = useState('')
  const [editReps, setEditReps] = useState('')
  const [editWeight, setEditWeight] = useState('')

  // ─── TIER 4: GLOBAL MEMBER EDIT/DELETE STATE PLUMBING ───
  const [isEditingMember, setIsEditingMember] = useState(false)
  const [editMemberFirstName, setEditMemberFirstName] = useState('')
  const [editMemberLastName, setEditMemberLastName] = useState('')
  const [editMemberStatus, setEditMemberStatus] = useState('Active')

  // --- Form States for Logging a Workout ---
  const [formMemberId, setFormMemberId] = useState('M1001')
  const [formExerciseId, setFormExerciseId] = useState('1')
  const [formSets, setFormSets] = useState('3')
  const [formReps, setFormReps] = useState('10')
  const [formWeight, setFormWeight] = useState('135')
  const [formEquipment, setFormEquipment] = useState('Barbell')
  const [formBandColor, setFormBandColor] = useState('band_orange')

  // --- Form States for Creation ---
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [newExerciseName, setNewExerciseName] = useState('')
  const [newExerciseMuscle, setNewExerciseMuscle] = useState('legs')

  // 1. Fetch Members Table
  useEffect(() => {
    const fetchMembers = async () => {
      const response = await fetch('http://localhost:3000/api/members')
      const result = await response.json()
      setMembers(result)
    }
    fetchMembers()
  }, [])

  // 2. Fetch Exercises Table
  useEffect(() => {
    const fetchExercises = async () => {
      const url = selectedMuscle 
        ? `http://localhost:3000/api/exercises?muscle_group=${selectedMuscle}`
        : 'http://localhost:3000/api/exercises'
      const response = await fetch(url)
      const result = await response.json()
      setExercises(result)
    }
    fetchExercises()
  }, [selectedMuscle])

  // 3. Fetch Workouts Table
  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('http://localhost:3000/api/workouts')
      const result = await response.json()
      setWorkouts(result)
    }
    fetchWorkouts()
  }, [])

  // 4. Fetch Equipment Table
  useEffect(() => {
    const fetchEquipment = async () => {
      const response = await fetch('http://localhost:3000/api/equipment')
      const result = await response.json()
      setEquipment(result)
    }
    fetchEquipment()
  }, [])

  // 5. Fetch Muscle Groups
  useEffect(() => {
    const fetchGroups = async () => {
      const response = await fetch('http://localhost:3000/api/muscle-groups')
      const result = await response.json()
      setMuscleGroups(result)
    }
    fetchGroups()
  }, [])

  // --- Click Handler: Load Specific Member History ---
  const handleSelectMember = async (memberId) => {
    setSelectedMemberId(memberId)
    setEditingLogId(null) 
    setIsEditingMember(false) // Exit edit mode when switching people
    try {
      const response = await fetch(`http://localhost:3000/api/members/${memberId}/history`)
      const result = await response.json()
      setMemberHistory(result)
    } catch (err) {
      console.error("Error fetching member history:", err)
    }
  }

  // ─── MEMBER PROFILE EDIT & DELETE ACTIONS ───
  
  const handleStartEditMember = () => {
    if (!activeMember) return
    setIsEditingMember(true)
    setEditMemberFirstName(activeMember.firstName)
    setEditMemberLastName(activeMember.lastName || '')
    setEditMemberStatus(activeMember.status || 'Active')
  }

  const handleSaveEditMember = () => {
    if (!editMemberFirstName.trim()) return alert("First name cannot be blank!")
    
    setMembers(prev => prev.map(m => {
      if (m.memberId === selectedMemberId) {
        return {
          ...m,
          firstName: editMemberFirstName.trim(),
          lastName: editMemberLastName.trim(),
          status: editMemberStatus
        }
      }
      return m
    }))
    setIsEditingMember(false)
    alert("Client profile configuration saved live!")
  }

  const handleDeleteMember = (memberId) => {
    const confirmation = window.confirm(`⚠️ CRITICAL OPERATION: Are you absolutely sure you want to permanently erase this member from the master system directory? This clears all profile markers.`);
    if (confirmation) {
      setMembers(prev => prev.filter(m => m.memberId !== memberId))
      setSelectedMemberId(null)
      setMemberHistory([])
      setIsEditingMember(false)
      alert("Client stripped from active identity directories successfully.")
    }
  }

  // --- Management Workouts: Edit, Swap, and Delete Data Plumbing ---
  const handleStartEditLog = (log) => {
    setEditingLogId(log.id)
    setEditSets(log.sets)
    setEditReps(log.reps)
    setEditWeight(log.weight || 0)
  }

  const handleSaveEditLog = (logId) => {
    setMemberHistory(prev => prev.map(item => {
      if (item.id === logId) {
        return {
          ...item,
          sets: parseInt(editSets) || 0,
          reps: parseInt(editReps) || 0,
          weight: parseInt(editWeight) || 0
        }
      }
      return item
    }))
    setEditingLogId(null)
    alert(`Workout session entry #${logId} updated successfully!`)
  }

  const handleDeleteLog = (logId) => {
    if (window.confirm("Are you sure you want to delete this workout log from the client profile?")) {
      setMemberHistory(prev => prev.filter(item => item.id !== logId))
      alert(`Session record entry #${logId} erased successfully.`)
    }
  }

  // --- Submit Handler: Write New Workout Session ---
  const handleLogWorkout = async (e) => {
    e.preventDefault()
    const isBand = formEquipment.toLowerCase().includes("band")

    const payload = {
      memberId: formMemberId,
      exerciseId: parseInt(formExerciseId),
      sets: parseInt(formSets),
      reps: parseInt(formReps),
      weight: isBand ? null : parseInt(formWeight),
      equipmentType: formEquipment,
      bandColor: isBand ? formBandColor : null
    }

    try {
      const response = await fetch('http://localhost:3000/api/workouts/200/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert("Workout logged successfully!")
        const refreshResponse = await fetch('http://localhost:3000/api/workouts')
        const refreshResult = await refreshResponse.json()
        setWorkouts(refreshResult)
        
        if (selectedMemberId) {
          const memHistRes = await fetch(`http://localhost:3000/api/members/${selectedMemberId}/history`)
          const memHistData = await memHistRes.json()
          setMemberHistory(memHistData)
        }
      }
    } catch (err) {
      console.error("Network error:", err)
    }
  }

  // --- Submit Handler: POST New Member ---
  const handleCreateMember = async (e) => {
    e.preventDefault()
    if (!newFirstName) return alert("Please enter at least a first name!")

    const payload = {
      memberId: `M${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: newFirstName,
      lastName: newLastName,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    }

    try {
      const response = await fetch('http://localhost:3000/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert("New client added to roster!")
        setNewFirstName('')
        setNewLastName('')
        const refreshResponse = await fetch('http://localhost:3000/api/members')
        const refreshResult = await refreshResponse.json()
        setMembers(refreshResult)
      }
    } catch (err) {
      console.error("Network error creating member:", err)
    }
  }

  // --- Submit Handler: POST New Exercise ---
  const handleCreateExercise = async (e) => {
    e.preventDefault()
    if (!newExerciseName) return alert("Please enter an exercise name!")

    const payload = {
      name: newExerciseName,
      muscle_group: newExerciseMuscle
    }

    try {
      const response = await fetch('http://localhost:3000/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert("Exercise added to master library!")
        setNewExerciseName('')
        const refreshResponse = await fetch('http://localhost:3000/api/exercises')
        const refreshResult = await refreshResponse.json()
        setExercises(refreshResult)
      }
    } catch (err) {
      console.error("Network error creating exercise:", err)
    }
  }

  const activeMember = members.find(m => m.memberId === selectedMemberId)
  const currentDay = WEEK_DAYS[selectedDayIdx]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f1011', color: '#fff', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
      {/* ─── PANE 1: LEFT SIDEBAR ─── */}
      <aside style={{ width: '260px', backgroundColor: '#141618', borderRight: '1px solid #27272a', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
        <div>
          <h1 style={{ color: '#b8f000', margin: 0, fontSize: '20px', letterSpacing: '1px' }}>🏋️‍♂️ CoachOS</h1>
          <p style={{ margin: '2px 0 0 0', color: '#666', fontSize: '11px', textTransform: 'uppercase' }}>Home Gym Center</p>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #27272a', paddingBottom: '10px', gap: '10px' }}>
          <button 
            type="button"
            onClick={() => setView('clients')} 
            style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: view === 'clients' ? '#b8f000' : 'transparent', color: view === 'clients' ? 'black' : '#666', border: 'none', fontWeight: 'bold', borderRadius: '4px' }}
          >
            Clients
          </button>
          <button 
            type="button"
            onClick={() => setView('library')} 
            style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: view === 'library' ? '#b8f000' : 'transparent', color: view === 'library' ? 'black' : '#666', border: 'none', fontWeight: 'bold', borderRadius: '4px' }}
          >
            Library
          </button>
        </div>

        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>CLIENT ROSTER ({members.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {members.map((member) => (
              <li key={member.memberId} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: selectedMemberId === member.memberId ? '#b8f000' : '#fff' }}>
                  {member.firstName} {member.lastName}
                </span>
                <button 
                  type="button"
                  onClick={() => { handleSelectMember(member.memberId); setView('clients'); }}
                  style={{ marginLeft: 'auto', padding: '2px 6px', fontSize: '11px', cursor: 'pointer', backgroundColor: selectedMemberId === member.memberId ? '#b8f000' : '#27272a', color: selectedMemberId === member.memberId ? 'black' : 'white', border: 'none', borderRadius: '3px' }}
                >
                  {selectedMemberId === member.memberId ? 'Active' : 'Logs'}
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleCreateMember} style={{ marginTop: '20px', padding: '10px', border: '1px dashed #3f3f46', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#b8f000' }}>➕ Onboard New Client</span>
            <input type="text" placeholder="First Name" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} style={{ padding: '4px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white', fontSize: '12px' }} />
            <button type="submit" style={{ backgroundColor: '#27272a', color: '#b8f000', border: '1px solid #b8f000', padding: '4px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Save Client</button>
          </form>
        </div>
      </aside>

      {/* WORKSPACE AREA */}
      <main style={{ flex: 1, padding: '20px 30px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid #27272a', paddingBottom: '15px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ margin: 0, fontSize: '22px' }}>System Active</h2>
            <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>HMR database pathways operating live.</p>
          </div>
          <button type="button" onClick={() => setCount(c => c + 1)} style={{ marginLeft: 'auto', padding: '8px 16px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
            Engine Clicks: {count}
          </button>
        </div>

        {/* VIEW 1: CLIENTS WORKSPACE LAYOUT */}
        {view === 'clients' && (
          <div style={{ display: 'flex', gap: '25px', flex: 1, alignItems: 'flex-start' }}>
            
            {/* COLUMN A: MIDDLE CORE ENGINE */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '25px', minWidth: 0 }}>
              
              {/* Master Weekly Schedule Timeline Card */}
              <div style={{ backgroundColor: '#141618', padding: '20px', borderRadius: '8px', border: '1px solid #27272a', textAlign: 'left' }}>
                <div style={{ display: 'flex', marginBottom: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', tracking: '1px', color: '#aaa' }}>📅 MASTER WEEKLY SCHEDULE TIMELINE</h3>
                  <span style={{ fontSize: '12px', color: '#b8f000', fontWeight: 'bold' }}>Week of Jun 24, 2026</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '15px' }}>
                  {WEEK_DAYS.map((day, idx) => {
                    const isActiveDay = idx === selectedDayIdx;
                    return (
                      <button
                        key={day.name}
                        type="button"
                        onClick={() => setSelectedDayIdx(idx)}
                        style={{
                          padding: '10px 4px',
                          cursor: 'pointer',
                          backgroundColor: isActiveDay ? 'rgba(184, 240, 0, 0.1)' : '#27272a',
                          border: isActiveDay ? '1px solid #b8f000' : '1px solid #3f3f46',
                          borderRadius: '6px',
                          color: isActiveDay ? '#b8f000' : '#fff',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{day.short}</div>
                        <div style={{ fontSize: '9px', color: day.type === 'Rest' ? '#ef4444' : '#666', marginTop: '3px' }}>{day.type}</div>
                      </button>
                    )
                  })}
                </div>

                <div style={{ backgroundColor: '#0f1011', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #b8f000' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>📋 All Clients Schedule Overview for <span style={{ color: '#b8f000' }}>{currentDay.name}</span>:</h4>
                  <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>Target Macro Routine: {currentDay.focus}</p>
                  
                  {members.length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#444' }}>No clients onboarded onto roster database yet.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {members.map(m => (
                        <div key={m.memberId} style={{ backgroundColor: '#141618', padding: '8px 12px', borderRadius: '4px', border: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{m.firstName}</span>
                          <span style={{ 
                            fontSize: '10px', 
                            fontWeight: 'bold', 
                            color: currentDay.type === 'Rest' ? '#ef4444' : '#b8f000',
                            backgroundColor: currentDay.type === 'Rest' ? 'rgba(239,68,68,0.1)' : 'rgba(184,240,0,0.1)',
                            padding: '2px 5px',
                            borderRadius: '3px'
                          }}>
                            {currentDay.type === 'Rest' ? 'Recovery' : 'Assigned'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Workout Session Logger */}
              <div style={{ backgroundColor: '#141618', padding: '20px', borderRadius: '8px', border: '1px solid #27272a', textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>🏋️‍♂️ Log a Completed Workout Session</h3>
                <form onSubmit={handleLogWorkout} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Target Client</label>
                      <select value={formMemberId} onChange={e => setFormMemberId(e.target.value)} style={{ width: '100%', padding: '6px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white' }}>
                        {members.map(m => <option key={m.memberId} value={m.memberId}>{m.firstName}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Movement</label>
                      <select value={formExerciseId} onChange={e => setFormExerciseId(e.target.value)} style={{ width: '100%', padding: '6px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white' }}>
                        {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Equipment Config</label>
                    <select value={formEquipment} onChange={e => setFormEquipment(e.target.value)} style={{ width: '100%', padding: '6px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white' }}>
                      {equipment.map(eq => <option key={eq.id} value={eq.name}>{eq.name}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666' }}>Sets</label>
                      <input type="number" value={formSets} onChange={e => setFormSets(e.target.value)} style={{ width: '50px', display: 'block', padding: '4px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666' }}>Reps</label>
                      <input type="number" value={formReps} onChange={e => setFormReps(e.target.value)} style={{ width: '50px', display: 'block', padding: '4px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white' }} />
                    </div>
                    {formEquipment.toLowerCase().includes("band") ? (
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '12px', color: '#b8f000' }}>Resistance Band Level</label>
                        <select value={formBandColor} onChange={e => setFormBandColor(e.target.value)} style={{ width: '100%', display: 'block', padding: '4px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white' }}>
                          <option value="band_orange">Orange (Light)</option>
                          <option value="band_red">Red (Medium)</option>
                          <option value="band_blue">Blue (Heavy)</option>
                          <option value="band_green">Green (Very Heavy)</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label style={{ fontSize: '12px', color: '#666' }}>Load Weight (lbs)</label>
                        <input type="number" value={formWeight} onChange={e => setFormWeight(e.target.value)} style={{ width: '90px', display: 'block', padding: '4px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white' }} />
                      </div>
                    )}
                  </div>
                  <button type="submit" style={{ backgroundColor: '#b8f000', color: 'black', fontWeight: 'bold', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' }}>Write Session to DB</button>
                </form>
              </div>
            </div>

            {/* ─── PANE 3: RIGHT SIDE CLIENT PROFILE INSPECTOR ─── */}
            <div style={{ width: '420px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
              {selectedMemberId ? (
                <div style={{ backgroundColor: '#141618', padding: '20px', borderRadius: '8px', border: '1px solid #b8f000', textAlign: 'left', minHeight: '450px' }}>
                  
                  {/* Top Header Controls row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                    <h3 style={{ margin: 0, color: '#b8f000', fontSize: '14px' }}>📋 Client Profile Inspector</h3>
                    
                    {/* ─── TIER 4 ROSTER DESTRUCTION & MODIFICATION CONTROLS ─── */}
                    {!isEditingMember && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={handleStartEditMember} style={{ backgroundColor: '#27272a', color: '#fff', border: '1px solid #3f3f46', padding: '2px 8px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}>Edit Profile</button>
                        <button type="button" onClick={() => handleDeleteMember(selectedMemberId)} style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '2px 8px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Header State Conditional Template Rendering */}
                  {isEditingMember ? (
                    <div style={{ backgroundColor: '#1c1e20', padding: '12px', borderRadius: '6px', border: '1px dashed #3f3f46', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#b8f000' }}>Modify Client Identity Markers:</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" value={editMemberFirstName} onChange={e => setEditMemberFirstName(e.target.value)} placeholder="First Name" style={{ flex: 1, padding: '4px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', fontSize: '13px' }} />
                        <input type="text" value={editMemberLastName} onChange={e => setEditMemberLastName(e.target.value)} placeholder="Last Name" style={{ flex: 1, padding: '4px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', fontSize: '13px' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '3px' }}>Membership State Tracker:</label>
                        <select value={editMemberStatus} onChange={e => setEditMemberStatus(e.target.value)} style={{ width: '100%', padding: '4px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', fontSize: '13px' }}>
                          <option value="Active">Active Subscription</option>
                          <option value="Suspended">Suspended Track</option>
                          <option value="Pending">Pending Validation</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <button type="button" onClick={handleSaveEditMember} style={{ flex: 1, padding: '5px', backgroundColor: '#b8f000', color: 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Save Profile Changes</button>
                        <button type="button" onClick={() => setIsEditingMember(false)} style={{ padding: '5px 12px', backgroundColor: '#3f3f46', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold' }}>{activeMember ? `${activeMember.firstName} ${activeMember.lastName || ''}` : selectedMemberId}</h2>
                      
                      <div style={{ display: 'flex', gap: '15px', fontSize: '11px', color: '#666', borderBottom: '1px solid #27272a', paddingBottom: '12px', marginBottom: '15px' }}>
                        <span>STATUS: <strong style={{ color: activeMember?.status === 'Active' ? '#b8f000' : '#ef4444', backgroundColor: 'rgba(255,255,255,0.03)', padding: '2px 5px', borderRadius: '3px' }}>{activeMember?.status}</strong></span>
                        <span>SINCE: <strong style={{ color: '#fff' }}>{activeMember?.joinDate}</strong></span>
                      </div>
                    </>
                  )}

                  {/* Profile Section Tab Navigation Bars */}
                  <div style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #27272a', paddingBottom: '8px', marginBottom: '15px' }}>
                    <button 
                      type="button" 
                      onClick={() => setProfileTab('history')} 
                      style={{ background: 'none', border: 'none', color: profileTab === 'history' ? '#b8f000' : '#666', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', padding: 0 }}
                    >
                      History Logs
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setProfileTab('manage')} 
                      style={{ background: 'none', border: 'none', color: profileTab === 'manage' ? '#b8f000' : '#666', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', padding: 0 }}
                    >
                      ⚙️ Manage Sessions
                    </button>
                  </div>

                  {/* Sub-Tab Windows */}
                  {profileTab === 'history' ? (
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', tracking: '1px' }}>PERSONAL LOG ARCHIVES ({memberHistory.length})</h4>
                      {memberHistory.length === 0 ? (
                        <p style={{ color: '#444', fontSize: '13px', italic: true }}>No workout history records logged under this profile blueprint yet.</p>
                      ) : (
                        <ul style={{ paddingLeft: '0', listStyle: 'none', margin: 0, maxHeight: '350px', overflowY: 'auto' }}>
                          {memberHistory.map((log) => (
                            <li key={log.id} style={{ padding: '8px 0', borderBottom: '1px solid #1c1e20', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong style={{ color: '#fff' }}>{log.exerciseName}</strong>
                                <span style={{ color: '#666', fontSize: '11px' }}>{log.date}</span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#aaa' }}>
                                Config: <span style={{ color: '#b8f000' }}>{log.equipmentUsed}</span> · {log.sets}x{log.reps} {log.bandLevel ? `[${log.bandLevel}]` : `@ ${log.weight} lbs`}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', tracking: '1px' }}>SWAP OR ERASE SESSION RECORDS</h4>
                      {memberHistory.length === 0 ? (
                        <p style={{ color: '#444', fontSize: '13px' }}>No entries available to modify.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
                          {memberHistory.map((log) => (
                            <div key={log.id} style={{ backgroundColor: '#1c1e20', padding: '10px', borderRadius: '6px', border: '1px solid #27272a' }}>
                              
                              {editingLogId === log.id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <span style={{ fontSize: '12px', color: '#b8f000', fontWeight: 'bold' }}>Editing: {log.exerciseName}</span>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <input type="number" value={editSets} onChange={e => setEditSets(e.target.value)} placeholder="Sets" style={{ width: '45px', padding: '2px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', fontSize: '12px' }} />
                                    <input type="number" value={editReps} onChange={e => setEditReps(e.target.value)} placeholder="Reps" style={{ width: '45px', padding: '2px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', fontSize: '12px' }} />
                                    <input type="number" value={editWeight} onChange={e => setEditWeight(e.target.value)} placeholder="lbs" style={{ width: '60px', padding: '2px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', fontSize: '12px' }} />
                                    <button type="button" onClick={() => handleSaveEditLog(log.id)} style={{ padding: '2px 8px', backgroundColor: '#b8f000', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Save</button>
                                    <button type="button" onClick={() => setEditingLogId(null)} style={{ padding: '2px 8px', backgroundColor: '#3f3f46', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>X</button>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{log.exerciseName}</div>
                                    <div style={{ fontSize: '11px', color: '#666' }}>{log.date} · {log.sets}x{log.reps} {log.weight ? `@ ${log.weight} lbs` : `[Band]`}</div>
                                  </div>
                                  
                                  <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
                                    <button type="button" onClick={() => handleStartEditLog(log)} style={{ backgroundColor: '#27272a', color: '#b8f000', border: '1px solid #b8f000', padding: '3px 8px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}>Swap</button>
                                    <button type="button" onClick={() => handleDeleteLog(log.id)} style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '3px 8px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                  </div>
                                </div>
                              )}

                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                <div style={{ padding: '40px 20px', border: '1px dashed #27272a', borderRadius: '8px', color: '#666', textAlign: 'center', backgroundColor: '#141618' }}>
                  👈 Select a member from your roster list to open the Right Profile Inspector panel.
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 2: LIBRARIES & DICTIONARIES TAB */}
        {view === 'library' && (
          <div style={{ textAlign: 'left' }}>
            <div style={{ backgroundColor: '#141618', padding: '20px', border: '1px solid #27272a', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>📋 Central Exercises Dictionary Library</h3>
              
              <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setSelectedMuscle('')} style={{ padding: '4px 10px', fontSize: '12px', cursor: 'pointer', backgroundColor: selectedMuscle === '' ? '#b8f000' : '#27272a', color: selectedMuscle === '' ? 'black' : 'white', border: 'none', borderRadius: '12px' }}>All</button>
                {muscleGroups.map(g => (
                  <button key={g} type="button" onClick={() => setSelectedMuscle(g)} style={{ padding: '4px 10px', fontSize: '12px', cursor: 'pointer', backgroundColor: selectedMuscle === g ? '#b8f000' : '#27272a', color: selectedMuscle === g ? 'black' : 'white', border: 'none', borderRadius: '12px', textTransform: 'capitalize' }}>{g}</button>
                ))}
              </div>

              <p style={{ fontSize: '12px', color: '#666' }}>{exercises.length} movements matching parameter filters.</p>
              <ul style={{ maxHeight: '180px', overflowY: 'auto', paddingLeft: '15px', fontSize: '14px' }}>
                {exercises.map(ex => <li key={ex.id} style={{ textTransform: 'capitalize', margin: '4px 0' }}>{ex.name} <span style={{ color: '#444', fontSize: '11px' }}>({ex.muscle_group})</span></li>)}
              </ul>

              <form onSubmit={handleCreateExercise} style={{ marginTop: '20px', padding: '12px', border: '1px dashed #3f3f46', borderRadius: '6px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#b8f000', whiteSpace: 'nowrap' }}>➕ Expansion Entry:</span>
                <input type="text" placeholder="Exercise Name" value={newExerciseName} onChange={e => setNewExerciseName(e.target.value)} style={{ padding: '4px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white', fontSize: '12px', flex: 1 }} />
                <select value={newExerciseMuscle} onChange={e => setNewExerciseMuscle(e.target.value)} style={{ padding: '4px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: 'white', fontSize: '12px' }}>
                  {muscleGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <button type="submit" style={{ backgroundColor: '#b8f000', color: 'black', fontWeight: 'bold', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}>Create</button>
              </form>
            </div>

            <div style={{ marginTop: '20px', backgroundColor: '#141618', padding: '20px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>🛠️ Available Equipment Asset Inventory</h3>
              <p style={{ fontSize: '12px', color: '#666' }}>{equipment.length} verified functional hardware tracks logged.</p>
              <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '14px' }}>
                {equipment.map(eq => <li key={eq.id} style={{ margin: '4px 0' }}>{eq.name} <span style={{ color: '#444', fontSize: '11px' }}>[ID: #{eq.id}]</span></li>)}
              </ul>
            </div>

            <div style={{ marginTop: '20px', backgroundColor: '#141618', padding: '20px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>📋 Global Network History Activity Logs</h3>
              <p style={{ fontSize: '12px', color: '#666' }}>{workouts.length} total raw history records found across all member keys.</p>
              <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '13px', color: '#aaa', maxHeight: '150px', overflowY: 'auto' }}>
                {workouts.map(w => <li key={w.id} style={{ margin: '4px 0' }}>Session Record #{w.id}: {w.exerciseName} ({w.sets}x{w.reps})</li>)}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App