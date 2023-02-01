const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM routines
      WHERE id = $1; 
    `,
      [id]
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM routines;
      
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT * , users.username AS "creatorName", routines.id
      FROM routines 
      INNER JOIN users
      ON users.id = routines."creatorId"
      ;
    `);
    for (let item of rows) {
      const activities = await client.query(`
        SELECT * FROM 
        routine_activities where "activityId"= ${item.id} 
        `);
      item.activities = activities.rows;
    }

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT * , users.username AS "creatorName"
      FROM routines 
      INNER JOIN users
      ON users.id = routines."creatorId"
       WHERE "isPublic" = true
      ;
    `);
    for (let item of rows) {
      const activities = await client.query(`
      
      SELECT * FROM routine_activities
      INNER JOIN activities
      ON  routine_activities."activityId" = activities.id  
      where "activityId"= ${item.id}
        `);
      item.activities = activities.rows;
    }
    delete rows[0].password;

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT * , users.username AS "creatorName", routines.id
      FROM routines 
      INNER JOIN users
      ON users.id = routines."creatorId"
       WHERE users.username = $1
      ;
    `,
      [username]
    );
    for (let item of rows) {
      const activities = await client.query(`
      SELECT * FROM routine_activities
      INNER JOIN activities
      ON  routine_activities."activityId" = activities.id  
      where "activityId"= ${item.id}       
        `);
      item.activities = activities.rows;
    }

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
      SELECT * , users.username AS "creatorName", routines.id
      FROM routines 
      INNER JOIN users
      ON users.id = routines."creatorId"
       WHERE users.username = $1 and "isPublic" = true
      ;
    `,
      [username]
    );
    for (let item of rows) {
      const activities = await client.query(`
      SELECT * FROM routine_activities
      INNER JOIN activities
      ON  routine_activities."activityId" = activities.id  
      where "activityId"= ${item.id}    
      `);

      item.activities = activities.rows;
    }

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(
      `
      SELECT * , users.username AS "creatorName", routines.id
      FROM routines 
      INNER JOIN users
      ON users.id = routines."creatorId"
       WHERE "isPublic" = true
      ;
    `
    );
    for (let item of rows) {
      const activities = await client.query(`
      SELECT * FROM routine_activities
      INNER JOIN activities
      ON  routine_activities."activityId" = activities.id  
      where "activityId"= ${item.id}  
        `);
      item.activities = activities.rows;
    }
    return rows;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, isPublic, name, goal }) {
  let routineToUpdate = {};
  if (isPublic !== undefined) {
    routineToUpdate.isPublic = isPublic;
  }
  if (name) {
    routineToUpdate.name = name;
  }
  if (goal) {
    routineToUpdate.goal = goal;
  }

  const setString = Object.keys(routineToUpdate)
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
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(routineToUpdate)
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(
      `
      DELETE FROM routines
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

    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRoutine,
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  updateRoutine,
  destroyRoutine,
  updateRoutine,
};