import * as fs from "node:fs";
import * as path from "node:path";

console.log('检查当前工作目录和图片文件...');

// 显示当前工作目录
const cwd = process.cwd();
console.log(`当前工作目录: ${cwd}`);

// 检查图片目录
const imgDir = './static/img';
const absoluteImgDir = path.resolve(cwd, imgDir);
console.log(`图片目录的绝对路径: ${absoluteImgDir}`);

// 检查目录是否存在
if (!fs.existsSync(imgDir)) {
    console.error(`❌ 图片目录不存在: ${imgDir}`);
} else {
    console.log(`✓ 图片目录存在: ${imgDir}`);

    // 列出目录内容
    try {
        const items = fs.readdirSync(imgDir);
        console.log(`\n目录 ${imgDir} 中的内容 (${items.length} 项):`);

        items.forEach((item, index) => {
            const itemPath = path.join(imgDir, item);
            const stat = fs.statSync(itemPath);

            console.log(`${index + 1}. ${item} - ${stat.isDirectory() ? '目录' : '文件'} (${stat.size} 字节)`);
        });

        // 检查是否有图片文件
        const imageFiles = items.filter(item => {
            const ext = path.extname(item).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext);
        });

        if (imageFiles.length > 0) {
            console.log(`\n找到 ${imageFiles.length} 个图片文件:`);
            imageFiles.forEach(img => console.log(`- ${img}`));
        } else {
            console.log(`\n❌ 图片目录中没有找到图片文件!`);

            // 检查是否有子目录
            const subdirs = items.filter(item => fs.statSync(path.join(imgDir, item)).isDirectory());

            if (subdirs.length > 0) {
                console.log(`\n图片目录中有 ${subdirs.length} 个子目录，检查子目录内容:`);

                subdirs.forEach(subdir => {
                    const subdirPath = path.join(imgDir, subdir);
                    try {
                        const subitems = fs.readdirSync(subdirPath);
                        console.log(`\n子目录 ${subdir} 中的内容 (${subitems.length} 项):`);

                        const subimages = subitems.filter(item => {
                            const ext = path.extname(item).toLowerCase();
                            return ['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext);
                        });

                        if (subimages.length > 0) {
                            console.log(`找到 ${subimages.length} 个图片文件:`);
                            subimages.forEach(img => console.log(`- ${subdir}/${img}`));
                        } else {
                            console.log(`没有找到图片文件`);
                        }
                    } catch (err) {
                        console.error(`读取子目录 ${subdir} 出错:`, err);
                    }
                });
            }
        }
    } catch (err) {
        console.error(`❌ 读取目录内容出错:`, err);
    }
}

console.log('\n检查完成!');