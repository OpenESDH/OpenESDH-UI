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
        * i18nextract build json lang files. Files are stored as draft_[lang].json.
        * After i18nextract, the 'update-lang' task runs json-replace for EN and DA languages. This replaces dynamic strings that need to be defined in json-replace.
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
        },
        "json-replace": {
          "en": {
            "options": {
              "space": "\t",
              "replace": {
                "CASE": {
                  "STATUS": {
                    "active": "Active", "passive": "Passive", "closed": "Closed", "archived": "Archived"
                  },
                  "TYPE": {
                    "simple_case": "Standard case"
                  }
                },
                "DOCUMENT": {
                  "CATEGORY": {
                    "annex": "Annex", "proof": "Proof", "contract": "Contract", "note": "Note", "report": "Report", "proxy": "Proxy", "warranty": "Warranty", "part": "Part", "statement": "Statement", "summary": "Summary", "accounting": "Accounting", "offers": "Offers", "other": "Other"  
                  },
                  "STATE": {
                    "draft": "Draft", "final": "Final", "received": "Received", "distributed": "Distributed", "under-review": "Under review", "published": "Published", "finalised": "Finalised", "submitted": "Submitted"
                  },
                  "STATUS": {
                    "draft": "Draft", "final": "Final"  
                  },
                  "TYPE": {
                    "invoice": "Invoice", "letter": "Letter", "note": "Note", "report": "Report", "agenda": "Agenda", "other": "Other"
                  }
                },
                "COUNTRY": {
                  "AF":"Afghanistan","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua and Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia and Herzegovina","BW":"Botswana","BV":"Bouvet Island","BR":"Brazil","BQ":"British Antarctic Territory","IO":"British Indian Ocean Territory","VG":"British Virgin Islands","BN":"Brunei","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CA":"Canada","CT":"Canton and Enderbury Islands","CV":"Cape Verde","KY":"Cayman Islands","CF":"Central African Republic","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos [Keeling] Islands","CO":"Colombia","KM":"Comoros","CG":"Congo - Brazzaville","CD":"Congo - Kinshasa","CK":"Cook Islands","CR":"Costa Rica","HR":"Croatia","CU":"Cuba","CY":"Cyprus","CZ":"Czech Republic","CI":"C\u00f4te d\u2019Ivoire","DK":"Denmark","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","NQ":"Dronning Maud Land","DD":"East Germany","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","FQ":"French Southern and Antarctic Territories","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard Island and McDonald Islands","HN":"Honduras","HK":"Hong Kong SAR China","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Iraq","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JE":"Jersey","JT":"Johnston Island","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macau SAR China","MK":"Macedonia","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","FX":"Metropolitan France","MX":"Mexico","FM":"Micronesia","MI":"Midway Islands","MD":"Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar [Burma]","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","AN":"Netherlands Antilles","NT":"Neutral Zone","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","KP":"North Korea","VD":"North Vietnam","MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PC":"Pacific Islands Trust Territory","PK":"Pakistan","PW":"Palau","PS":"Palestinian Territories","PA":"Panama","PZ":"Panama Canal Zone","PG":"Papua New Guinea","PY":"Paraguay","YD":"People's Democratic Republic of Yemen","PE":"Peru","PH":"Philippines","PN":"Pitcairn Islands","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RO":"Romania","RU":"Russia","RW":"Rwanda","RE":"R\u00e9union","BL":"Saint Barth\u00e9lemy","SH":"Saint Helena","KN":"Saint Kitts and Nevis","LC":"Saint Lucia","MF":"Saint Martin","PM":"Saint Pierre and Miquelon","VC":"Saint Vincent and the Grenadines","WS":"Samoa","SM":"San Marino","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","CS":"Serbia and Montenegro","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","GS":"South Georgia and the South Sandwich Islands","KR":"South Korea","ES":"Spain","LK":"Sri Lanka","SD":"Sudan","SR":"Suriname","SJ":"Svalbard and Jan Mayen","SZ":"Swaziland","SE":"Sweden","CH":"Switzerland","SY":"Syria","ST":"S\u00e3o Tom\u00e9 and Pr\u00edncipe","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad and Tobago","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks and Caicos Islands","TV":"Tuvalu","UM":"U.S. Minor Outlying Islands","PU":"U.S. Miscellaneous Pacific Islands","VI":"U.S. Virgin Islands","UG":"Uganda","UA":"Ukraine","SU":"Union of Soviet Socialist Republics","AE":"United Arab Emirates","GB":"United Kingdom","US":"United States","ZZ":"Unknown or Invalid Region","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City","VE":"Venezuela","VN":"Vietnam","WK":"Wake Island","WF":"Wallis and Futuna","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe","AX":"\u00c5land Islands"
                },
                "WORKFLOW": {
                  "TASK": {
                    "PRIORITY": {
                      "1": "High", "2": "Medium", "3": "Low"
                    },
                    "STATUS": {
                      "NotYetStarted": "Not yet started", "InProgres": "In progress", "OnHold": "On hold", "Cancelled": "Cancelled", "Completed": "Completed"
                    }
                  }
                }
              }
            },
            "files": [{
              "src": 'app/src/i18n/draft_en.json',
              "dest": 'app/src/i18n/draft_en.json'
            }]
          },
          "da": {
            "options": {
              "space": "\t",
              "replace": {
                "CASE": {
                  "STATUS": {"active": "Aktiv", "passive": "Passiv", "closed": "Lukket", "archived": "Arkiveret"},
                  "TYPE": {
                    "simple_case": "Standardsag"
                  }
                },
                "DOCUMENT": {
                  "CATEGORY": {
                    "annex": "Annex", "proof": "Proof", "contract": "Kontrakt", "note": "Note", "report": "Rapport", "proxy": "Proxy", "warranty": "Garanti", "part": "Part", "statement": "Udtalelse", "summary": "Resumé", "accounting": "Bogholderi", "offers": "Tilbud", "other": "Andet"  
                  },
                  "STATE": {
                    "draft": "Kladde", "final": "Endelig", "received": "Modtaget", "distributed": "Distribueret", "under-review": "Under gennemlæsning", "published": "Publiceret", "finalised": "Færdiggjort", "submitted": "Indmeldt"
                  },
                  "STATUS": {
                    "draft": "Kladde", "final": "Endelig"  
                  },
                  "TYPE": {
                    "invoice": "Faktura", "letter": "Brev", "note": "Note", "report": "Rapport", "agenda": "Agenda", "other": "Andet"  
                  }
                },
                "COUNTRY": {
                  "AF":"Afghanistan","AL":"Albanien","DZ":"Algeriet","AS":"Amerikansk Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarktis","AG":"Antigua og Barbuda","AR":"Argentina","AM":"Armenien","AW":"Aruba","AZ":"Aserbajdsjan","AU":"Australien","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BE":"Belgien","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnien-Hercegovina","BW":"Botswana","BV":"Bouvet\u00f8","BR":"Brasilien","BN":"Brunei Darussalam","BG":"Bulgarien","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodja","CM":"Cameroun","CA":"Canada","KY":"Cayman\u00f8erne","CF":"Centralafrikanske Republik","CL":"Chile","CC":"Cocos\u00f8erne","CO":"Colombia","KM":"Comorerne","CG":"Congo","CD":"Congo-Kinshasa","CK":"Cook-\u00f8erne","CR":"Costa Rica","CU":"Cuba","CY":"Cypern","DK":"Danmark","UM":"De Mindre Amerikanske Overs\u00f8iske \u00d8er","VI":"De amerikanske jomfru\u00f8er","VG":"De britiske jomfru\u00f8er","PS":"De pal\u00e6stinensiske omr\u00e5der","DO":"Den Dominikanske Republik","IO":"Det Britiske Territorium i Det Indiske Ocean","DJ":"Djibouti","DM":"Dominica","EC":"Ecuador","EG":"Egypten","SV":"El Salvador","CI":"Elfenbenskysten","ER":"Eritrea","EE":"Estland","ET":"Etiopien","FK":"Falklands\u00f8erne","FJ":"Fiji-\u00f8erne","PH":"Filippinerne","FI":"Finland","AE":"Forenede Arabiske Emirater","FR":"Frankrig","GF":"Fransk Guyana","PF":"Fransk Polynesien","TF":"Franske Besiddelser i Det Sydlige Indiske Ocean","FO":"F\u00e6r\u00f8erne","GA":"Gabon","GM":"Gambia","GE":"Georgien","GH":"Ghana","GI":"Gibraltar","GD":"Grenada","GR":"Gr\u00e6kenland","GL":"Gr\u00f8nland","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard- og McDonald-\u00f8erne","NL":"Holland","AN":"Hollandske Antiller","HN":"Honduras","BY":"Hviderusland","IN":"Indien","ID":"Indonesien","IQ":"Irak","IR":"Iran","IE":"Irland","IS":"Island","IM":"Isle of Man","IL":"Israel","IT":"Italien","JM":"Jamaica","JP":"Japan","JE":"Jersey","JO":"Jordan","CX":"Jule\u00f8en","CV":"Kap Verde","KZ":"Kasakhstan","KE":"Kenya","CN":"Kina","KG":"Kirgisistan","KI":"Kiribati","HR":"Kroatien","KW":"Kuwait","LA":"Laos","LS":"Lesotho","LV":"Letland","LB":"Libanon","LR":"Liberia","LY":"Libyen","LI":"Liechtenstein","LT":"Litauen","LU":"Luxembourg","MG":"Madagaskar","MW":"Malawi","MY":"Malaysia","MV":"Maldiverne","ML":"Mali","MT":"Malta","MA":"Marokko","MH":"Marshall\u00f8erne","MQ":"Martinique","MR":"Mauretanien","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Mikronesiens Forenede Stater","MC":"Monaco","MN":"Mongoliet","ME":"Montenegro","MS":"Montserrat","MZ":"Mozambique","MM":"Myanmar","NA":"Namibia","NR":"Nauru","NP":"Nepal","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","KP":"Nordkorea","MP":"Nordmarianerne","NF":"Norfolk Island","NO":"Norge","NC":"Ny Caledonien","OM":"Oman","PK":"Pakistan","PW":"Palau","PA":"Panama","PG":"Papua Ny Guinea","PY":"Paraguay","PE":"Peru","PN":"Pitcairn","PL":"Polen","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","MK":"Republikken Makedonien","MD":"Republikken Moldova","RE":"Reunion","RO":"Rum\u00e6nien","RU":"Rusland","RW":"Rwanda","HK":"SAR Hongkong","MO":"SAR Macao","BL":"Saint Barth\u00e9lemy","KN":"Saint Kitts og Nevis","LC":"Saint Lucia","MF":"Saint Martin","PM":"Saint Pierre og Miquelon","SB":"Salomon\u00f8erne","WS":"Samoa","SM":"San Marino","ST":"Sao Tome og Principe","SA":"Saudi-Arabien","CH":"Schweiz","SN":"Senegal","RS":"Serbien","CS":"Serbien og Montenegro","SC":"Seychellerne","SL":"Sierra Leone","SG":"Singapore","SK":"Slovakiet","SI":"Slovenien","SO":"Somalia","GS":"South Georgia og De Sydlige Sandwich\u00f8er","ES":"Spanien","LK":"Sri Lanka","SH":"St. Helena","VC":"St. Vincent og Grenadinerne","GB":"Storbritannien","SD":"Sudan","SR":"Surinam","SJ":"Svalbard og Jan Mayen","SE":"Sverige","SZ":"Swaziland","ZA":"Sydafrika","KR":"Sydkorea","SY":"Syrien","TJ":"Tadsjikistan","TW":"Taiwan","TZ":"Tanzania","TD":"Tchad","TH":"Thailand","TL":"Timor-Leste","CZ":"Tjekkiet","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad og Tobago","TN":"Tunesien","TM":"Turkmenistan","TC":"Turks- og Caicos\u00f8erne","TV":"Tuvalu","TR":"Tyrkiet","DE":"Tyskland","US":"USA","UG":"Uganda","ZZ":"Ukendt eller ugyldigt omr\u00e5de","UA":"Ukraine","HU":"Ungarn","UY":"Uruguay","UZ":"Usbekistan","VU":"Vanuatu","VA":"Vatikanstaten","VE":"Venezuela","EH":"Vestsahara","VN":"Vietnam","WF":"Wallis og Futuna\u00f8erne","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe","AX":"\u00c5land","GQ":"\u00c6kvatorialguinea","AT":"\u00d8strig"
                },
                "WORKFLOW": {
                  "TASK": {
                    "PRIORITY": {
                      "1": "Høj", "2": "Middel", "3": "Lav"
                    },
                      "STATUS": {
                      "NotYetStarted": "Ikke begyndt", "InProgres": "Igangværende", "OnHold": "Sat på pause", "Cancelled": "Annulleret", "Completed": "Færdiggjort"
                    }
                  }
                }
              }
            },
            "files": [{
              "src": 'app/src/i18n/draft_da.json',
              "dest": 'app/src/i18n/draft_da.json'
            }]
          }
        }
        
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.loadNpmTasks('grunt-angular-translate');
    grunt.loadNpmTasks('grunt-json-replace');
    
    grunt.registerTask('local', ['bower', 'configureProxies:localhost', 'connect:localhost', 'watch:dev']);
    grunt.registerTask('dev', ['bower', 'configureProxies:test', 'connect:test', 'watch:dev']);
    grunt.registerTask('demo-dev', ['bower', 'configureProxies:demo', 'connect:demo', 'watch:dev']);
    grunt.registerTask('update-lang', ['i18nextract', 'json-replace:en', 'json-replace:da']);
    grunt.registerTask('default', []);
    
};
