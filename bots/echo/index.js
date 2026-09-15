module.exports = {
    name: 'echo',
    handleRequest: async (context) => {
        // The echo bot demonstrates how to use the context object
        const { username, ip, config } = context;

        return {
            username: 'echo',
            displayname: 'Echo Bot',
            lastupdate: new Date().toISOString(),
            plan: `Hello! You fingered "${username}" from IP: ${ip}\r\nWelcome to ${config.baseFingerHost}!`
        };
    }
};
