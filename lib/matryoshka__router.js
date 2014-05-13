Router.onBeforeAction(function () {
	// TODO: This is not super clean.
	if (Matryoshka.loginRequired) {
		if (!Meteor.userId) Router.go('matryoshka__loginRoute');
		if (!Meteor.userId()) Router.go('matryoshka__loginRoute');
	}
}, { except: ['matryoshka__loginRoute'] });

// This bool is for check if we've already bound the keyup events
// to the body class or not (we don't want to do this multiple times)
bodyKeyupEventsBound = false;

MatryoshkaController = RouteController.extend({
	waitOn: function () {
		return Meteor.subscribe('matryoshkaNestablePartsForMenu');
	},
	onAfterAction: function () {

		// Add the matryoshka body class
		$('body').addClass('matryoshka__body');

		// If we haven't already, attach the keyup events which has been set throughout
		// the application.
		if (bodyKeyupEventsBound) return;
		$('.matryoshka__body').bind('keyup', function (e) {
			// Make sure the event only fires when the users target is the actual body
			if (!$(e.target).hasClass('matryoshka__body')) return;
			// Bind all the events which has been added to the onBodyKeyUpEvents array...
			_.each(onBodyKeyUpEvents, function(f) { f(e); });
			// ...and now we've bound all the events! Don't do that agin please.
			bodyKeyupEventsBound = true;
		});
	}
});


Router.map(function () {

	this.route('matryoshka__loginRoute', {
		path: '/matryoshka/login',
		template: 'matryoshka__login',
		controller: MatryoshkaController
	});

	this.route('matryoshka__home', {
		path: '/matryoshka/',
		layoutTemplate: 'matryoshka__rootContainer',
		template: 'matryoshka__firstPageTemplate',
		controller: MatryoshkaController,
		onBeforeAction: function () {
			console.log('here');
			// If the user has created her own custom first page,
			// use it instead of the default one.
			if (Template.matryoshka__firstPageTemplateCustom)
				this.template = 'matryoshka__firstPageTemplateCustom';
		}
	});

	this.route('matryoshka', {
		path: '/matryoshka/:action?/:_id?/:secondAction?/:secondActionParam?',
		layoutTemplate: 'matryoshka__rootContainer',
		template: 'matryoshka__partLooper',
		controller: MatryoshkaController,
		data: function() {

			console.log('matryoshka: called data');

			if (!Session.get('matryoshkaCurrentNestable') && this.params._id) {
				var nestableToEdit = MatryoshkaNestables.findOne({ _id: this.params._id });
				console.log('in data: setting new session: matryoshkaCurrentNestable');
				Session.set('matryoshkaCurrentNestable', nestableToEdit );
			}

			if (Session.get('matryoshkaCurrentNestable'))
				return Session.get('matryoshkaCurrentNestable');

		},
		waitOn: function () {

			console.log('matryoshka: called waitOn');

			if (this.params.action === 'edit' && this.params._id) {
				// Reset this session if we're here
				console.log('Resetting session: matryoshkaCurrentNestable');
				Session.set('matryoshkaCurrentNestable', false );
				return Meteor.subscribe('matryoshkaNestableFromId', this.params._id );
			}

			return ;

		},
		unload: function () {
			Session.set('matryoshkaCurrentNestable', false );
		}
	});

});
