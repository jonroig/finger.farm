const { Pool } = require('pg');

class PostgresAdapter {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.POSTGRES_URL,
        });
    }

    async getUserByUsername(username) {
        const result = await this.pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    }

    async getUserById(id) {
        const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    async getUserByExtId(extId, authSource) {
        const result = await this.pool.query('SELECT * FROM users WHERE ext_id = $1 AND authsource = $2', [extId, authSource]);
        return result.rows[0];
    }

    async getRecentUsers(limit = 10) {
        const result = await this.pool.query(`
            SELECT username, displayname, lastupdate 
            FROM users WHERE plan <> '' 
            AND plan IS NOT NULL 
            ORDER BY lastupdate DESC 
            LIMIT $1`, [limit]);
        return result.rows;
    }

    async getUserCount() {
        const result = await this.pool.query('SELECT COUNT(id) AS count FROM users');
        return parseInt(result.rows[0].count, 10);
    }

    async createUser(userData) {
        const result = await this.pool.query(`
            INSERT INTO users 
            (displayname, ext_id, token, authsource) 
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, [userData.displayname, userData.ext_id, userData.token, userData.authsource]);
        return result.rows[0].id;
    }

    async updateUsername(id, username) {
        await this.pool.query(`UPDATE users SET username = $1, lastupdate = NOW() WHERE id = $2`, [username, id]);
    }

    async updateToken(id, token) {
        await this.pool.query(`UPDATE users SET token = $1 WHERE id = $2`, [token, id]);
    }

    async updateProfile(id, displayname, plan, project) {
        await this.pool.query(`
            UPDATE users 
            SET displayname = $1, plan = $2, project = $3, lastupdate = NOW()
            WHERE id = $4
        `, [displayname, plan, project, id]);
    }

    async getUserByToken(username, token) {
        const result = await this.pool.query('SELECT * FROM users WHERE username = $1 AND token = $2', [username, token]);
        return result.rows[0];
    }

    async updateProjectByToken(username, token, projectData) {
        await this.pool.query(`UPDATE users SET project = $1, lastupdate = NOW() WHERE username = $2 AND token = $3`, [projectData, username, token]);
    }

    async updatePlanByToken(username, token, planData) {
        await this.pool.query(`UPDATE users SET plan = $1, lastupdate = NOW() WHERE username = $2 AND token = $3`, [planData, username, token]);
    }
}

module.exports = new PostgresAdapter();
