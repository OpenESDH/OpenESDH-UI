
* HOW TO DO TRANSLATIONS IN OPENESDH UI *

Translations in OpenESDH UI make use of Angular Translate module (https://angular-translate.github.io/).


** How to add translatable text

If you want to add translatable text in a view file, you need to add an expression with the 'translate' filter attached.
Say you have a template file at app/src/something/view/someView.html and your code looks like this:

[

  <md-button>This needs translating</md-button>

]

You would make the button text translatable like this:

[

  <md-button>{{ 'COMMON.THIS_NEEDS_TRANSLATING' | translate }}</md-button>

]

You'll notice that this example puts the translatable string in the 'COMMON' namespace. OpenESDH UI has all its translatable strings in namespaces. 'COMMON' being the one used for common strings like 'OK', 'Cancel', etc. Other namespaces include 'CASE', 'DOCUMENT', and so on. You will typically have a namespace that relates to the app.module you are working with.

Translatable strings can also be added programmatically. See the Angular translate docs for details.


** How to prepare translations

Now that you have a bunch of view files with translatable text in them, it's time to prepare for translation. Point to your project in a terminal and use the command:

[

 $ grunt update-lang

]

Grunt will start the update-lang task and create some new files for you. These files are
/app/src/i18n/draft_en.json
/app/src/i18n/draft_da.json

Those are the *intermediate* translation files for English and Danish respectively. More languages can be added should the need arise.

Open the files and you'll notice some JSON output a bit like this:

[

  {
    "COMMON": {
        "OK": "OK",
        "CANCEL": "Cancel",
        "NEXT": "",
        "DONE": "",
    } ...
  }

]

You'll notice the namespace 'COMMON' and its strings. When the Grunt task runs, Grunt will look for {{ 'NAMESPACE.SOME_STRING' | translate }} and put them in the draft_*.json files. If the string is already found in the file along with its translation, Grunt will leave it there and just add the strings that have been created since the last time update-lang was run. Therefore you'll find both translated and empty strings in the draft_*.json file.

*IMPORTANT* Some strings are not completely present in the template files that Grunt goes through. For example, CASE.STATUS only exists as a partial string ( {{ 'CASE.STATUS.' + someVariable | translate }} ) and different statusses are added via ajax response. Our grunt task uses json-replace to add these extra dynamic strings. You can see them in gruntfile.js.


** How to add translations

In the same directory as the draft_*.json files you'll find
en.json
da.json

These are the actual translation files. The reason why grunt udate-lang doesn't output to these files directly is that this would remove any manual fixes.

The translating process would be something like this (for English translation):

1. Open newly updated draft_en.json
2. Look for empty strings ("") in draft_en.json and add translations there
4. Clear en.json and copy all data from draft_en.json to en.json.

When this is done, you need only refresh your browser to see the new translations in action!
