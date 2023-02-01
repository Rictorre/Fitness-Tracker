const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [addActroutine],
    } = await client.query(
      `
      INSERT INTO routine_activities("routineId", "activityId",duration,count) 
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `,
      [routineId, activityId, duration, count]
    );
    return addActroutine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM routine_activities
      WHERE id = $1;
    `,
      [id]
    );

    await client.query(
      `
      DELETE FROM routine_activities
      WHERE id = $1; 
    `,
      [id]
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM routine_activities
      WHERE id = $1; 
    `,
      [id]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM routine_activities
      WHERE id = $1; 
    `,
      [id]
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
}
async function updateRoutineActivity({ id, count, duration }) {
  let routineActToUpdate = {};

  if (count) {
    routineActToUpdate.count = count;
  }
  if (duration) {
    routineActToUpdate.duration = duration;
  }

  const setString = Object.keys(routineActToUpdate)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      UPDATE routine_activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(routineActToUpdate)
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addActivityToRoutine,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  getRoutineActivityById,
};