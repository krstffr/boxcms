// Method for hiding children of parents with hideChildren: true
Template.matryoshka__partLooper.rendered = function () {
	
	// First get this template data
	if (!this.data)
		return ;
	var nestableDefinedInCode = Matryoshka.nestablePart.getNestablePartData( this.data.type, this.data.nestableName );
	if (!nestableDefinedInCode)
		return ;
	if (nestableDefinedInCode.hideByDefault)
		return $(this.find('.matryoshka__nestable__container')).addClass('matryoshka__nestable__container--hidden');

	// If the part should not hide itself, check if parent should hide all children
	var parentData = Template.parentData(2);
	if (!parentData)
		return ;
	var parentNestableDefinedInCode = Matryoshka.nestablePart.getNestablePartData( parentData.type, parentData.nestableName );
	if (parentNestableDefinedInCode.hideChildren)
		return $(this.find('.matryoshka__nestable__container')).addClass('matryoshka__nestable__container--hidden');
	
};

Template.matryoshka__partLooper.helpers({
	getNestableValue: function ( key ) {
		var nestableDefinedInCode = Matryoshka.nestablePart.getNestablePartData( this.type, this.nestableName );
		if ( nestableDefinedInCode && nestableDefinedInCode[key] )
			return nestableDefinedInCode[key];
		return '';
	},
	nestableFirstFieldValue: function () {
		// Return the value of the field/key which is defined FIRST by the user
		// in the matryoshka setup.
		var nestableDefinedInCode = Matryoshka.nestablePart.getNestablePartData( this.type, this.nestableName );
		// If there is no nestableDefinedInCode or there are no fields, do nothing.
		if (!nestableDefinedInCode || nestableDefinedInCode.fields.length < 1)
			return ;
		var firstKey = nestableDefinedInCode.fields[0].name;
		var firstValue = this[firstKey];
		if (firstValue) {
			
			// So, if it's a linked id we're returning, return the actual name of that nestable instead of the id
			if ( firstKey === 'nestableToLinkId' )
				return '- '+Matryoshka.nestablePart.getValueFromForeignDoc( firstValue, 'matryoshkaName' );

			// Else just return the value
			return '– '+firstValue;

		}
		return ;
	},
	nestables: function() {
		// Return the nestables from "code" instead of the object
		if (!this.type)
			return false;
		
		var nestableDefinedInCode = Matryoshka.nestablePart.getNestablePartData( this.type, this.nestableName );

		if (nestableDefinedInCode)
			return nestableDefinedInCode.nestables;

	},
	fields: function () {
		var nestableDefinedInCode = Matryoshka.nestablePart.getNestablePartData( this.type, this.nestableName );
		if (!nestableDefinedInCode)
			return ;

		// Also we need the matryoshka name for some nestables!
		if ( this.matryoshkaName && !_(nestableDefinedInCode.fields).findWhere({ name: 'matryoshkaName' }) ) {
			nestableDefinedInCode.fields.unshift({
				name: 'matryoshkaName',
        type: 'text',
        description: 'The name only visible in Matryoskha (for use in the menus etc.)'
      });
		}

		return nestableDefinedInCode.fields;
	},
	fieldsTypeSpecific: function () {

		var nestableDefinedInCode = Matryoshka.nestablePart.getNestablePartData( this.type, this.nestableName );
		if (!nestableDefinedInCode)
			return ;

		var context = this;

		return _
		.chain( nestableDefinedInCode.fieldsTypeSpecific )
		.map( function( fieldType ) { if (context[ fieldType.name ]) return fieldType[ context[ fieldType.name ] ]; })
		.flatten()
		.value();

	},
	recurse: function () {
		// Return this template but with the new context
		return Template.matryoshka__partLooper;
	},
	nestableGetCssClasses: function ( context ) {
		
		// Make sure we have the nesatble as it's defined in the code
		var nestableDefinedInCode = Matryoshka.nestablePart.getNestablePartData( this.type, this.nestableName );
		if (!nestableDefinedInCode || !nestableDefinedInCode.fields)
			return ;

		var thisNestable = this;
		var fieldsWhichOutputCss = _( _(nestableDefinedInCode.fields).where({ cssOutputValueAsClass: true }) ).map( function( field ) { return field.name; });
		var cssToReturn = '';
		// Loop over all the keys/values and add them to the string which will be returned
		_.each(fieldsWhichOutputCss, function( field ) {
			cssToReturn += 'matryoshkaCssClass--'+field+'--'+thisNestable[field]+' ';
		});
		return cssToReturn;
	}
});

