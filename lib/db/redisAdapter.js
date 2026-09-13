const { createClient } = require('redis');
const { nanoid } = require('nanoid');

class RedisAdapter {
    constructor() {
        this.client = createClient({ url: process.env.REDIS_URL });
        this.client.connect().catch(console.error);
    }

    async _getUser(id) {
        const user = await this.client.hGetAll(`user:${id}`);
        return Object.keys(user).length === 0 ? null : user;
    }

    async getUserByUsername(username) {
        const id = await this.client.get(`username:${username}`);
        if (!id) return null;
        return await this._getUser(id);
    }

    async getUserById(id) {
        return await this._getUser(id);
    }

    async getUserByExtId(extId, authSource) {
        const id = await this.client.get(`ext_id:${authSource}:${extId}`);
        if (!id) return null;
        return await this._getUser(id);
    }

    async getRecentUsers(limit = 10) {
        // We use a Redis Sorted Set 'users_by_update' where score is timestamp
        const ids = await this.client.zRange('users_by_update', 0, limit - 1, { REV: true });
        const users = [];
        for (const id of ids) {
            const user = await this._getUser(id);
            if (user && user.plan && user.plan.trim() !== '') {
                users.push(user);
            }
        }
        return users;
    }

    async getUserCount() {
        return await this.client.get('user_count') || 0;
    }

    async createUser(userData) {
        const id = nanoid(10);
        const now = new Date().toISOString();
        
        await this.client.hSet(`user:${id}`, {
            id,
            ...userData,
            lastupdate: now
        });
        
        await this.client.set(`ext_id:${userData.authsource}:${userData.ext_id}`, id);
        await this.client.incr('user_count');
        
        return id;
    }

    async updateUsername(id, username) {
        const oldUser = await this._getUser(id);
        if (oldUser.username) {
            await this.client.del(`username:${oldUser.username}`);
        }
        
        const now = new Date().toISOString();
        await this.client.hSet(`user:${id}`, { username, lastupdate: now });
        await this.client.set(`username:${username}`, id);
        
        const user = await this._getUser(id);
        if (user.plan && user.plan.trim() !== '') {
            await this.client.zAdd('users_by_update', { score: Date.now(), value: id });
        }
    }

    async updateToken(id, token) {
        await this.client.hSet(`user:${id}`, { token });
    }

    async updateProfile(id, displayname, plan, project) {
        const now = new Date().toISOString();
        await this.client.hSet(`user:${id}`, { displayname, plan, project, lastupdate: now });
        if (plan && plan.trim() !== '') {
            await this.client.zAdd('users_by_update', { score: Date.now(), value: id });
        } else {
            await this.client.zRem('users_by_update', id);
        }
    }

    async getUserByToken(username, token) {
        const user = await this.getUserByUsername(username);
        if (user && user.token === token) return user;
        return null;
    }

    async updateProjectByToken(username, token, projectData) {
        const user = await this.getUserByToken(username, token);
        if (user) {
            const now = new Date().toISOString();
            await this.client.hSet(`user:${user.id}`, { project: projectData, lastupdate: now });
        }
    }

    async updatePlanByToken(username, token, planData) {
        const user = await this.getUserByToken(username, token);
        if (user) {
            const now = new Date().toISOString();
            await this.client.hSet(`user:${user.id}`, { plan: planData, lastupdate: now });
            if (planData && planData.trim() !== '') {
                await this.client.zAdd('users_by_update', { score: Date.now(), value: user.id });
            } else {
                await this.client.zRem('users_by_update', user.id);
            }
        }
    }
}

module.exports = new RedisAdapter();
