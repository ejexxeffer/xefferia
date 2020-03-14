const gulp = require ('gulp');
const sass = require ('gulp-sass');
const uglify = require ('gulp-uglify');
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
  clean: './build'
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

gulp.task ('watch', function(done) {
  gulp.watch('src/scss/**/*.css').on('change', () => {
    gulp.series('styles',reload());
    // reload();
    done();
  });
  gulp.watch('*.html').on('change', () => {
    reload();
    done();
  });
  gulp.watch('src/js/**/*.js').on('change', () => {
    gulp.series('js',reload());
    // reload();
    done();
  });
  gulp.watch('*.php').on('change', ()=> {
    reload();
    done();
  });
});

gulp.task ('js', () => {
  return gulp.src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js));
});

gulp.task ('styles', () => {
  return gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(clean_css())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css));
});

gulp.task('cleanBuild', () => {
  return del('build');
});

gulp.task('cleanSrc', () => {
  return del('src');
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

gulp.task('buildDev', (done) => {
  gulp.series('cleanBuild', 'styles', 'js');
  done();
});

gulp.task('deploy', (done) => {
  gulp.series('cleanBuild', 'styles', 'js', 'cleanSrc');
  done();
});


gulp.task('default', gulp.series('cleanBuild',gulp.parallel(['sync','watch'])));