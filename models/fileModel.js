const db = require('../config/db'); // Assuming you have a MySQL connection setup in 'db.js'

class FileModel {
    // Insert file into the database
    static async insertFile(fileData) {
        const { name, url, size, enclosure_id, user_id } = fileData;
        const query = `INSERT INTO files (name, url, size, enclosure_id, user_id) VALUES (?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            db.query(query, [name, url, size, enclosure_id, user_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: results.insertId }); // MySQL returns the inserted ID in `insertId`
                }
            });
        });
    }

    // Get file by its ID
    static async getFileById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM files WHERE id = ?`;
            db.query(query, [id], (err, results) => {
                if (err) {
                    console.error('Error fetching file by ID:', err.message);
                    reject(err);
                } else {
                    resolve(results[0]); // MySQL returns the result as an array, take the first element
                }
            });
        });
    }

    // Get files by enclosure_id
    static async getFileByEncId(id) {
        console.log("I'm going to fetch with enclosure_id ", id);
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM files WHERE enclosure_id = ?`;
            db.query(query, [id], (err, results) => {
                if (err) {
                    console.error('Error fetching files by enclosure ID:', err.message);
                    reject(err);
                } else {
                    resolve(results); // MySQL returns the result as an array
                }
            });
        });
    }

    // Delete file by ID
    static async deleteFileById(id) {
        const query = `DELETE FROM files WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results); // MySQL returns an object with affected rows
                }
            });
        });
    }
}

module.exports = FileModel;
