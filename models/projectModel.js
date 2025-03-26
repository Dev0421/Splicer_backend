const db = require('../config/db'); // Assuming you have a MySQL connection setup in 'db.js'

class Project {
  static async create(data, callback) {
    const { 
      title, 
      company, 
      file_src, 
      date, 
      tech, 
      location_id, 
      enclosure_id, 
      enclosure_type, 
      road_name, 
      lat_long, 
      notes 
    } = data;

    if (!file_src || !title || !company) {
      return callback(new Error("Required fields are missing: file_src, title, or company"), null);
    }

    try {
      const query = `
        INSERT INTO projects (title, company, file_src, date, tech, location_id, enclosure_id, enclosure_type, road_name, lat_long, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [results] = await db.promise().query(query, [title, company, file_src, date, tech, location_id, enclosure_id, enclosure_type, road_name, lat_long, notes]);
      const [rows] = await db.promise().query('SELECT * FROM projects WHERE id = ?', [results.insertId]);
      callback(null, rows[0]);
    } catch (err) {
      callback(err, null);
    }
  }

  static async getAll(callback) {
    try {
      const [rows] = await db.promise().query('SELECT * FROM projects');
      callback(null, rows);
    } catch (err) {
      callback(err, null);
    }
  }

  static async getById(id, callback) {
    try {
      const [rows] = await db.promise().query('SELECT * FROM projects WHERE id = ?', [id]);
      callback(null, rows[0]);
    } catch (err) {
      callback(err, null);
    }
  }

  static async update(id, data, callback) {
    const { 
      title, 
      company, 
      file_src, 
      date, 
      tech, 
      location_id, 
      enclosure_id, 
      enclosure_type, 
      road_name, 
      lat_long, 
      notes 
    } = data;

    try {
      const query = `
        UPDATE projects SET 
          title = ?, company = ?, file_src = ?, date = ?, tech = ?, 
          location_id = ?, enclosure_id = ?, enclosure_type = ?, 
          road_name = ?, lat_long = ?, notes = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      await db.promise().query(query, [title, company, file_src, date, tech, location_id, enclosure_id, enclosure_type, road_name, lat_long, notes, id]);
      callback(null, { id, ...data });
    } catch (err) {
      callback(err, null);
    }
  }

  static async delete(id, callback) {
    try {
      await db.promise().query('DELETE FROM projects WHERE id = ?', [id]);
      callback(null, { message: "Project deleted successfully", id });
    } catch (err) {
      callback(err, null);
    }
  }

  static async search(query, callback) {
    const searchQuery = `%${query}%`;

    try {
      const searchSQL = `
        SELECT * FROM projects 
        WHERE company LIKE ? OR title LIKE ? OR tech LIKE ? OR road_name LIKE ?
      `;
      const [rows] = await db.promise().query(searchSQL, [searchQuery, searchQuery, searchQuery, searchQuery]);
      callback(null, rows);
    } catch (err) {
      callback(err, null);
    }
  }
}

module.exports = Project;
