const { src, dest, watch, parallel, series } = require('gulp')

const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const babel = require('gulp-babel')
const scss = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const cleancss = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const del = require('del')

function html() {
  return src(['src/*.html', '!src/**/_*.html'])
    .pipe(plumber())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

function styles() {
  return src(['src/assets/scss/style.scss'])
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: 'SCSS Error',
            message: 'Error: <%= error.message %>',
          })(err)
          this.emit('end')
        },
      })
    )
    .pipe(scss())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 10 version'],
        grid: true,
      })
    )
    .pipe(
      cleancss({
        level: { 1: { specialComments: 0 } },
        format: 'beautify',
      })
    )
    .pipe(concat('style.css'))
    .pipe(dest('dist/assets/css'))
    .pipe(
      cleancss({
        level: { 1: { specialComments: 0 } },
      })
    )
    .pipe(concat('style.min.css'))
    .pipe(dest('dist/assets/css'))
    .pipe(browserSync.stream())
}

function stylesLibs() {
  return src(['node_modules/swiper/swiper-bundle.min.css'])
    .pipe(dest('dist/assets/css/libs'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src(['src/assets/js/main.js'])
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: 'JS Error',
            message: 'Error: <%= error.message %>',
          })(err)
          this.emit('end')
        },
      })
    )
    .pipe(concat('main.js'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(dest('dist/assets/js'))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(dest('dist/assets/js'))
    .pipe(browserSync.stream())
}

function scriptsLibs() {
  return src(['node_modules/swiper/swiper-bundle.min.js'])
    .pipe(dest('dist/assets/js/libs'))
    .pipe(browserSync.stream())
}

function images() {
  return src('src/assets/images/**/*')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 78, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest('dist/assets/images'))
    .pipe(browserSync.stream())
}

function fonts() {
  return src('src/assets/fonts/**/*')
    .pipe(dest('dist/assets/fonts/'))
    .pipe(browserSync.stream())
}

function clean() {
  return del('dist/**/*')
}

function startwatch() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    //proxy: 'folder/dist',
    ghostMode: { clicks: false },
    notify: false,
    online: true,
    // tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
  })
  watch('src/**/*.html', html)
  watch('src/assets/scss/**/*.scss', styles)
  watch(['src/assets/js/**/*.js', '!src/js/**/*.min.js'], scripts)
  watch(
    'src/assets/images/**/*.{jpg,jpeg,png,webp,avif,svg,gif,ico,webmanifest,xml,json}',
    images
  )
  watch('src/assets/fonts/**/*', fonts)
}

exports.html = html
exports.scripts = scripts
exports.styles = styles
exports.images = images
exports.clean = clean

exports.build = series(
  clean,
  html,
  scripts,
  scriptsLibs,
  styles,
  stylesLibs,
  images,
  fonts
)
exports.default = series(
  html,
  scripts,
  scriptsLibs,
  styles,
  stylesLibs,
  images,
  fonts,
  parallel(startwatch)
)
