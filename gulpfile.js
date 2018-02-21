var gulp = require('gulp');
var concat = require('gulp-concat');
var nunjucks = require('gulp-nunjucks');

var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');

var uglify = require('gulp-uglify');

//var OUTPUT_PATH = "./debug/";
var OUTPUT_PATH = "./";


function nunjucksRender(src, dest, context) {
	return gulp.src(src)
        .pipe(nunjucks.compile(context))
        .pipe(gulp.dest(dest));
}

function genJs(src, outName, dest) {
	return gulp.src(src)
		.pipe(concat(outName))
		.pipe(gulp.dest(dest))
		.pipe(uglify())
		.pipe(rename(function (path) { path.extname = ".min.js" }))
		.pipe(gulp.dest(dest));
}

function genCSS(src, outName, dest) {
	return gulp.src(src)
		.pipe(concat(outName))
        .pipe(gulp.dest(dest))
        .pipe(cssnano())
        .pipe(rename(function (path) { path.extname = ".min.css" }))
		.pipe(gulp.dest(dest));
}
gulp.task('indexHTML', function() {
	return nunjucksRender("src/index.html", OUTPUT_PATH, {});
});

gulp.task('contribHTML', function() {
	return nunjucksRender("src/contrib.html", OUTPUT_PATH, {});
});

// build the updates.html page
gulp.task('updatesHTML', function() {
	return nunjucksRender("src/updates.html", OUTPUT_PATH, {});
});



// concat the js files for photoswipe and minifies them. Output dir is /js
gulp.task('photoswipeJS', function() {
	var src = ["src/js/photoswipe.min.js", "src/js/photoswipe-ui-default.min.js", "src/js/photoswipe-autoload.js",];
	return genJs(src, 'photoswipe.js', OUTPUT_PATH + 'js');
});




gulp.task('gmcJS', function() {
	var src = ["src/js/gmc.js", "src/js/gmc_theme.js"];
	return genJs(src, 'gmc.js', OUTPUT_PATH + 'js');
});

gulp.task('gmcCSS', function() {
	return genCSS("src/css/gmc.css", 'gmc.css', OUTPUT_PATH + 'css');
});


gulp.task('updatesCSS', function() {
	var src = ["src/css/updates.css", "src/css/flexbin.css", "src/css/photoswipe.css"];
	return genCSS(src, 'updates.css', OUTPUT_PATH + 'css');
});
gulp.task('contribCSS', function() {
	var src = "src/css/contrib.css";
	return genCSS(src, 'contrib.css', OUTPUT_PATH + 'css');
});

gulp.task('copyCSS', function() {
	return gulp.src(["src/css/fonts/**/*", 
						"src/css/photoswipe-skin/**/*"], {base:"src/css"})
		.pipe(gulp.dest(OUTPUT_PATH + "css"));
});
gulp.task('copyJS', function() {
	return gulp.src(["src/js/parallax-background.min.js", 
						"src/js/progressive-bg.js", 
						"src/js/retina.min.js"], {base:"src/js"})
		.pipe(gulp.dest(OUTPUT_PATH + "js"));
});

gulp.task('mainCSS', function() {
	return gulp.src("src/css/main.css")
		.pipe(gulp.dest(OUTPUT_PATH + "css"))
        .pipe(cssnano())
        .pipe(rename(function (path) { path.extname = ".min.css" }))
		.pipe(gulp.dest(OUTPUT_PATH + 'css'));
});

gulp.task('contribHTML', function() {
	return gulp.src("src/contrib.html")
        .pipe(nunjucks.compile({}))
        .pipe(gulp.dest(OUTPUT_PATH));
});

gulp.task('updates', ['updatesHTML', 'updatesCSS', 'mainCSS', 'copyCSS', 'photoswipeJS', 'copyJS']);

gulp.task('contrib', ['contribHTML', 'gmcCSS', 'gmcJS', 'mainCSS', 'copyCSS', 'copyJS', 'contribCSS']);

gulp.task('gh-build', ['contrib', 'updates', 'indexHTML']);

gulp.task('default', ['gh-build']);

