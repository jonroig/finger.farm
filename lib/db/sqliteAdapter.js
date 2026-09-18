const Database = require('better-sqlite3');
const path = require('path');

class SqliteAdapter {
    constructor() {
        const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, '../../db/fingerfarm.sqlite3');
        this.db = new Database(dbPath);
        
        // Auto-initialize the database schema if it doesn't exist
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id integer PRIMARY KEY,
                ext_id text NOT NULL,
                authsource text NOT NULL,
                username text,
                displayname text,
                plan text,
                project text,
                token text NOT NULL,
                lastupdate DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    async getUserByUsername(username) {
        const users = this.db.prepare('SELECT * FROM users WHERE username = ?').all(username);
        return users[0];
    }

    async getUserById(id) {
        const users = this.db.prepare('SELECT * FROM users WHERE id = ?').all(id);
        return users[0];
    }

    async getUserByExtId(extId, authSource) {
        const users = this.db.prepare('SELECT * FROM users WHERE ext_id = ? AND authsource = ?').all(extId, authSource);
        return users[0];
    }

    async getRecentUsers(limit = 10) {
        return this.db.prepare(`
            SELECT username, lastupdate 
            FROM users WHERE plan <> '' 
            AND plan IS NOT NULL 
            ORDER BY lastupdate DESC 
            LIMIT ?`).all(limit);
    }

    async getUserCount() {
        const data = this.db.prepare('SELECT COUNT(id) AS count FROM users').get();
        return data.count;
    }

    async createUser(userData) {
        const result = this.db.prepare(`
            INSERT INTO users 
            (displayname, ext_id, token, authsource) 
            VALUES (?, ?, ?, ?)
        `).run(userData.displayname, userData.ext_id, userData.token, userData.authsource);
        return result.lastInsertRowid;
    }

    async updateUsername(id, username) {
        this.db.prepare(`UPDATE users SET username = ?, lastupdate=datetime('now') WHERE id = ?`).run(username, id);
    }

    async updateToken(id, token) {
        this.db.prepare(`UPDATE users SET token = ? WHERE id = ?`).run(token, id);
    }

    async updateProfile(id, displayname, plan, project) {
        this.db.prepare(`
            UPDATE users 
            SET displayname = ?, plan = ?, project = ?, lastupdate=datetime('now')
            WHERE id = ?
        `).run(displayname, plan, project, id);
    }

    async getUserByToken(username, token) {
        const users = this.db.prepare('SELECT * FROM users WHERE username = ? AND token = ?').all(username, token);
        return users[0];
    }

    async updateProjectByToken(username, token, projectData) {
        this.db.prepare(`UPDATE users SET project = ?, lastupdate=datetime('now') WHERE username = ? AND token = ?`).run(projectData, username, token);
    }

    async updatePlanByToken(username, token, planData) {
        this.db.prepare(`UPDATE users SET plan = ?, lastupdate=datetime('now') WHERE username = ? AND token = ?`).run(planData, username, token);
    }
}

module.exports = new SqliteAdapter();
