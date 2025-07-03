// 需要检查的目录
import * as fs from "node:fs";
import * as path from "node:path";

const directories = [
    './static',
    './static/img',
    './static/css',
    './static/js',
    './static/svg',
    './static/fonts',
    './dist',
    './dist/static',
    './dist/static/img'
];

console.log('开始检查目录权限...');

// 对每个目录进行检查
directories.forEach(dir => {
    console.log(`\n检查目录: ${dir}`); // 使用反引号 ` 而不是单引号 '

    try {
        // 检查目录是否存在
        if (!fs.existsSync(dir)) {
            console.log(`- 目录不存在，尝试创建...`);
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✓ 成功创建目录`);
        } else {
            console.log(`✓ 目录存在`);
        }

        // 检查读取权限
        try {
            fs.accessSync(dir, fs.constants.R_OK);
            console.log(`✓ 有读取权限`);
        } catch (err) {
            console.error(`❌ 无读取权限: \${err.message}`);
        }

        // 检查写入权限
        try {
            fs.accessSync(dir, fs.constants.W_OK);
            console.log(`✓ 有写入权限`);
        } catch (err) {
            console.error(`❌ 无写入权限: \${err.message}`);
        }

        // 尝试创建、写入和读取文件
        const testFile = path.join(dir, '.permission-test');
        try {
            // 写入测试文件
            fs.writeFileSync(testFile, 'test content');
            console.log(`✓ 成功创建并写入测试文件`);

            // 读取测试文件
            const content = fs.readFileSync(testFile, 'utf8');
            console.log(`✓ 成功读取测试文件 (${content.length} 字节)`);

            // 删除测试文件
            fs.unlinkSync(testFile);
            console.log(`✓ 成功删除测试文件`);
        } catch (err) {
            console.error(`❌ 文件操作失败: \${err.message}`);
        }
    } catch (err) {
        console.error(`❌ 目录检查失败: \${err.message}`);
    }
});

console.log('\n检查完成!');