var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');
var runSequence = require('run-sequence');

/// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.stream());
});

// Move the javascript files into our /src/js folder
gulp.task('js', function() {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/tether/dist/js/tether.min.js'])
        .pipe(gulp.dest("build/js"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./build"  
    });

    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});


gulp.task('useref', function(){
    return gulp.src('src/*.html')
      .pipe(useref())
      .pipe(gulp.dest('build'))
  });

  gulp.task('useref', function(){
    return gulp.src('src/*.html')
      .pipe(useref())
      // Minifies only if it's a JavaScript file
      .pipe(gulpIf('*.js', uglify()))
      .pipe(gulp.dest('build'))
  });

  gulp.task('useref', function(){
    return gulp.src('src/*.html')
      .pipe(useref())
      .pipe(gulpIf('*.js', uglify()))
      // Minifies only if it's a CSS file
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('build'))
  });

  gulp.task('images', function(){
    return gulp.src('src/assets/img/**/*.+(png|jpg|gif|svg)')    
    .pipe(cache(imagemin({
        interlaced: true
      })))
    .pipe(gulp.dest('build/assets/img'))
  });


  gulp.task('fonts', function() {       //fonts von src nach build
    return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('build/fonts'))
  })

  gulp.task('html', function() {        //html files von src nach build
      return gulp.src('src/*.html')
      .pipe(gulp.dest('build'))
  })

  gulp.task('clean:build', function() {   //build files löschen 
    return del.sync('build');
  })

  gulp.task('build', function (callback) {
    runSequence('clean:build', 
      ['sass', 'useref', 'images', 'fonts', 'html',],
      callback
    )
  })

  gulp.task('default', function (callback) {
    runSequence(['js','serve',],
      callback
    )
  })