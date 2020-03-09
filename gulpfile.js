const gulp = require ('gulp');
const connect = require ('gulp-connect-php');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

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
  gulp.watch('css/**/*.css').on('change', () => {
    reload();
    done();
  });
  gulp.watch('*.html').on('change', () => {
    reload();
    done();
  });
  gulp.watch('js/**/*.js').on('change', () => {
    reload();
    done();
  });
  gulp.watch('*.php').on('change', ()=> {
    reload();
    done();
  });
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

gulp.task('default', gulp.parallel(['sync','watch']));