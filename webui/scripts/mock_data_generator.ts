import fs from 'fs';
import path from 'path';

const OUTPUT_FILE = path.resolve(process.cwd(), 'public/data/letters.json');
const PUBLIC_IMG_BASE = path.resolve(process.cwd(), 'public/images/letters');

const mockLetters = [
    {
        id: "Mock-1",
        penPal: "MockUser",
        date: "2025年01月01日 12:00",
        timestamp: 1735704000000,
        direction: "in",
        content: "This is a mock letter. \n\nIf you see this, it means you are running the project in Open Source mode without the private data.\n\nEnjoy the demo!",
        translatedContent: "这是一封模拟信件。\n\n如果你看到这个，说明通过开源模式运行该项目，没有私有数据。\n\n享受演示！",
        attachments: [],
        wordCount: 30
    },
    {
        id: "Mock-2",
        penPal: "MockUser",
        date: "2025年01月02日 12:00",
        timestamp: 1735790400000,
        direction: "out",
        content: "Hello! This is a reply in the mock data set.",
        translatedContent: "你好！这是模拟数据集中的回复。",
        attachments: [],
        wordCount: 10
    }
];

const run = () => {
    // 1. Create Data Directory
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 2. Check if real data exists
    if (fs.existsSync(OUTPUT_FILE)) {
        console.log("ℹ️  Real data found at public/data/letters.json. Skipping mock generation.");
        return;
    }

    // 3. Generate Mock Data
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mockLetters, null, 2));
    console.log("✅ Generated mock data at public/data/letters.json");

    // 4. Create Mock Image Directory (Optional)
    if (!fs.existsSync(PUBLIC_IMG_BASE)) {
        fs.mkdirSync(PUBLIC_IMG_BASE, { recursive: true });
        // Could copy a placeholder image here if we had one
        console.log("✅ Created public/images/letters directory");
    }
};

run();
