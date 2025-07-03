// gulpfile.js 或 gulpfile.mjs
import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import csso from 'gulp-csso';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import {deleteAsync} from 'del';
import browserSync from 'browser-sync';
import * as fs from "node:fs";
import * as path from "node:path";

// 创建浏览器同步实例
const server = browserSync.create();

// 定义路径
const paths = {
    html: {
        src: './*.html',
        dest: './dist/'
    },
    css: {
        src: './static/css/**/*.css',
        dest: './dist/static/css/'
    },
    js: {
        src: './static/js/**/*.js',
        dest: './dist/static/js/'
    },
    img: {
        src: './static/img/**/*',
        dest: './dist/static/img/'
    },
    svg: {
        src: './static/svg/**/*',
        dest: './dist/static/svg/'
    },
    fonts: {
        src: './static/fonts/**/*',
        dest: './dist/static/fonts/'
    },
    other: {
        src: [
            './README.md',
            './docker-compose.yaml',
            './Dockerfile'
        ],
        dest: './dist/'
    },
    nginx: {
        src: './nginx.conf',  // 创建一个 nginx 配置文件
        dest: './dist/'
    }
};

// 清理 dist 目录
function clean() {
    return deleteAsync(['./dist']);
}

// 处理 HTML
function html() {
    return gulp.src(paths.html.src)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(server.stream());
}

// 处理 CSS
function css() {
    return gulp.src(paths.css.src)
        .pipe(sourcemaps.init())
        .pipe(csso())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(server.stream());
}

// 处理 JavaScript
function js() {
    return gulp.src(paths.js.src)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(server.stream());
}

// 递归复制目录及其内容
function copyDirRecursive(src, dest) {
    // 确保目标目录存在
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, {recursive: true});
    }

    // 读取源目录
    const entries = fs.readdirSync(src, {withFileTypes: true});

    let fileCount = 0;

    // 处理每个条目
    entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // 递归复制子目录
            fileCount += copyDirRecursive(srcPath, destPath);
        } else {
            // 复制文件
            fs.copyFileSync(srcPath, destPath);
            fileCount++;
        }
    });

    return fileCount;
}

// 图片处理任务
function img(done) {
    console.log('开始复制图片文件...');

    try {
        const count = copyDirRecursive('./static/img', paths.img.dest);
        console.log(`成功复制 ${count} 个图片文件`);
    } catch (err) {
        console.error('复制图片时出错:', err);
    }

    done();
}

// 处理 SVG - 直接复制不压缩
function svg() {
    return gulp.src(paths.svg.src, {allowEmpty: true})
        // 移除 imagemin 处理
        .pipe(gulp.dest(paths.svg.dest))
        .pipe(browserSync.stream());
}


// 处理字体
function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(server.stream());
}

// 处理其他文件
function other() {
    return gulp.src(paths.other.src)
        .pipe(gulp.dest(paths.other.dest))
        .pipe(server.stream());
}

// 复制 Nginx 配置文件
function nginx() {
    return gulp.src(paths.nginx.src)
        .pipe(gulp.dest(paths.nginx.dest))
        .pipe(server.stream());
}

// 开发服务器
function serve() {
    server.init({
        server: {
            baseDir: './dist'
        },
        port: 3000,
        open: true
    });

    // 监视文件变化
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.css.src, css);
    gulp.watch(paths.js.src, js);
    gulp.watch(paths.img.src, img);
    gulp.watch(paths.svg.src, svg);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.other.src, other);
    gulp.watch(paths.nginx.src, nginx);
}

// 复合任务
const build = gulp.series(
    clean,
    gulp.parallel(html, css, js, img, svg, fonts, other, nginx)
);

// 开发任务
const dev = gulp.series(
    build,
    serve
);

// 导出任务
export {
    clean,
    html,
    css,
    js,
    img,
    svg,
    fonts,
    other,
    nginx,
    build,
    dev
};

// 默认导出
export default dev;