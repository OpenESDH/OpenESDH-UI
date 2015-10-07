
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


** How to add translations

In the /app/src/i18n directory you'll find
en.json
da.json

These are the translation files.

The translating process would be something like this (for English translation):

1. Add new translation properties in ALL the translation files. If you added "CASE.TYPE.SOMETHING" in a view or controller file. You'll need to add
[

  "CASE": {
    "TYPE": {
      "SOMETHING": "Localized translation goes here"
    }
  }

]
Note: There might already be a namespace present for the property you're adding. Don't add duplicate namespaces.

2. Save your changes and refresh your browser to see the new translations in action!
