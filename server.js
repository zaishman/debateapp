const fs = require('fs');
const TOPICS_FILE = 'usedTopics.json';
let usedTopics = fs.existsSync(TOPICS_FILE) ? JSON.parse(fs.readFileSync(TOPICS_FILE)) : [] ;
//loading main used tools
const express = require('express'); //helps make server
const Anthropic = require('@anthropic-ai/sdk'); //sdk that talks directly to claude
require('dotenv').config(); //reads the env
console.log("API KEY LOADED:", process.env.ANTHROPIC_API_KEY);

const app = express();
app.use(express.json());
app.use(express.static('.'));
//tells it to understand json data + loads project

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
//client to communitcate with anthropic, hides API

//routes the frotend and backend, essentially answers the fetch(/chat)

/*const usedTopics = [];*/
//get fetches response, not awaits one and sends it over
app.get('/topic', async (req, res) => {
    let attempts = 0;
    while(attempts <3) {
    try {
        console.log("Attempt", attempts + 1, "starting...");
        const recentTopics = usedTopics.slice(-10);
        console.log("Recent topics:", recentTopics);

        const avoidList = recentTopics.length > 0 ? `Do NOT give any of these topics or anything similar: ${recentTopics.join(", ")}` : "";

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            temperature: 1,
            messages: [{
                role: 'user',
                content: `STRICT RULES: AVOID USING ANY USED TOPICS LISTED IN ${avoidList}. Provide me with just a random debate topic, make it simple, yet thought provoking and discussion worthy; while also making it reflect real world problems and ethics. It must NOT be about zoos, animals, or wildlife. ALWAYS MAKE IT UNDER 20 WORDS OR LESS. Avoid saying governments constantly, and only use it whenever truly nessecary, everything doesnt have to revovle around politics. Make sure that its completely different each time, so new different central themes and concepts, branchings technology, ethics, science, education or culture. Take sources from international debate clubs, and derive the debate themes and premise around that. So, educational, well-rounded, and debateable. Reply only with the topic, and NO explainations or punctuations at the end- refrain from emojis and symbols. Make sure every topic is different from the last. FOR THE SOURCES: sources should be 3-4 short factual points or statistics the debater can use in their argument- not just source names, but factual pieces of evidence, points or statistics the debater can use. ${avoidList} Request ID: ${Date.now()}
                Reply in this exact JSON format:
                {
                "topic": "debate topic here",
                "sources": ["source 1", "source 2", "source 3"]
                }`
            }]
        });
    
        const text = response.content[0].text;
        const cleaned = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleaned);

        usedTopics.push(data.topic);
        fs.writeFileSync(TOPICS_FILE, JSON.stringify(usedTopics));
        console.log("Saved Topics:", usedTopics);
        return res.json({ topic: data.topic, sources: data.sources });
        //prevents repetition of used topics

        //message that the frontend sends, and response with res.json
    } catch (error) {
        attempts ++;
        if(attempts === 3) {
            res.status(500).json({ error: error.message });
        }
    }
    await new Promise(r=> setTimeout(r, 1000));
     }
    }
);
    app.listen(3000, () => console.log('Running on http://localhost:3000'));

    //sends message user sends, and tells claude to accept the content