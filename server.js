const express = require("express");
const bodyParser = require("body-parser");
const { AzureOpenAI } = require("openai");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Allow cross-origin requests from the frontend

// Replace with your actual endpoint and API key from Azure
const endpoint = "https://visionbox.openai.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01";
const apiKey = "acb80c3b569b4702a96a7935bbdb1b7a";

app.post("/generate-image", async (req, res) => {
    
    const prompt = req.body.prompt;

    if (!prompt) {
        return res.status(400).send("Prompt is required");
    }

    try {
        const client = new AzureOpenAI({
            endpoint,
            apiKey,
            deployment: "dall-e-3", 
            apiVersion: "2024-04-01-preview"
        });
        
        const results = await client.images.generate({
            prompt,
            model: "",
            n: 1,
            size: "1024x1024"
        });

        const imageUrl = results.data[0].url;
        res.json({ imageUrl });
    } catch (error) {
        console.error("Error generating image:", JSON.stringify(error, null, 2));
        res.status(500).json({
            message: "Error generating image",
            error: error.message,
        });
    }
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
