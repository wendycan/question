module.exports = function(grunt){

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coffee: {
      options: {
        bare: true
      },
      compile: {
        files: [
          {
            expand: true,
            cwd: 'assets/coffee/',
            src: '*.coffee',
            dest: 'build/js/',
            ext: '.js',
            filter: function(name){
              if(name.indexOf('\/') > -1){
                name = name.split('\/')[2]
              } else if(name.indexOf('\\') > -1) {
                name = name.split('\\')[2]
              }
              return name.indexOf('_') !== 0
            }
          }
        ]
      }
    },

    sass: {
      dist: {
        options: {
          compass: true,
          sourcemap: 'none',
          style: 'expanded'
        },
        files: {
          'build/css/main.css': 'assets/sass/main.scss'
        }
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src : 'build/css/*.css'
        },
        options: {
          watchTask: true // < VERY important
        }
      }
    },

    watch: {
      js: {
        files: ['assets/coffee/*.coffee'],
        tasks: ['coffee']
      },
      sass: {
        files: ['assets/sass/*.scss'],
        tasks: ['sass']
      }
    }

  })

  grunt.registerTask('default', ["browserSync", "watch"]);

}
