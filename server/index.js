const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

// 1. Exercises Library Array
let muscleGroups = ["legs", "chest", "back", "arms", "core", "shoulders"];

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
    relationship: "Mom",
    membershipType: "Annual",
    status: "Active",
    joinDate: "2025-01-15",
  },
  {
    memberId: "M1002",
    firstName: "Brother",
    lastName: "",
    relationship: "Brother",
    membershipType: "Monthly",
    status: "Active",
    joinDate: "2026-05-10",
  },
  {
    memberId: "M1003",
    firstName: "Girlfriend",
    lastName: "",
    relationship: "Girlfriend",
    membershipType: "Annual",
    status: "Active",
    joinDate: "2026-02-14",
  },
  {
    memberId: "M1004",
    firstName: "Coach",
    lastName: "",
    relationship: "Coach",
    membershipType: "Premium",
    status: "Active",
    joinDate: "2024-11-01",
  },
];

// GET - Find a single member profile by ID string
app.get("/api/members/:id", (req, res) => {
  const targetId = req.params.id; // Grabs "M1001" out of the URL string
  const foundMember = members.find((m) => m.memberId === targetId);

  if (!foundMember) {
    return res.status(404).send("Member not found");
  }
  res.json(foundMember);
});

// GET - Get a specific member's complete training history log array
app.get("/api/members/:id/history", (req, res) => {
  const targetMemberId = req.params.id; // Grabs "M1004" from the URL path

  // .filter() loops through the logs and keeps EVERYTHING matching this member
  const memberHistory = workouts.filter((w) => w.memberId === targetMemberId);

  res.json(memberHistory);
});

// LET - workouts
const exercises = [
  // 🏋️ Barbell Exercises (Equipment ID: 1)
  { id: 1, name: "Barbell Squat", muscle_group: "legs", equipmentId: 1 },
  { id: 2, name: "Barbell Bench Press", muscle_group: "chest", equipmentId: 1 },
  { id: 3, name: "Barbell deadLift", muscle_group: "back", equipmentId: 1 },
  {
    id: 4,
    name: "Barbell Overhead Press",
    muscle_group: "shoulders",
    equipmentId: 1,
  },
  {
    id: 5,
    name: "Barbell Bent Over Row",
    muscle_group: "back",
    equipmentId: 1,
  },
  { id: 6, name: "Barbell Bicep Curl", muscle_group: "arms", equipmentId: 1 },
  { id: 7, name: "Barbell Hip Thrust", muscle_group: "legs", equipmentId: 1 },

  // 🏋️ Dumbbell Exercises (Equipment ID: 2)
  {
    id: 8,
    name: "Dumbbell Romanian deadLift",
    muscle_group: "legs",
    equipmentId: 2,
  },
  {
    id: 9,
    name: "Dumbbell Shoulder Press",
    muscle_group: "shoulders",
    equipmentId: 2,
  },
  {
    id: 10,
    name: "Dumbbell Incline Bench Press",
    muscle_group: "chest",
    equipmentId: 2,
  },
  {
    id: 11,
    name: "Dumbbell Goblet Squat",
    muscle_group: "legs",
    equipmentId: 2,
  },
  {
    id: 12,
    name: "Dumbbell Lateral Raise",
    muscle_group: "shoulders",
    equipmentId: 2,
  },
  {
    id: 13,
    name: "Dumbbell Hammer Curl",
    muscle_group: "arms",
    equipmentId: 2,
  },
  {
    id: 14,
    name: "Dumbbell Tricep Kickback",
    muscle_group: "arms",
    equipmentId: 2,
  },

  // 🎗️ Resistance Band Exercises (Equipment ID: 3)
  { id: 15, name: "Band stretch", muscle_group: "shoulders", equipmentId: 3 },
  { id: 16, name: "Band Bicep Curl", muscle_group: "arms", equipmentId: 3 },
  { id: 17, name: "Band Squat", muscle_group: "legs", equipmentId: 3 },
  { id: 18, name: "Band Face Pulls", muscle_group: "back", equipmentId: 3 },
  { id: 19, name: "Band Chest Fly", muscle_group: "chest", equipmentId: 3 },
  { id: 20, name: "Band Lateral Walk", muscle_group: "legs", equipmentId: 3 },
  {
    id: 21,
    name: "Band Tricep pushDown",
    muscle_group: "arms",
    equipmentId: 3,
  },

  // 🤸 Bodyweight / Bench Exercises (Equipment ID: 4)
  { id: 22, name: "Push-ups", muscle_group: "chest", equipmentId: 4 },
  { id: 23, name: "Pull-ups", muscle_group: "back", equipmentId: 4 },
  { id: 24, name: "Bodyweight Lunge", muscle_group: "legs", equipmentId: 4 },
  { id: 25, name: "Bench Dips", muscle_group: "arms", equipmentId: 4 },
  { id: 26, name: "Plank", muscle_group: "core", equipmentId: 4 },
  { id: 27, name: "Hanging Knee Raise", muscle_group: "core", equipmentId: 4 },
  {
    id: 28,
    name: "Bulgarian Split Squat",
    muscle_group: "legs",
    equipmentId: 4,
  },
];

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
// GET - Get a member profile with injury notes
app.get("/api/members/:id", (req, res) => {
  // 1. Get the ID from the URL and convert it to a number
  const memberId = req.params.id;
  // 2. Search our list to find the member with that matching ID
  const foundMember = members.find((member) => member.memberId === memberId);
  // 3. If no member matches, stop and send back an error message
  if (!foundMember) {
    return res.status(404).send("Member not found");
  }
  // 4. If found, send back that member's data
  res.json(foundMember);
});
// PUT - Update a member profile and notes
app.put("/api/members/:id", (req, res) => {
  res.send(`member profile for id ${req.params.id} updated!`);
});
// GET - heatmap data + weekly stats
app.get("/api/members/:id/dashboard", (req, res) => {
  res.send(`Dashboard stats for member id ${req.params.id}`);
});

