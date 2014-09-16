matryoshka__mainMenu__toggleMenu = function() {
	var menuEl = $('.matryoshka__mainMenu__menu-container');
	menuEl.toggleClass('matryoshka__mainMenu__menu-container--visible');
};

// This function is for triggering the filter
// using key M
onBodyKeyUpEvents.push(function(e) {
	if (e.keyCode === 77) { matryoshka__mainMenu__toggleMenu(); }
});

Template.matryoshka__mainMenu.events({
	'click .matryoshka__mainMenu__button-show-menu': function (e) {
		matryoshka__mainMenu__toggleMenu();
	},
	'click .matryoshka__mainMenu__button-home': function (e) {
		Matryoshka.currentNestable.reset();
		Router.go('matryoshka__home');
	},
	'click .matryoshka__mainMenu__button-logout': function (e) {
		if (!confirm('Do you really want to log out?')) return;
		Meteor.logout();
	},
	'click a': function (e) {
		matryoshka__mainMenu__toggleMenu();
	},
	'click .matryoshka__mainMenu__button-filter': function (e) {
		Matryoshka.filter.toggle();
	}
});

Template.matryoshka__mainMenu.helpers({
	activeMenuLink: function () {
		// If the current links _id is the same as the current route, mark it as active
		if (this._id === Router.current().params._id)
			return 'matryoshka__mainMenu__menu-container__col__link--active';
	},
	mainMenuButtons: function () {
		return matryoshka__UIbuttons.mainMenu;
	},
	menuItems: function () {
		var sort = {};
		sort.matryoshkaName = 1;
		var currentMenuItems = MatryoshkaNestables.find({ type: this.name, matryoshkaStatus: 'editable' }, { sort: sort }).fetch();
		return Matryoshka.filter.filterCollection( currentMenuItems, ['matryoshkaName'] );
	},
	menuKey: function ( context ) {
		return this.matryoshkaName;
	},
	nestables: function() {
		var nestables = _.chain(Matryoshka.nestables[this.name])
		.where({ nestableCreateable: true })
		.sortBy(function(nestable) { return nestable.nestableNameReadable; })
		.value();
		return Matryoshka.filter.filterCollection( nestables, ['nestableNameReadable', 'nestableName'] );
	}
});
