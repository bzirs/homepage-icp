import * as fs from "node:fs";
import * as path from "node:path";
console.log('开始复制图片文件...');

// 源目录和目标目录
const imgSrcDir = './static/img';
const imgDestDir = './dist/static/img';

// 确保目标目录存在
if (!fs.existsSync(imgDestDir)) {
    fs.mkdirSync(imgDestDir, { recursive: true });
    console.log(`创建目标目录: ${imgDestDir}`);
}

// 获取源目录中的所有文件
try {
    const files = fs.readdirSync(imgSrcDir);
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico'].includes(ext);
    });

    console.log(`找到 ${imageFiles.length} 个图片文件待复制`);

    // 复制每个图片文件
    let successCount = 0;
    let failCount = 0;

    imageFiles.forEach(file => {
        const srcPath = path.join(imgSrcDir, file);
        const destPath = path.join(imgDestDir, file);

        try {
            console.log(`复制: ${file}`);
            fs.copyFileSync(srcPath, destPath);

            // 验证复制是否成功
            const srcStat = fs.statSync(srcPath);
            const destStat = fs.statSync(destPath);

            if (destStat.size === srcStat.size) {
                console.log(`✓ ${file} 复制成功 (${destStat.size} 字节)`);
                successCount++;
            } else {
                console.error(`❌ ${file} 大小不匹配! 源: ${srcStat.size} 目标: ${destStat.size}`);
                failCount++;
            }
        } catch (err) {
            console.error(`❌ 复制 ${file} 失败:`, err.message);
            failCount++;
        }
    });

    console.log(`\n复制完成: ${successCount} 成功, ${failCount} 失败`);

} catch (err) {
    console.error(`❌ 读取源目录出错:`, err);
}

console.log('\n操作完成!');