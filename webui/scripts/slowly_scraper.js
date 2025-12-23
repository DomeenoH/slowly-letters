/**
 * Slowly Letter Auto-Scraper (v1.3.2)
 * 
 * 使用方法：
 * 1. 登录 https://web.slowly.app
 * 2. 进入笔友聊天，打开任意一封信，翻到最早一封
 * 3. F12 打开控制台，粘贴此脚本并回车运行
 * 4. 等待脚本自动翻页抓取，完成后内容会自动复制到剪贴板
 */

const CONFIG = {
    textSelector: ".pre-wrap.mb-3",
    nextButtonSelector: "a.no-underline.link.py-2.px-3.mx-1",
    imageSelector: "img.img-thumbnail",
    audioSelector: "a.btn.text-primary:has(.icon-download)",
    timeContainerSelector: "p:has(i.icon-pin)",
    waitDelay: 2500, // 翻页等待时间(ms)，网络慢可调大
    maxCount: 200    // 最多抓取信件数
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function startScraping() {
    console.log("%c🚀 Slowly Scraper v1.3.2 启动...", "color: #ff9800; font-weight: bold;");
    let collectedLetters = [];
    let seenContent = new Set();
    let pageCount = 0;

    while (pageCount < CONFIG.maxCount) {
        await sleep(1000);
        const contentEl = document.querySelector(CONFIG.textSelector);
        if (!contentEl) break;

        const bodyText = contentEl.innerText.trim();
        const contentFingerprint = bodyText.substring(0, 100);
        if (seenContent.has(contentFingerprint)) {
            console.log("%c🛑 检测到重复内容，任务结束。", "color: #f44336;");
            break;
        }
        seenContent.add(contentFingerprint);

        const timeEl = document.querySelector(CONFIG.timeContainerSelector);
        let dateLine = timeEl ? timeEl.innerText.split('\n')[0].trim() : "未知日期";

        let mediaInfo = "";
        document.querySelectorAll(CONFIG.imageSelector).forEach((img, idx) => mediaInfo += `\n   [图${idx + 1}] ${img.src}`);
        document.querySelectorAll(CONFIG.audioSelector).forEach((audio, idx) => mediaInfo += `\n   [音频${idx + 1}] ${audio.href}`);

        const fullText = `\n=== LETTER ${pageCount + 1} [${dateLine}] ===\n\n${bodyText}\n${mediaInfo ? "\n📸 媒体附件:" + mediaInfo + "\n" : ""}`;
        collectedLetters.push(fullText);
        console.log(`✅ 已抓取: ${dateLine}`);

        const nextBtn = document.querySelector(`${CONFIG.nextButtonSelector}:has(.icon-chevron-left)`);
        if (nextBtn) {
            nextBtn.click();
            pageCount++;
            await sleep(CONFIG.waitDelay);
        } else {
            console.log("%c🎉 已到最新一封，任务圆满结束！", "color: #4caf50;");
            break;
        }
    }

    const finalOutput = collectedLetters.join("\n" + "—".repeat(50) + "\n");
    console.log(`\n📦 抓取完成！共 ${collectedLetters.length} 封信件。`);

    try {
        await navigator.clipboard.writeText(finalOutput);
        console.log("📋 已复制到剪贴板！请粘贴到 .md 文件中保存。");
    } catch (e) {
        console.log("❌ 无法自动复制，请在控制台输入 copy(finalOutput) 手动复制");
    }
}

startScraping();
