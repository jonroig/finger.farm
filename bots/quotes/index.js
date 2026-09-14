const quotes = [
    "I'd rather be a finger than a thumb. - Anonymous",
    "Fingers were made before forks. - Jonathan Swift",
    "May the hair on your toes never fall out! - J.R.R. Tolkien",
    "To fing, or not to fing, that is the question. - Shakespeare",
    "I have ten fingers, but I only need one to push to production. - A Brave Developer",
    "Why do they call them fingers? I've never seen them fing. Oh, wait, there they go. - Otto, The Simpsons",
    "The pinky finger's sole purpose in life is to find the corner of the coffee table in the dark. - Anonymous",
    "Fingers: The original 10-key calculator. - Anonymous",
    "Thumbs are just fingers that decided to go their own way. - Anonymous",
    "Give a man a finger, and he'll point it at you. - Anonymous",
    "A bird in the hand is worth two in the bush, but it makes typing really difficult. - Anonymous",
    "The middle finger is the universal sign for 'I strongly disagree with your driving'. - Anonymous",
    "My fingers are basically just fleshy styluses for my smartphone. - Anonymous",
    "Fingers are like teeth for your hands. Wait, no they aren't. - Anonymous",
    "If our fingers had knees, typing would look absolutely hilarious. - Anonymous",
    "Without fingers, how would we confidently verify that a plate is 'very hot' after the waiter warned us? - Anonymous",
    "If you cross your fingers, you're just tying your hands in a tiny knot. - Anonymous",
    "I put a ring on my finger so it would stop acting single. - Anonymous",
    "Your index finger is just a thumb that went to a liberal arts college. - Anonymous",
    "If you point one finger, there are three fingers pointing back at you. That's just terrible ergonomics. - Anonymous",
    "The pinky promise is the most legally binding contract known to humanity. - Anonymous",
    "Fingers are the only reason gloves aren't just socks for your hands. - Anonymous",
    "A paper cut is just a tree seeking revenge on your fingers. - Anonymous",
    "Keyboard mashing is just finger cardio. - Anonymous",
    "I tried to count my fingers once, but I lost track. It's hard when you're using the thing you're counting to do the counting. - Anonymous"
];

module.exports = {
    name: 'quotes',
    handleRequest: async (context) => {
        // We can access context variables if we want:
        // const { ip, config, db } = context;
        
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        return {
            username: 'quotes',
            displayname: 'Random Quote Bot',
            lastupdate: new Date().toISOString(),
            project: 'Spreading wisdom, one finger at a time.',
            plan: randomQuote
        };
    }
};
