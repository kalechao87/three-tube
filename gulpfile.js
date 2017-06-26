/*!
  Author: Kale Chao | FakeCityMan
  Blog: kalechao87@github.io
*/

var gulp = require('gulp');
// var sass = require('gulp-sass'); //  because of using compass
var compass = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps')
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var cssnano= require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var qrcode = require('qrcode-terminal');

// Development Tasks
// -----------------

//  sass, using compass default
// gulp.task('sass', function(){
//   return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
//     .pipe(sourcemaps.init())  //Initialize sourcemap plugin
//     .pipe(sass()) // converts Sass to CSS with gulp-sass
//     .pipe(autoprefixer())  // Passes it through gulp-autoprefixer
//     .pipe(sourcemaps.write()) //Writing sourcemaps
//     .pipe(gulp.dest('app/css')) // Outputs it in the css folder
//     .pipe(browserSync.reload({  // Reloading with Browser Sync
//       stream: true
//     }))
// });

//  compass, because of using compass's default sourcemap function, so there's no need with gulp-sourcemaps plugin
gulp.task('compass', function() {
  gulp.src('app/scss/**/*.scss')  // Gets all files ending with .scss in app/scss and children dirs
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(compass({
      config_file: './config.rb',
      css: 'app/css',
      sass: 'app/scss'
    }))
    .on('error', function(err) {
      // Would like to catch the error here
    })
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer({
        browsers: [
          'last 2 versions',
          'ios >= 8',
          'android >= 4.1',
          'not ie <= 11'
        ]
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({  // Reloading with Browser Sync
      stream: true
    }))
});


// Watchers

//gulp.watch('files-to-watch', ['tasks', 'to', 'run']);
// gulp.task('watch', ['array', 'of', 'tasks', 'to', 'complete','before', 'watch'], function (){
//   // ...
// })

gulp.task('watch', ['browserSync', 'compass'], function(){  //  using compass, if want to use sass, please change compass to sass
  gulp.watch('app/scss/**/*.scss', ['compass']);  //  using compass, if want to use sass, please change compass to sass
  // Reloads the brower whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Start browserSync server
var browserSyncOpt = {
  server: 'app',
  open: true,
  notify: true,
  ghostMode: false
}

gulp.task('browserSync', function(){
  var instance = browserSync.init(browserSyncOpt, function () {
    // External URL
    var url = instance.getOption('urls').get('external');
    console.log('url is ' + url);
    // Generate qrcode
    qrcode.generate(url);
  });
});


// gulp.task('browserSync', function(){
//   browserSync({
//     server: {
//       baseDir: 'app'
//     },
//   })
// });


// Optimization Tasks
// ------------------

// Optimizing CSS and JavaScript /html
gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        // Uglifies only if it's a Javascript file
        .pipe(gulpif('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpif('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

// Optimizing Images
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
    // Setting interlaced to true
    interlaced: true

  })))
  .pipe(gulp.dest('dist/images'))
})

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// Copying media
gulp.task('media', function() {
  return gulp.src('app/media/**/*')
  .pipe(gulp.dest('dist/media'))
})

// Cleaning
gulp.task('clean', function(){
  del('dist').then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  })
});

gulp.task('cleannoimg', function(){
  del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Sequences
// ---------------


//  run-sequence
// gulp.task('task-name', function(callback) {
//   runSequence('task-one', 'task-two', 'task-three', callback);
// });

//  default
gulp.task('default', function (callback) {
  runSequence(['compass','browserSync', 'watch'], //  using compass, if want to use sass, please change compass to sass
    callback
  )
});

//  build
gulp.task('build', function(callback) {
   runSequence(//'clean:dist',
    'cleannoimg',
    ['compass', 'html', 'images', 'fonts', 'media'], //  using compass, if want to use sass, please change compass to sass
    callback);
});
