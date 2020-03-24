const gulp = require ('gulp');
const sass = require ('gulp-sass');
const terser = require ('gulp-terser');
const prefixer = require ('gulp-autoprefixer');
const clean_css = require ('gulp-clean-css');
const connect = require ('gulp-connect-php');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const reload = browserSync.reload;
const del = require ('del');
sass.compiler = require('node-sass');

const path = {
  build: {
      js: 'build/',
      css: 'build/',
  },
  src: {
      js: 'src/js/main.js',
      style: 'src/style/main.scss',
  },
  watch: {
      js: 'src/js/**/*.js',
      style: 'src/style/**/*.scss',
      fonts: 'src/fonts/**/*.*'
  },
  clean: {
    build: 'build',
    deploy: 'src'
  }
};

const configSync = {
  server: {
    baseDir: './',
    index: 'index.html'
  },
  port: 3000,
  // open: "local",
  notify: false
};

const configPhp = {
  base: './',
  keepalive: true,
  hostname: 'localhost',
  port: 8080,
  open: false
}

function watch() {
  gulp.watch('src/style/**/*.scss',gulp.parallel(styles))
    .on('change', () => {return reload()});
  gulp.watch('*.html')
    .on('change', () => {return reload()});
  gulp.watch('src/js/**/*.js',gulp.series(js))
    .on('change', () => {return reload()});
  gulp.watch('*.php')
    .on('change', () => {return reload()});
}

function js() {
  return gulp.src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js));
}

function styles() {
  return gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(clean_css())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css));
}

gulp.task('cleanBuild', () => {
  return del(path.clean.build);
});

gulp.task('cleanDeploy', () => {
  return del(path.clean.deploy);
});

gulp.task('serve', (done) => {
  connect.server(configPhp, ()=> {
    browserSync({proxy: '127.0.0.1:8080', notify: false});
  });
  done();
});

gulp.task('sync', (done) => {
  browserSync.init(configSync);
  done();
});

gulp.task('php', (done) => {
  connect.server(configPhp);
  done();
});

gulp.task('build', gulp.series('cleanBuild', styles, js));

gulp.task('deploy', (done) => {
  gulp.series('cleanBuild', styles, js, 'cleanDeploy');
  done();
});


gulp.task('default', gulp.series('cleanBuild', 'build', gulp.parallel('sync', watch)));