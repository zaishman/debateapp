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

const usedTopics = [];
//get fetches response, not awaits one and sends it over
app.get('/topic', async (req, res) => {
    try {
        const avoidList = usedTopics.length > 0 ? `Do NOT give any of these topics or anything similar: ${usedTopics.join(", ")}` : "";

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            temperature: 1,
            messages: [{
                role: 'user',
                content: 'Provide me with just a random debate topic, make it simple, yet thought provoking and discussion worthy; while also making it reflect real world problems and ethics. Avoid saying governments constantly, and only use it whenever truly nessecary, everything doesnt have to revovle around politics. Make sure that its completely different each time, so new different central themes and concepts, branchings technology, ethics, science, education or culture. Take sources from international debate clubs, and derive the debate themes and premise around that. So, educational, well-rounded, and debateable. Reply only with the topic, and NO explainations or punctuations at the end- refrain from emojis and symbols. Make sure every topic is different from the last. Request ID: ${Date.now()}'
            }]
        });
        const topic = response.content[0].text;
        usedTopics.push(topic);
        res.json({topic});
        //prevents repetition of used topics

        //message that the frontend sends, and response with res.json
    } catch (error) {
        console.log("FULL ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});
    app.listen(3000, () => console.log('Running on http://localhost:3000'));

    //sends message user sends, and tells claude to accept the content