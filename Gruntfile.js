module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
                options: {
                    install: true,
                    copy: false,
                    targetDir: './libs',
                    cleanTargetDir: true
                }
            }
        },
        jshint: {
            options: {
                curly: true
            },
            dev: {
                src: ['Gruntfile.js', 'src/**/*.js'],
                test: ['test/**/*.js']
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'css/main.css': 'sass/main.scss'
                }
            }
        },
        karma: {
            options: {
                configFile: 'config/karma-conf.js'
            },
            unit: {
                singleRun: true
            }
        },
        watch: {
            dev: {
                options: {
                    atBegin: true
                },
                files: ['Gruntfile.js', 'src/**/*.js'],
                tasks: ['jshint']
            },
            scripts: {
                options: {
                    spawn: false,
                },
                files: ['**/*.js'],
                tasks: ['jshint'],
            }
        },
        connect: {
            localhost: {
                options: {
                    base: '.',
                    hostname: '*',
                    middleware: function(connect, options, defaultMiddleware) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            proxy
                        ].concat(defaultMiddleware);
                    }
                },
                proxies: [
                    {
                        context: '/alfresco',
                        host: 'localhost',
                        port: 8080,
                        secure: false
                    }
                ]
            },
            test: {
                options: {
                    base: '.',
                    middleware: function(connect, options, defaultMiddleware) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            proxy
                        ].concat(defaultMiddleware);
                    }
                },
                proxies: [
                    {
                        context: '/alfresco',
                        host: 'test.openesdh.dk',
                        port: 80,
                        changeOrigin: true,
                        secure: false
                    }
                ]
            },
            demo: {
                options: {
                    base: '.',
                    middleware: function(connect, options, defaultMiddleware) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            proxy
                        ].concat(defaultMiddleware);
                    }
                },
                proxies: [
                    {
                        context: '/alfresco',
                        host: 'demo.openesdh.dk',
                        port: 80,
                        changeOrigin: true,
                        secure: false
                    }
                ]
            }
        },
        
        /**
        * i18nextract build json lang files
        */
        i18nextract: {
          default_options: {
            defaultLang: "en_US",
            src: [ 'app/src/**/*.js', 'app/src/**/*.html' ],
            lang: ['en', 'da'],
            dest: 'app/src/i18n',
            prefix: 'draft_',
            namespace: true,
            safeMode: false
          }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.loadNpmTasks('grunt-angular-translate');
    
    grunt.registerTask('local', ['bower', 'configureProxies:localhost', 'connect:localhost', 'watch:dev']);
    grunt.registerTask('dev', ['bower', 'configureProxies:test', 'connect:test', 'watch:dev']);
    grunt.registerTask('demo-dev', ['bower', 'configureProxies:demo', 'connect:demo', 'watch:dev']);
    grunt.registerTask('update-lang', ['i18nextract']);
    grunt.registerTask('default', []);
    
};
