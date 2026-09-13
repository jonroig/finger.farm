const { MongoClient, ObjectId } = require('mongodb');

class MongoAdapter {
    constructor() {
        this.client = new MongoClient(process.env.MONGO_URL);
        this.client.connect().then(() => {
            this.db = this.client.db();
            this.users = this.db.collection('users');
        }).catch(console.error);
    }

    _formatDoc(doc) {
        if (!doc) return null;
        const formatted = { ...doc, id: doc._id.toString() };
        delete formatted._id;
        return formatted;
    }

    async getUserByUsername(username) {
        const doc = await this.users.findOne({ username });
        return this._formatDoc(doc);
    }

    async getUserById(id) {
        const doc = await this.users.findOne({ _id: new ObjectId(id) });
        return this._formatDoc(doc);
    }

    async getUserByExtId(extId, authSource) {
        const doc = await this.users.findOne({ ext_id: extId, authsource: authSource });
        return this._formatDoc(doc);
    }

    async getRecentUsers(limit = 10) {
        const docs = await this.users.find({ plan: { $exists: true, $ne: '', $ne: null } })
            .sort({ lastupdate: -1 })
            .limit(limit)
            .toArray();
        return docs.map(doc => this._formatDoc(doc));
    }

    async getUserCount() {
        return await this.users.countDocuments();
    }

    async createUser(userData) {
        const result = await this.users.insertOne({
            ...userData,
            lastupdate: new Date().toISOString()
        });
        return result.insertedId.toString();
    }

    async updateUsername(id, username) {
        await this.users.updateOne({ _id: new ObjectId(id) }, { $set: { username, lastupdate: new Date().toISOString() } });
    }

    async updateToken(id, token) {
        await this.users.updateOne({ _id: new ObjectId(id) }, { $set: { token } });
    }

    async updateProfile(id, displayname, plan, project) {
        await this.users.updateOne({ _id: new ObjectId(id) }, { $set: { displayname, plan, project, lastupdate: new Date().toISOString() } });
    }

    async getUserByToken(username, token) {
        const doc = await this.users.findOne({ username, token });
        return this._formatDoc(doc);
    }

    async updateProjectByToken(username, token, projectData) {
        await this.users.updateOne({ username, token }, { $set: { project: projectData, lastupdate: new Date().toISOString() } });
    }

    async updatePlanByToken(username, token, planData) {
        await this.users.updateOne({ username, token }, { $set: { plan: planData, lastupdate: new Date().toISOString() } });
    }
}

module.exports = new MongoAdapter();
