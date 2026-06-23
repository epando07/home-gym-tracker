const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

// =========================================================================
// 1. DATA STORAGE (MOCK DATABASE ARRAYS)
// =========================================================================

let muscleGroups = ["legs", "chest", "back", "arms", "core", "shoulders"];

// Resistance Band Levels Reference Lookup
const bandLevels = {
  band_orange: { label: "Orange", intensity: "Light" },
  band_red: { label: "Red", intensity: "Medium" },
  band_blue: { label: "Blue", intensity: "Heavy" },
  band_green: { label: "Green", intensity: "Very Heavy" },
};

let workouts = [
  {
    id: 101,
    memberId: "M1004",
    exerciseId: 2,
    exerciseName: "Barbell Bench Press",
    reps: 10,
    sets: 3,
    weight: 135,
    date: "2026-06-15",
  },
  {
    id: 102,
    memberId: "M1004",
    exerciseId: 1,
    exerciseName: "Barbell Squat",
    reps: 12,
    sets: 4,
    weight: 185,
    date: "2026-06-17",
  },
  {
    id: 103,
    memberId: "M1001",
    exerciseId: 11,
    exerciseName: "Dumbbell Goblet Squat",
    reps: 15,
    sets: 3,
    weight: 25,
    date: "2026-06-18",
  },
  {
    id: 104,
    memberId: "M1004",
    exerciseId: 6,
    exerciseName: "Barbell Bicep Curl",
    reps: 10,
    sets: 3,
    weight: 65,
    date: "2026-06-19",
  },
];

const equipment = [
  { id: 1, name: "Barbell" },
  { id: 2, name: "Dumbbells" },
  { id: 3, name: "Resistance Bands" },
  { id: 4, name: "Bodyweight / Bench" },
];

let members = [
  {
    memberId: "M1001",
    firstName: "Mom",
    lastName: "",
    status: "Active",
    joinDate: "2025-01-15",
  },
  {
    memberId: "M1002",
    firstName: "Brother",
    lastName: "",
    status: "Active",
    joinDate: "2026-05-10",
  },
  {
    memberId: "M1003",
    firstName: "Girlfriend",
    lastName: "",
    status: "Active",
    joinDate: "2026-02-14",
  },
  {
    memberId: "M1004",
    firstName: "Coach",
    lastName: "",
    status: "Active",
    joinDate: "2024-11-01",
  },
];

const exercises = [
  { id: 1, name: "Squat", muscle_group: "legs" },
  { id: 2, name: "Bench Press", muscle_group: "chest" },
  { id: 3, name: "deadLift", muscle_group: "back" },
  { id: 4, name: "Overhead Press", muscle_group: "shoulders" },
  { id: 5, name: "Bent Over Row", muscle_group: "back" },
  { id: 6, name: "Bicep Curl", muscle_group: "arms" },
  { id: 7, name: "Hip Thrust", muscle_group: "legs" },
  { id: 8, name: "Romanian deadLift", muscle_group: "legs" },
  { id: 9, name: "Shoulder Press", muscle_group: "shoulders" },
  { id: 10, name: "Incline Bench Press", muscle_group: "chest" },
  { id: 11, name: "Lateral Raise", muscle_group: "shoulders" },
  { id: 12, name: "Hammer Curl", muscle_group: "arms" },
  { id: 13, name: "Tricep Extension", muscle_group: "arms" },
  { id: 14, name: "Stretch", muscle_group: "shoulders" },
  { id: 15, name: "Face Pulls", muscle_group: "back" },
  { id: 16, name: "Chest Fly", muscle_group: "chest" },
  { id: 17, name: "Lateral Walk", muscle_group: "legs" },
  { id: 18, name: "Push-ups", muscle_group: "chest" },
  { id: 19, name: "Pull-ups", muscle_group: "back" },
  { id: 20, name: "Lunge", muscle_group: "legs" },
  { id: 21, name: "Dips", muscle_group: "arms" },
  { id: 22, name: "Plank", muscle_group: "core" },
  { id: 23, name: "Hanging Knee Raise", muscle_group: "core" },
  { id: 24, name: "Bulgarian Split Squat", muscle_group: "legs" },
];

// =========================================================================
// 2. MEMBER ROUTE ENDPOINTS
// =========================================================================

// GET - List all members
app.get("/api/members", (req, res) => {
  res.json(members);
});

// POST - Create a new member
app.post("/api/members", (req, res) => {
  const newMember = req.body;
  members.push(newMember);
  res.status(201).json(newMember);
});

// GET - Find a single member profile by ID string
app.get("/api/members/:id", (req, res) => {
  const targetId = req.params.id;
  const foundMember = members.find((m) => m.memberId === targetId);

  if (!foundMember) {
    return res.status(404).send("Member not found");
  }
  res.json(foundMember);
});

// GET - Get a specific member's complete training history log array
app.get("/api/members/:id/history", (req, res) => {
  const targetMemberId = req.params.id;
  const memberHistory = workouts.filter((w) => w.memberId === targetMemberId);
  res.json(memberHistory);
});

// PUT - Update a member profile and notes
app.put("/api/members/:id", (req, res) => {
  res.send(`member profile for id ${req.params.id} updated!`);
});

// GET - heatmap data + weekly stats
app.get("/api/members/:id/dashboard", (req, res) => {
  res.send(`Dashboard stats for member id ${req.params.id}`);
});

// GET - previous set weights + equipment for one exercise
app.get("/api/members/:id/prev-sets/:exerciseId", (req, res) => {
  res.send(
    `Previous sets for exercise id ${req.params.exerciseId} and member id ${req.params.id}`,
  );
});

