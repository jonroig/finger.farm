const { createClient } = require('@supabase/supabase-js');

class SupabaseAdapter {
    constructor() {
        this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    }

    async getUserByUsername(username) {
        const { data, error } = await this.supabase.from('users').select('*').eq('username', username).limit(1).single();
        if (error && error.code !== 'PGRST116') console.error(error); // PGRST116 is no rows returned
        return data || null;
    }

    async getUserById(id) {
        const { data, error } = await this.supabase.from('users').select('*').eq('id', id).single();
        if (error && error.code !== 'PGRST116') console.error(error);
        return data || null;
    }

    async getUserByExtId(extId, authSource) {
        const { data, error } = await this.supabase.from('users').select('*').eq('ext_id', extId).eq('authsource', authSource).limit(1).single();
        if (error && error.code !== 'PGRST116') console.error(error);
        return data || null;
    }

    async getRecentUsers(limit = 10) {
        const { data, error } = await this.supabase.from('users')
            .select('username, lastupdate')
            .neq('plan', '')
            .not('plan', 'is', null)
            .order('lastupdate', { ascending: false })
            .limit(limit);
        if (error) console.error(error);
        return data || [];
    }

    async getUserCount() {
        const { count, error } = await this.supabase.from('users').select('*', { count: 'exact', head: true });
        if (error) console.error(error);
        return count || 0;
    }

    async createUser(userData) {
        const { data, error } = await this.supabase.from('users').insert([{
            ...userData,
            lastupdate: new Date().toISOString()
        }]).select();
        if (error) console.error(error);
        return data[0].id;
    }

    async updateUsername(id, username) {
        await this.supabase.from('users').update({ username, lastupdate: new Date().toISOString() }).eq('id', id);
    }

    async updateToken(id, token) {
        await this.supabase.from('users').update({ token }).eq('id', id);
    }

    async updateProfile(id, displayname, plan, project) {
        await this.supabase.from('users').update({ displayname, plan, project, lastupdate: new Date().toISOString() }).eq('id', id);
    }

    async getUserByToken(username, token) {
        const { data, error } = await this.supabase.from('users').select('*').eq('username', username).eq('token', token).limit(1).single();
        if (error && error.code !== 'PGRST116') console.error(error);
        return data || null;
    }

    async updateProjectByToken(username, token, projectData) {
        await this.supabase.from('users').update({ project: projectData, lastupdate: new Date().toISOString() }).eq('username', username).eq('token', token);
    }

    async updatePlanByToken(username, token, planData) {
        await this.supabase.from('users').update({ plan: planData, lastupdate: new Date().toISOString() }).eq('username', username).eq('token', token);
    }
}

module.exports = new SupabaseAdapter();
