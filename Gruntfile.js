'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});

var mountFolder = function(connect, dir) {
  return require('serve-static')(require('path').resolve(dir));
};

module.exports = function(grunt) {


  require('load-grunt-tasks')(grunt);


  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    project: {
      src: 'src',
      app: 'app',
      assets: '<%= project.app %>/assets',
      css: [
        '<%= project.src %>/scss/style.scss'
      ],
      js: [
        '<%= project.src %>/js/*.js'
      ]
    },

    tag: {
      banner: '/*!\n' +
        ' * <%= pkg.name %>\n' +
        ' * <%= pkg.title %>\n' +
        ' * <%= pkg.url %>\n' +
        ' * @author <%= pkg.author %>\n' +
        ' * @version <%= pkg.version %>\n' +
        ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
        ' */\n'
    },

    usebanner: {
      taskName: {
        options: {
          position: 'top',
          banner: '<%= tag.banner %>',
          linebreak: true
        },
        files: {
          src: ['<%= project.assets %>/css/style.min.css',
            '<%= project.assets %>/js/scripts.min.js'
          ]
        }
      }
    },

    connect: {
      options: {
        port: 9992,
        hostname: '*'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [lrSnippet, mountFolder(connect, 'app')];
          }
        }
      }
    },

    clean: {
      dist: [
        '<%= project.assets %>/css/style.unprefixed.css',
        '<%= project.assets %>/css/style.prefixed.css'
      ]
    },

    concat: {
      dev: {
        files: {
          '<%= project.assets %>/js/scripts.min.js': '<%= project.js %>'
        }
      },
      options: {
        stripBanners: true,
        nonull: true,
      }
    },

    uglify: {
      dist: {
        files: {
          '<%= project.assets %>/js/scripts.min.js': '<%= project.js %>'
        }
      }
    },

    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= project.assets %>/css/style.unprefixed.css': '<%= project.css %>'
        }
      },
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= project.assets %>/css/style.unprefixed.css': '<%= project.css %>'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          'last 2 version',
          'safari 6',
          'ie 9',
          'opera 12.1',
          'ios 6',
          'android 4'
        ]
      },
      dev: {
        files: {
          '<%= project.assets %>/css/style.min.css': [
            '<%= project.assets %>/css/style.unprefixed.css'
          ]
        }
      },
      dist: {
        files: {
          '<%= project.assets %>/css/style.prefixed.css': [
            '<%= project.assets %>/css/style.unprefixed.css'
          ]
        }
      }
    },

    cssmin: {
      dev: {
        files: {
          '<%= project.assets %>/css/style.min.css': [
            '<%= project.src %>/components/normalize-css/normalize.css',
            '<%= project.assets %>/css/style.unprefixed.css'
          ]
        }
      },
      dist: {
        files: {
          '<%= project.assets %>/css/style.min.css': [
            '<%= project.src %>/components/normalize-css/normalize.css',
            '<%= project.assets %>/css/style.prefixed.css'
          ]
        }
      }
    },

    bower: {
      dev: {
        dest: '<%= project.assets %>/components/'
      },
      dist: {
        dest: '<%= project.assets %>/components/'
      }
    },

    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },

    watch: {
      concat: {
        files: '<%= project.src %>/js/{,*/}*.js',
        tasks: ['concat:dev']
      },
      sass: {
        files: '<%= project.src %>/scss/{,*/}*.{scss,sass}',
        tasks: ['sass:dev', 'cssmin:dev', 'autoprefixer:dev']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= project.app %>/{,*/}*.html',
          '<%= project.assets %>/css/*.css',
          '<%= project.assets %>/js/{,*/}*.js',
          '<%= project.assets %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }
  });

  grunt.registerTask('default', [
    'sass:dev',
    'bower:dev',
    'autoprefixer:dev',
    'cssmin:dev',
    'concat:dev',
    'usebanner',
    'connect:livereload',
    'open',
    'watch'
  ]);

  grunt.registerTask('build', [
    'sass:dist',
    'bower:dist',
    'autoprefixer:dist',
    'cssmin:dist',
    'clean:dist',
    'uglify',
    'usebanner'
  ]);

};
