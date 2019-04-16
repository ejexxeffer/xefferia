var gulp = require ('gulp');
//const browserSync = require('browser-sync').create();
//var reload = browserSync.reload;
var browserSync = require('browser-sync');
const reload = browserSync.reload;

var config = {
	server: {
		baseDir: './'
	},
	port: 3000,
	notify: false
};

/*
 *Old tasks
 */
// gulp.task (watch, ['serve'], function(){
// 	gulp.watch('css/**/*.css', browserSync.reload);
// 	gulp.watch('*.html', browserSync.reload);
// 	gulp.watch('js/**/*.js', browserSync.reload);
// });

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

// gulp.task('serve', function() {
// 	browserSync.init({
// 		server: {
// 			baseDir: './',
// 			index: "index.html"
// 		},
// 	});
// 	// browserSync.watch("*.html").on("change", reload);
// });

// function browserSync(done) {
// 	browsersync.init({
// 	  server: {
// 		baseDir: "./"
// 	  },
// 	  port: 3000,
// 	  notify: false 
// 	});
// 	done();
//   }

// gulp.task('serve', function(done) {

//     browserSync.init({
//         server: {
// 			baseDir: "./"
// 		},
// 		port: 3000,
// 		notify: false
//     }); 

//     done();
// });

gulp.task('serve', function(done){
	browserSync(config);
	done();
});

  
/*
 *Old tasks
 */  
// gulp.task('assets', function() {
// 	return gulp.src('app/assets/**', {since: gulp.lastRun('assets')})
// 		.pipe(newer('public'))
// 		.pipe(gulp.dest('public'));
// });

// gulp.task('default', function() {
// 	gulp.start('watch');
// });

// const defaultTasks = gulp.parallel(serve, watch);
gulp.task('default', gulp.parallel('serve','watch'));
