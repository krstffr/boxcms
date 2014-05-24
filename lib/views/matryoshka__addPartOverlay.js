Template.matryoshka__addPartOverlay.helpers({
	nestableTypes: function () {

		if (!Session.get('matryoshka__addPartOverlay')) return;

		// This is the object set from the button press
		var parentNestable = Session.get('matryoshka__addPartOverlay');

		// Get the defined nestable type from the Matryoshka object
		var nestableType = Matryoshka.nestables[parentNestable.type];

		var nestable = _(nestableType).findWhere({ nestableName: parentNestable.nestableName });

		return nestable.nestables;

	},
	nestables: function() {

		if (!Session.get('matryoshka__addPartOverlay')) return;

		var nestableNamesToFilter = this.nestables;
		var allNestables = Matryoshka.nestables[this.name];

		if (typeof nestableNamesToFilter !== 'object') return allNestables;

		var filteredNestables = _(allNestables).map( function( nestable ) {
			if ( nestableNamesToFilter.indexOf( nestable.nestableName ) > -1 )
				return nestable;
		});

		return _(filteredNestables).compact();

	},
	matryoshkaId: function() {

		if (!Session.get('matryoshka__addPartOverlay')) return;

		return Session.get('matryoshka__addPartOverlay').matryoshkaId;

	}
});

Template.matryoshka__addPartOverlay.events({
	'click .add-part': function (e) {

		e.stopImmediatePropagation();

		var defaultNewObject = {
			matryoshkaId: Matryoshka.nestablePart.generateId(),
			creationDate: new Date()
		};
		var clickedBtn = $(e.currentTarget);
		var matryoshkaId = clickedBtn.data('parent-id');
		var key = 'nestedNestables';
		var value = _.extend(this, defaultNewObject);

		var updatedSession = Matryoshka.addValueInObjectBasedOnId( Session.get('matryoshkaCurrentNestable'), matryoshkaId, 'put', key, value );

		Session.set('matryoshkaCurrentNestable', updatedSession );

		matryoshka__toggleAddPartOverlay( clickedBtn, 'hide' );

	}
});