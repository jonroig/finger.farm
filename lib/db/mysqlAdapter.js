const mysql = require('mysql2/promise');

class MysqlAdapter {
    constructor() {
        this.pool = mysql.createPool(process.env.MYSQL_URL);
    }

    async getUserByUsername(username) {
        const [rows] = await this.pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    async getUserById(id) {
        const [rows] = await this.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    async getUserByExtId(extId, authSource) {
        const [rows] = await this.pool.execute('SELECT * FROM users WHERE ext_id = ? AND authsource = ?', [extId, authSource]);
        return rows[0];
    }

    async getRecentUsers(limit = 10) {
        const [rows] = await this.pool.execute(`
            SELECT username, lastupdate 
            FROM users WHERE plan <> '' 
            AND plan IS NOT NULL 
            ORDER BY lastupdate DESC 
            LIMIT ?`, [limit]);
        return rows;
    }

    async getUserCount() {
        const [rows] = await this.pool.execute('SELECT COUNT(id) AS count FROM users');
        return parseInt(rows[0].count, 10);
    }

    async createUser(userData) {
        const [result] = await this.pool.execute(`
            INSERT INTO users 
            (displayname, ext_id, token, authsource) 
            VALUES (?, ?, ?, ?)
        `, [userData.displayname, userData.ext_id, userData.token, userData.authsource]);
        return result.insertId;
    }

    async updateUsername(id, username) {
        await this.pool.execute(`UPDATE users SET username = ?, lastupdate = NOW() WHERE id = ?`, [username, id]);
    }

    async updateToken(id, token) {
        await this.pool.execute(`UPDATE users SET token = ? WHERE id = ?`, [token, id]);
    }

    async updateProfile(id, displayname, plan, project) {
        await this.pool.execute(`
            UPDATE users 
            SET displayname = ?, plan = ?, project = ?, lastupdate = NOW()
            WHERE id = ?
        `, [displayname, plan, project, id]);
    }

    async getUserByToken(username, token) {
        const [rows] = await this.pool.execute('SELECT * FROM users WHERE username = ? AND token = ?', [username, token]);
        return rows[0];
    }

    async updateProjectByToken(username, token, projectData) {
        await this.pool.execute(`UPDATE users SET project = ?, lastupdate = NOW() WHERE username = ? AND token = ?`, [projectData, username, token]);
    }

    async updatePlanByToken(username, token, planData) {
        await this.pool.execute(`UPDATE users SET plan = ?, lastupdate = NOW() WHERE username = ? AND token = ?`, [planData, username, token]);
    }
}

module.exports = new MysqlAdapter();
