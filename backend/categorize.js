const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const API_KEY = 'AIzaSyByaN_8WxREKKumn_vnh2PEfO6tn97q0MM'
const genAI = new GoogleGenerativeAI(API_KEY);

async function analyzeWaste(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString("base64");
        const prompt = `Detect whether an image is trash or not. 
                        If it is trash, categorize it as follows:
                        - Red: Hazardous Waste
                        - Yellow: Organic Waste
                        - Green: Recyclable Waste`;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([
            { text: prompt },  // Text prompt
            { inline_data: { mime_type: "image/png", data: base64Image } } // Image data
        ]);
        const responseText = await result.response.text();
        if (responseText.toLowerCase().includes("hazardous")) return "Red - Hazardous Waste";
        if (responseText.toLowerCase().includes("organic")) return "Yellow - Organic Waste";
        if (responseText.toLowerCase().includes("recyclable")) return "Green - Recyclable Waste";
        return "Not identified as trash";
    } catch (error) {
        console.error("Error analyzing image:", error);
        return "Failed to analyze image";
    }
}
const imagePath = "image.png";  // Replace with your image file
analyzeWaste(imagePath).then((result) => console.log("Waste Category:", result));