// =========================================================================
// 3. EQUIPMENT & EXERCISE ROUTE ENDPOINTS
// =========================================================================

// GET - List all muscle group categories
app.get("/api/muscle-groups", (req, res) => {
  res.json(muscleGroups);
});

// GET - List all equipment (Un-nested!)
app.get("/api/equipment", (req, res) => {
  res.json(equipment);
});

// GET - Get a single specific piece of equipment by its numeric ID (Un-nested!)
app.get("/api/equipment/:id", (req, res) => {
  const equipmentId = parseInt(req.params.id);
  const foundEquipment = equipment.find((e) => e.id === equipmentId);

  if (!foundEquipment) {
    return res.status(404).send("Equipment not found");
  }
  res.json(foundEquipment);
});

// POST - Add a new piece of equipment
app.post("/api/equipment", (req, res) => {
  res.send("Equipment added!");
});

// GET - Full library - (filterable by muscle_group and equipment_id)
app.get("/api/exercises", (req, res) => {
  const muscleFilter = req.query.muscle_group;
  const equipmentFilter = req.query.equipment_id;
  let results = exercises;

  if (muscleFilter) {
    results = results.filter(
      (item) => item.muscle_group === muscleFilter.toLowerCase(),
    );
  }
  if (equipmentFilter) {
    results = results.filter(
      (item) => item.equipmentId === parseInt(equipmentFilter),
    );
  }
  res.json(results);
});

// GET - Get a single specific exercise by its numeric ID (Un-nested!)
app.get("/api/exercises/:id", (req, res) => {
  const exerciseId = parseInt(req.params.id);
  const foundExercise = exercises.find((e) => e.id === exerciseId);

  if (!foundExercise) {
    return res.status(404).send("Exercise not found");
  }
  res.json(foundExercise);
});

// POST - Add a new exercise to the library
app.post("/api/exercises", (req, res) => {
  res.send("Exercise added!");
});

// GET - Swap options for an exercise
app.get("/api/exercises/:id/alternatives", (req, res) => {
  res.send(`Exercise details for id ${req.params.id}`);
});

// =========================================================================
// 4. WORKOUT TRACKING ROUTE ENDPOINTS
// =========================================================================

// GET - List all workouts
app.get("/api/workouts", (req, res) => {
  res.json(workouts);
});

// GET - Full workout log sheet by its unique numeric ID
app.get("/api/workouts/:id", (req, res) => {
  const workoutId = parseInt(req.params.id);
  const foundWorkout = workouts.find((w) => w.id === workoutId);

  if (!foundWorkout) {
    return res.status(404).send("Workout log entry not found");
  }
  res.json(foundWorkout);
});

// POST - Log a completed workout session (Equipment Specified per Set/Session)
app.post("/api/workouts/:id/log", (req, res) => {
  const workoutId = parseInt(req.params.id);
  const { memberId, exerciseId, reps, sets, weight, equipmentType, bandColor } =
    req.body;

  // 1. Basic validation
  if (!memberId || !exerciseId || !reps || !sets || !equipmentType) {
    return res
      .status(400)
      .json({
        error:
          "Missing required fields (memberId, exerciseId, reps, sets, or equipmentType)",
      });
  }

  // 2. Verify Member Exists
  const memberExists = members.find((m) => m.memberId === memberId);
  if (!memberExists) {
    return res
      .status(404)
      .json({ error: `Member ID '${memberId}' does not exist.` });
  }

  // 3. Verify Exercise Exists
  const matchingExercise = exercises.find((e) => e.id === parseInt(exerciseId));
  if (!matchingExercise) {
    return res
      .status(404)
      .json({ error: `Exercise ID '${exerciseId}' not found in library.` });
  }

  let finalWeight = null;
  let finalBandDetails = null;

  // 4. Handle Equipment Logic Dynamic Parsing
  const typeLower = equipmentType.toLowerCase();

  if (typeLower.includes("band") || typeLower === "resistance bands") {
    // It's a band tracker! Set raw weight to null, process band intensities
    finalWeight = null;
    const inputColor = bandColor || "band_orange";
    if (inputColor === "band_orange") finalBandDetails = "Orange (light)";
    else if (inputColor === "band_red") finalBandDetails = "Red (medium)";
    else if (inputColor === "band_blue") finalBandDetails = "Blue (heavy)";
    else if (inputColor === "band_green")
      finalBandDetails = "Green (very heavy)";
    else finalBandDetails = inputColor;
  } else {
    // Barbells, Dumbbells, etc. enforce raw numeric weight
    if (weight === undefined || weight === null) {
      return res
        .status(400)
        .json({
          error: "Weight is required for weight-bearing equipment types.",
        });
    }
    finalWeight = parseInt(weight);
  }

  // 5. Create log entry mapping equipment type directly to this log session
  const newWorkoutLog = {
    id: workoutId,
    memberId,
    exerciseId: parseInt(exerciseId),
    exerciseName: matchingExercise.name,
    muscleGroup: matchingExercise.muscle_group,
    reps: parseInt(reps),
    sets: parseInt(sets),
    weight: finalWeight,
    equipmentUsed: equipmentType, // e.g., "Dumbbell", "Barbell"
    ...(finalBandDetails && { bandLevel: finalBandDetails }),
    date: new Date().toISOString().split("T")[0],
  };

  workouts.push(newWorkoutLog);
  res
    .status(201)
    .json({ message: "Workout logged successfully!", data: newWorkoutLog });
});

// =========================================================================
// 5. SERVER STARTUP
// =========================================================================
app.listen(port, () => {
  console.log(`Home Gym Tracker API listening on port ${port}`);
});