// GET - Get a specific member's complete training history log
app.get("/api/members/:id/history", (req, res) => {
  const targetMemberId = req.params.id; // Grabs "M1001" or "M1004" as a string
  const memberHistory = workouts.filter((w) => w.memberId === targetMemberId);

  res.json(memberHistory);
});
// GET - previous set weights + equipment for one exercise
app.get("/api/members/:id/prev-sets/:exerciseId", (req, res) => {
  res.send(
    `Previous sets for exercise id ${req.params.exerciseId} and member id ${req.params.id}`,
  );
});
// GET - List all muscle group categories
app.get("/api/muscle-group", (req, res) => {
  res.json(muscleGroups);
});
// GET - List all equipment
app.get("/api/equipment", (req, res) => {
  res.json(equipment);
  // GET - Get a single specific piece of equipment by its numeric ID
  app.get("/api/equipment/:id", (req, res) => {
    const equipmentId = parseInt(req.params.id); // Convert the URL string "1" to number 1
    const foundEquipment = equipment.find((e) => e.id === equipmentId);

    if (!foundEquipment) {
      return res.status(404).send("Equipment not found");
    }
    res.json(foundEquipment);
  });
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

  // GET - Get a single specific exercise by its numeric ID
  app.get("/api/exercises/:id", (req, res) => {
    const exerciseId = parseInt(req.params.id); // Convert "1" from the URL to a number
    const foundExercise = exercises.find((e) => e.id === exerciseId);

    if (!foundExercise) {
      return res.status(404).send("Exercise not found");
    }
    res.json(foundExercise);
  });

  // 1. Matches your array's snake_case "muscle_group" key
  if (muscleFilter) {
    results = results.filter(
      (item) => item.muscle_group === muscleFilter.toLowerCase(),
    );
  }
  // 2. Filter by equipment ID
  if (equipmentFilter) {
    results = results.filter(
      (item) => item.equipmentId === parseInt(equipmentFilter),
    );
  }
  res.json(results);
});
// POST - Add a new exercise to the library
app.post("/api/exercises", (req, res) => {
  res.send("Exercise added!");
});
// GET - Swap options for an exercise
app.get("/api/exercises/:id/alternatives", (req, res) => {
  res.send(`Exercise details for id ${req.params.id}`);
});
// POST - Create a new workout for a member
app.post("/api/workouts", (req, res) => {
  res.send("Workout created!");
});
// GET - Full workout log sheet by its unique numeric ID
app.get("/api/workouts/:id", (req, res) => {
  const workoutId = parseInt(req.params.id); // Convert the URL string "101" to number 101
  const foundWorkout = workouts.find((w) => w.id === workoutId);

  if (!foundWorkout) {
    return res.status(404).send("Workout log entry not found");
  }
  res.json(foundWorkout);
});
// PUT - List workouts
app.get("/api/workouts", (req, res) => {
  res.json(workouts);
  res.send(`Workout updated for id ${req.params.id}`);
});
// POST - Log a completed workout - writes all set data
app.post("/api/workouts/:id/log", (req, res) => {
  res.send(`Workout logged for id ${req.params.id}`);
});
//POST - Generate a new workout: member ID + target muscle groups
app.post("/api/workouts/generate", (req, res) => {
  res.send("Workout generated!");
});
// GET - List all muscle group categories
app.get("/api/muscle-groups", (req, res) => {
  res.json(muscleGroups);
});
// GET - Health check - returns 200 OK
app.get("/api/health", (req, res) => {
  res.send("Healthy!");
});

app.listen(port, () => {
  console.log(`Home Gym Tracker API listening on port ${port}`);
});