// This function handles text input changes.
var handleTextInputChange = function ( e, context, parentContext ) {

	var input = $(e.currentTarget);
	var value = input.val();
	var matryoshkaId = parentContext.matryoshkaId;
	var key = context.name;

	// If {number: true} then make sure we store a number
	if (context.number) {
		value = value.replace(/,/g, '.');
		value = parseFloat(value, 10);
	}

	var updatedSession = Matryoshka.nestables.modifyNestableBasedOnId( Session.get('matryoshkaCurrentNestable'), matryoshkaId, 'put', key, value );

	Session.set('matryoshkaCurrentNestable', updatedSession );

};

Template.matryoshka__partLooper.events({
		'click .matryoshka__nestable__container__col--left': function ( e ) {

			e.stopImmediatePropagation();

			var clickedEl = $(e.currentTarget);
			var parentToHide = clickedEl.closest('.matryoshka__nestable__container');

			parentToHide.toggleClass('matryoshka__nestable__container--hidden');

		},
		'change .matryoshka-save-on-select': function ( e ) {

				e.stopImmediatePropagation();

				var parentContext = Template.parentData(0);
				var input = $(e.currentTarget);
				var value = input.val();
				var matryoshkaId = parentContext.matryoshkaId;
				var key = this.name;
				var updatedSession = Session.get('matryoshkaCurrentNestable');
				var nestableDefinedInCode = Matryoshka.nestablePart.getNestablePartData( this.type, this.nestableName );

				// Check if we're dealing with a selectable from a collection
				if (nestableDefinedInCode && nestableDefinedInCode.selectableData) {
						if (nestableDefinedInCode.selectableData.type === 'collection') {
								// Get the _id from the selected <option> and get the collection-id from it
								// Save it in the Session!
								var selectedOption = input.find('option:selected');
								var collectionId = selectedOption.data('collection-id');
								updatedSession = Matryoshka.nestables.modifyNestableBasedOnId( updatedSession, matryoshkaId, 'put', 'collection-id', collectionId );
						}
				}

				updatedSession = Matryoshka.nestables.modifyNestableBasedOnId( updatedSession, matryoshkaId, 'put', key, value );

				Session.set('matryoshkaCurrentNestable', updatedSession );

		},
		'blur .matryoshka-save-on-blur': function (e) {

				e.stopImmediatePropagation();

				var context = this;
				var parentContext = Template.parentData(0);

				handleTextInputChange( e, context, parentContext );

		},
		'click .duplicate-part': function (e) {

				e.stopImmediatePropagation();

				var parentContext = Template.parentData(2);
				var objectToDuplicate = _.clone(this);
				var matryoshkaId = parentContext.matryoshkaId;
				var key = 'nestedNestables';

				// Method for updating matryoshkaId for all nested nestables inside passed nestable
				var updateAllNestableIds = function (nestable) {
						// Update the matryoshkaId if there is one to update
						if (nestable.matryoshkaId) nestable.matryoshkaId = Matryoshka.nestablePart.generateId();
						// If we have nested nestables, do the same thing to them
						_.each(nestable.nestedNestables, function (nestedNestable, index) {
								nestable.nestedNestables[index] = updateAllNestableIds(nestedNestable);
						});
						return nestable;
				};

				// We must find all the nested objects etc. and replace their matryoshkaId with new ones
				objectToDuplicate = updateAllNestableIds(objectToDuplicate);

				var updatedSession = Matryoshka.nestables.modifyNestableBasedOnId( Session.get('matryoshkaCurrentNestable'), matryoshkaId, 'put', key, objectToDuplicate, this.matryoshkaId );

				Session.set('matryoshkaCurrentNestable', updatedSession );


		},
		'click .delete-part': function (e) {

				e.stopImmediatePropagation();

				if (!confirm('Are you sure you want to remove this part?')) return ;

				var updatedSession = Matryoshka.nestables.modifyNestableBasedOnId( Session.get('matryoshkaCurrentNestable'), this.matryoshkaId, 'delete' );

				Session.set('matryoshkaCurrentNestable', updatedSession );

		},
		'click .move-part': function (e) {

				e.stopImmediatePropagation();

				var parentContext = Template.parentData(2);
				var parentMatryoshkaId = parentContext.matryoshkaId;
				var clickedBtn = $(e.currentTarget);
				var moveWhere = clickedBtn.data('moveWhere');
				var key = 'nestedNestables';

				var updatedSession = Matryoshka.nestables.modifyNestableBasedOnId( Session.get('matryoshkaCurrentNestable'), parentMatryoshkaId, 'move', key, moveWhere, this.matryoshkaId );

				Session.set('matryoshkaCurrentNestable', updatedSession );

		},
		'click .show-part-list': function (e) {

			Session.set('matryoshka__addPartOverlay', { nestableName: this.nestableName, type: this.type, matryoshkaId: this.matryoshkaId });

			$('.matryoshka__nestable__container__add-part-container--general').show();

		}
});