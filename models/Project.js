const db = require("../config/db");

class Project {
  static create(projectData) {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO projects (title, description, budget, duration, user_id) VALUES (?, ?, ?, ?, ?)";
      db.query(
        sql,
        [
          projectData.title,
          projectData.description,
          projectData.budget,
          projectData.duration,
          projectData.user_id,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  static async findAll() {
    const query = "SELECT * FROM projects ORDER BY created_at DESC";
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          console.error("Error fetching all projects:", err);
          return reject(new Error("Error fetching projects"));
        }
        resolve(results);
      });
    });
  }

  static async findById(id) {
    const query = "SELECT * FROM projects WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, results) => {
        if (err) {
          console.error("Error fetching project by ID:", err);
          return reject(new Error("Error fetching project"));
        }
        console.log(`Project with ID ${id} fetched via findById:`, results[0]);
        resolve(results[0]);
      });
    });
  }

  static async getProjectById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM projects WHERE id = ?", [id], (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return reject(err);
        }
        console.log(`Project with ID ${id} fetched via getProjectById:`, results[0]);
        resolve(results.length > 0 ? results[0] : null);
      });
    });
  }

  static createApplication(applicationData) {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO project_applications (project_id, applicant_name, applicant_email, motivation, applicant_id) VALUES (?, ?, ?, ?, ?)";
      db.query(
        sql,
        [
          applicationData.project_id,
          applicationData.applicant_name,
          applicationData.applicant_email,
          applicationData.motivation,
          applicationData.applicant_id,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  }

  static getProjectRequests(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT pa.*, p.title AS project_title 
        FROM project_applications pa
        JOIN projects p ON pa.project_id = p.id
        WHERE p.user_id = ?
      `;
      db.query(sql, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static getRequestById(requestId) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM project_applications WHERE id = ?";
      db.query(sql, [requestId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

  static updateRequestStatus(requestId, status) {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE project_applications SET status = ? WHERE id = ?";
      db.query(sql, [status, requestId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static getApplicationByUserAndProject(applicant_id, project_id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM project_applications WHERE applicant_id = ? AND project_id = ?";
      db.query(sql, [applicant_id, project_id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }
}

module.exports = Project;