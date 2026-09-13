const admin = require('firebase-admin');

class FirebaseAdapter {
    constructor() {
        if (!admin.apps.length) {
            // Assumes GOOGLE_APPLICATION_CREDENTIALS is set in env
            // Or passing explicit cert path via process.env.FIREBASE_CERT_PATH
            const certPath = process.env.FIREBASE_CERT_PATH;
            
            if (certPath) {
                admin.initializeApp({
                    credential: admin.credential.cert(require(certPath))
                });
            } else {
                admin.initializeApp();
            }
        }
        this.db = admin.firestore();
        this.usersCollection = this.db.collection('users');
    }

    // Helper to format Firestore document to our expected object
    _formatDoc(doc) {
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    }

    async getUserByUsername(username) {
        const snapshot = await this.usersCollection.where('username', '==', username).limit(1).get();
        if (snapshot.empty) return null;
        return this._formatDoc(snapshot.docs[0]);
    }

    async getUserById(id) {
        const doc = await this.usersCollection.doc(id).get();
        return this._formatDoc(doc);
    }

    async getUserByExtId(extId, authSource) {
        const snapshot = await this.usersCollection
            .where('ext_id', '==', extId)
            .where('authsource', '==', authSource)
            .limit(1)
            .get();
        if (snapshot.empty) return null;
        return this._formatDoc(snapshot.docs[0]);
    }

    async getRecentUsers(limit = 10) {
        // Note: Firestore requires an index for this query (plan > '' and order by lastupdate)
        // For simplicity and NoSQL compatibility, we query where plan != null, ordered by lastupdate
        const snapshot = await this.usersCollection
            .where('plan', '!=', '')
            .orderBy('plan')
            .orderBy('lastupdate', 'desc')
            .limit(limit)
            .get();
            
        const users = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.plan && data.plan.trim() !== '') {
                users.push(this._formatDoc(doc));
            }
        });
        
        // Firestore where('!=') might not perfectly map to SQLite's 'plan IS NOT NULL AND plan <> ""' without client side sorting.
        // We do a final sort in memory to ensure desc order.
        return users.sort((a, b) => new Date(b.lastupdate) - new Date(a.lastupdate)).slice(0, limit);
    }

    async getUserCount() {
        // Firestore count() aggregation is available in newer admin SDKs
        const countQuery = this.usersCollection.count();
        const snapshot = await countQuery.get();
        return snapshot.data().count;
    }

    async createUser(userData) {
        const docRef = await this.usersCollection.add({
            ...userData,
            lastupdate: new Date().toISOString()
        });
        return docRef.id;
    }

    async updateUsername(id, username) {
        await this.usersCollection.doc(id).update({
            username: username,
            lastupdate: new Date().toISOString()
        });
    }

    async updateToken(id, token) {
        await this.usersCollection.doc(id).update({
            token: token
        });
    }

    async updateProfile(id, displayname, plan, project) {
        await this.usersCollection.doc(id).update({
            displayname: displayname,
            plan: plan,
            project: project,
            lastupdate: new Date().toISOString()
        });
    }

    async getUserByToken(username, token) {
        const snapshot = await this.usersCollection
            .where('username', '==', username)
            .where('token', '==', token)
            .limit(1)
            .get();
        if (snapshot.empty) return null;
        return this._formatDoc(snapshot.docs[0]);
    }

    async updateProjectByToken(username, token, projectData) {
        const user = await this.getUserByToken(username, token);
        if (user) {
            await this.usersCollection.doc(user.id).update({
                project: projectData,
                lastupdate: new Date().toISOString()
            });
        }
    }

    async updatePlanByToken(username, token, planData) {
        const user = await this.getUserByToken(username, token);
        if (user) {
            await this.usersCollection.doc(user.id).update({
                plan: planData,
                lastupdate: new Date().toISOString()
            });
        }
    }
}

module.exports = new FirebaseAdapter();
