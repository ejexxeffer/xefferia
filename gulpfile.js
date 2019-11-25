var gulp = require ('gulp');
//const browserSync = require('browser-sync').create();
//var reload = browserSync.reload;
var browserSync = require('browser-sync');
const reload = browserSync.reload;

var config = {
	server: {
		baseDir: './',
		index: 'index.html'
	},
	port: 3000,
	// open: "local",	
	notify: false
};

gulp.task ('watch', function(done) {
		gulp.watch('css/**/*.css').on('change', () => {
			browserSync.reload();
			done();
		});
		gulp.watch('*.html').on('change', () => {
			browserSync.reload();
			done();
		});
		gulp.watch('js/**/*.js').on('change', () => {
			browserSync.reload();
			done();
		});
	});


gulp.task('serve', function(done){
	browserSync(config);
	done();
});

gulp.task('default', gulp.parallel('serve','watch'));
