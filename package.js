Package.describe({
  "summary": "A GUI for nesting and linking objects inside other objects."
});

Package.on_use(function (api) {

  api.use('underscore', ['client', 'server']);
  api.use(['templating', 'handlebars', 'jquery', 'font-awesome'], 'client');

  api.add_files('lib/collections/matryoshka__nestables.js', ['server', 'client']);

  api.add_files('lib/img/matryoshka-logo.png', 'client');

  api.add_files('lib/matryoshka__methods.js', 'server');

  api.add_files('lib/matryoshka__globalHelpers.js', 'client');

  api.add_files('lib/css/stylesheets/matryoshka__main.css', 'client');

  api.add_files('lib/views/matryoshka__UImenuButtons.js', 'client');

  api.add_files('lib/views/matryoshka__firstPageTemplate.html', 'client');

  api.add_files('lib/views/matryoshka__login.html', 'client');
  api.add_files('lib/views/matryoshka__login.js', 'client');

  api.add_files('lib/views/matryoshka__fixedButton.html', 'client');
  api.add_files('lib/views/matryoshka__fixedButton.js', 'client');

  api.add_files('lib/views/matryoshka__nestablePartButtons.html', 'client');
  api.add_files('lib/views/matryoshka__nestablePartButtons.js', 'client');

  api.add_files('lib/views/matryoshka__nestableSubPartButtons.html', 'client');
  api.add_files('lib/views/matryoshka__nestableSubPartButtons.js', 'client');

  api.add_files('lib/views/matryoshka__filter.html', 'client');
  api.add_files('lib/views/matryoshka__filter.js', 'client');

  api.add_files('lib/views/matryoshka__rootContainer.html', 'client');
  api.add_files('lib/views/matryoshka__rootContainer.js', 'client');

  api.add_files('lib/views/matryoshka__mainMenu.html', 'client');
  api.add_files('lib/views/matryoshka__mainMenu.js', 'client');

  api.add_files('lib/views/matryoshka__partLooper.html', 'client');
  api.add_files('lib/views/matryoshka__partLooper.js', 'client');

  api.add_files('lib/views/matryoshka__fields.html', 'client');
  api.add_files('lib/views/matryoshka__fields.js', 'client');

  api.add_files('lib/views/matryoshka__addPartOverlay.html', 'client');
  api.add_files('lib/views/matryoshka__addPartOverlay.js', 'client');

  api.add_files('lib/matryoshka__router.js', 'client');

  api.add_files('lib/matryoshka__matryoshkaHandler.js', ['client', 'server']);

  if (typeof api.export !== 'undefined') {

    api.use(['font-awesome', 'iron-router'], 'client');

    // The main object.
    api.export('Matryoshka', ['server', 'client']);

    // The Collection where we store stuff.
    api.export('MatryoshkaNestables', ['client', 'server']);

  }

});
