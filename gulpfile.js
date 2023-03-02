const gulp = require ('gulp');
// const sass = require ('gulp-sass');
const sass = require('gulp-sass')(require('sass'));
const terser = require ('gulp-terser');
const prefixer = require ('gulp-autoprefixer');
const clean_css = require ('gulp-clean-css');
// const connect = require ('gulp-connect-php');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const del = require ('del');
const gulp_pug = require ('gulp-pug');
const plumbeer = require ('gulp-plumber');
sass.compiler = require('node-sass');
const workbox_build = require('workbox-build')

const path = {
  build: {
      js: 'build/',
      css: 'build/',
  },
  src: {
      js: 'src/js/main.js',
      main: 'src/style/main.scss',
      light: 'src/style/light.scss',
      dark: 'src/style/dark.scss',
  },
  watch: {
      js: 'src/js/**/*.js',
      style: 'src/style/**/*.scss',
      fonts: 'src/fonts/**/*.*'
  },
  clean: {
    build: 'build',
    deploy: 'src',
    dist: 'dist',
  }
};

const configSync = {
  server: {
    baseDir: './',
    index: 'index.html'
  },
  https: {
    key: "../localhost+2-key.pem",
    cert: "../localhost+2.pem"
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
  gulp.watch('src/pug/**/*.pug', gulp.parallel('pug'))
    .on('change', () => {return reload()});
  gulp.watch('src/js/**/*.js',gulp.series(js))
    .on('change', () => {return reload()});
  gulp.watch('*.php')
    .on('change', () => {return reload()});
}

function pugMainBuild() {
  return gulp.src('src/pug/*.pug')
  .pipe(gulp_pug({pretty: true}))
  .pipe(plumbeer())
  .pipe(gulp.dest('./'))
  .pipe(browserSync.stream());
}

function pugPostsBuild() {
  return gulp.src('src/pug/post/*.pug')
  .pipe(gulp_pug({pretty: true}))
  .pipe(plumbeer())
  .pipe(gulp.dest('./posts'))
  .pipe(browserSync.stream());
}


function js() {
  return gulp.src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
}

function styles() {
  return gulp.src([path.src.main, path.src.dark, path.src.light])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(clean_css())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
}

gulp.task('pug', gulp.parallel(pugMainBuild,pugPostsBuild));

gulp.task('cleanBuild', () => {
  return del(path.clean.build);
});

gulp.task('cleanDist', () => {
  return del(path.clean.dist);
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

gulp.task('bundle-sw', async (done) => {
  await workbox_build.generateSW({
    mode: 'development',
    globDirectory: './',
    sourcemap: true,
    swDest: './sw.js',
    globPatterns: ['**\/*.{html,js,css,png,jpg,woff,woff2,svg,ico,json}'],
    skipWaiting: true,
    clientsClaim: true,
    dontCacheBustURLsMatching: /-[a-z0-9]{20}\./,
    navigateFallback: '/index.html',
    // exclude: [
    //   // Images don't need to be pre-cached (cache only if in use)
    //   /\.(png|jpg|jpeg|webm|gif|svg|map)$/,
    //   // Translations don't need to be pre-cached (cache only if in use)
    //   /[a-z]{2}(?:-[A-Z]{2})?-[a-z0-9]{20}\.min\.js/
    // ],
    navigationPreload: true,
    runtimeCaching: [{
      // Match any same-origin request that contains 'api'.
      urlPattern: '/*',
      // Apply a StaleWhileRevalidate strategy.
      handler: 'StaleWhileRevalidate',
      options: {
        // Use a custom cache name for this route.
        cacheName: 'my-api-cache',
        // Configure custom cache expiration.
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 60,
        },
        // Configure background sync.
        backgroundSync: {
          name: 'my-queue-name',
          options: {
            maxRetentionTime: 60 * 60,
          },
        },
        // Configure which responses are considered cacheable.
        cacheableResponse: {
          statuses: [0, 200],
          headers: {'x-test': 'true'},
        },
        // Configure the broadcast cache update plugin.
        broadcastUpdate: {
          channelName: 'my-update-channel',
          options: {
            notifyAllClients: true,
          } ,
        },
        // Add in any additional plugin logic you need.
  
        // matchOptions and fetchOptions are used to configure the handler.
        fetchOptions: {
          mode: 'no-cors',
        },
        matchOptions: {
          ignoreSearch: true,
        },  
      },  
    }],
    skipWaiting: true
  }).then(({warnings}) => {
    // In case there are any warnings from workbox-build, log them.
    for (const warning of warnings) {
      console.warn(warning);
    }
    console.info('Service worker generation completed.');
  }).catch((error) => {
    console.warn('Service worker generation failed:', error);
  });
  done();
});

// gulp.task('php', (done) => {
//   connect.server(configPhp);
//   done();
// });

gulp.task('build', gulp.series('cleanBuild', styles, js, 'bundle-sw','pug'));

gulp.task('deploy', gulp.series('cleanBuild', styles, js, 'bundle-sw','pug', 'cleanDeploy'));


gulp.task('default', gulp.series('cleanBuild', 'build', 'bundle-sw', gulp.parallel('sync', watch)));