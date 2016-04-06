var Pnode = require( "../../Pnode.js" );

var SelectorNode_Brick = function(scope) {
	Pnode.apply(this, [scope]);
	Object.setPrototypeOf(this, SelectorNode_Brick.prototype);
	this.brick = this.context.bricks[ this.instruction.selector.objectId ];
	console.log( "new SelectorNode_Brick", this.brick);
}

SelectorNode_Brick.prototype 				= Object.create( Pnode.prototype );
SelectorNode_Brick.prototype.constructor 	= SelectorNode_Brick;
SelectorNode_Brick.prototype.type 			= Pnode.prototype.type.slice();
SelectorNode_Brick.prototype.type.push( 'SelectorNode_Brick' );
SelectorNode_Brick.prototype.toJSON 		= function() {
	var json = Pnode.prototype.toJSON.apply(this, []);
	return json;
}
SelectorNode_Brick.prototype.appendSelector	= function(obj) {
	console.log( this, "SelectorNode_Brick::appendSelector", obj );
}

require( "./SelectorNode_Brick.css" );
module.exports = {
	controller	: SelectorNode_Brick,
	template	: require( "./SelectorNode_Brick.html" )
};

/* JSON of a selector
	+ selector.name		: string
	+ selector.type		: type of the selector
// JSON of a brick selector
	+ selector.objectId	: server identifier of the brick
*/

/*
PASSER EN REFERENCE LE CONTEXTE POUR LES INSTRUCTIONS ET LES SELECTEUR
DE SORTE A AVOIR ACCES A LA LISTE DES BRIQUES DISPONIBLES !!!*/