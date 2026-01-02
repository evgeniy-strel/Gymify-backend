import 'dotenv/config'; // автоматически подгружает .env
import express from "express";
import cors from "cors";


import weeksRoutes from "./weeks/weeks.routes.js";
import programsRoutes from "./programs/programs.routes.js";
import exercisesRoutes from "./exercises/exercises.routes.js";
import daysRoutes from "./days/days.routes.js";
import setsRoutes from "./sets/sets.routes.js";
import timersRoutes from "./timers/timers.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/weeks", weeksRoutes);
app.use("/programs", programsRoutes);
app.use("/days", daysRoutes);
app.use("/exercises", exercisesRoutes);
app.use("/sets", setsRoutes);
app.use("/timers", timersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
