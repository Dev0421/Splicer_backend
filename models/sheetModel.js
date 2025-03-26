const db = require('../config/db'); // Assuming you have a MySQL connection setup in 'db.js'

const Sheet = {
  create: (project_id, sheet_name, file_url, notes, created_at, updated_at, callback) => {
    const query = `
      INSERT INTO sheets (project_id, sheet_name, file_url, notes, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [project_id, sheet_name, file_url, notes, created_at, updated_at], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      // Return the ID of the new sheet
      callback(null, results.insertId);
    });
  },

  getAll: (callback) => {
    const query = 'SELECT * FROM sheets';
    db.query(query, [], (err, rows) => {
      callback(err, rows);
    });
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM sheets WHERE id = ?';
    db.query(query, [id], (err, rows) => {
      callback(err, rows[0]);  // MySQL returns an array, we need the first row
    });
  },

  update: (id, project_id, sheet_name, file_url, notes, updated_at, callback) => {
    const query = `
      UPDATE sheets 
      SET project_id = ?, sheet_name = ?, file_url = ?, notes = ?, updated_at = ? 
      WHERE id = ?
    `;
    db.query(query, [project_id, sheet_name, file_url, notes, updated_at, id], (err, results) => {
      callback(err);
    });
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM sheets WHERE id = ?';
    db.query(query, [id], (err, results) => {
      callback(err);
    });
  },
};

module.exports = Sheet;
