const express = require("express");
const app = express();
const port = 3000;
app.get("/api/members", (req, res) => {
  res.send("Hello members!");
});
app.get("/api/equipment", (req, res) => {
  res.send("Hello equipment!");
});
app.get("/api/exercises", (req, res) => {
  res.send("Hello exercises!");
});
app.get("/api/health", (req, res) => {
  res.send("Hello health!");
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// GET - List all members
app.get("/api/members", (req, res) => {
  res.send("All members!");
});
// POST - Create a new member
app.post("/api/members", (req, res) => {
  res.send("Member created!");
});
// GET - Get a member profile with injury notes
app.get("/api/members/:id", (req, res) => {
  res.send(`member profile for id ${req.params.id} with injury notes!`);
});
// PUT - Update a member profile and notes
app.put("/api/members/:id", (req, res) => {
  res.send(`member profile for id ${req.params.id} updated!`);
});
// GET - heatmap data + weekly stats
app.get("/api/members/:id/dashboard", (req, res) => {
  res.send(`Dashboard stats for member id ${req.params.id}`);
});

// GET - past sessions reverse chronological
app.get("/api/members/:id/history", (req, res) => {
  res.send(`Past sessions for member id ${req.params.id}`);
});

// GET - previous set weights + equipment for one exercise
app.get("/api/members/:id/prev-sets/:exerciseId", (req, res) => {
  res.send(`Previous sets for exercise id ${req.params.exerciseId} and member id ${req.params.id}`);
});
// GET - List all equipment
app.get("/api/equipment", (req, res) => {
  res.send("All equipment!");
});
// POST - Add a new piece of equipment
app.post("/api/equipment", (req, res) => {
  res.send("Equipment added!");
});
// GET - Full library - (filterable by muscle_group and equipment_id)
app.get("/api/exercises", (req, res) => {
  const muscleGroupFilter = req.query.muscle_group;
  const equipmentIdFilter = req.query.equipment_id;

  if (muscleGroupFilter || equipmentIdFilter) {
    res.send(`Full exercise library filtered by: Muscle Group [${muscleGroupFilter || 'None'}], Equipment ID [${equipmentIdFilter || 'None'}]`);
  } else {
    res.send("Full exercise library! (No filters applied)");
  }
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
// GET - Full workout with exercises and sets
app.get("/api/workouts/:id", (req, res) => {
    res.send(`Workout details for id ${req.params.id}`);
})
// POST - Log a completed workout - writes all set data
app.post("/api/workouts/:id/log", (req, res) => {    
    res.send(`Workout logged for id ${req.params.id}`);
})
//POST - Generate a new workout: member ID + target muscle groups
app.post("/api/workouts/generate", (req, res) => {
  res.send("Workout generated!");
});
// GET - Health check - returns 200 OK
app.get("/api/health", (req, res) => {
  res.send("Healthy!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
