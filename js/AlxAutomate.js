var OP			= require( './operators.js' )
  , AlxEvents	= require( './AlxEvents.js' )
  ;

//
function AlxAutomate(jsonDescr) {
	if(jsonDescr) {this.init(jsonDescr);}
	return this;
}

AlxAutomate.prototype = Object.create( {} );
AlxAutomate.prototype.constructor = AlxAutomate;
AlxEvents(AlxAutomate);

AlxAutomate.prototype.init		= function(jsonDescr) {
	this.automate = jsonDescr;
	this.setSate( jsonDescr.initialState );
	return this;
}

AlxAutomate.prototype.setSate	= function(stateName) {
	var i, transitions, eventSrc;
	if(this.currentState) {
		 // Unsubscribe rom previous transitions
		 transitions = this.automate.states[this.currentState].transitions;
		 for(i=0; i<transitions.length; i++) {
			 eventSrc = transitions[i].eventSrc || this.automate.eventSrc;
			 eventSrc.off(transitions[i].eventName, transitions[i].callback);
			}
		}
	transitions = this.automate.states[stateName].transitions;
	for(i=0; i<transitions.length; i++) {
		 // Subscribe to transitions
		 eventSrc = transitions[i].eventSrc || this.automate.eventSrc;
		 transitions[i].callback = transitions[i].callback || this.getCallBackForTransition(transitions[i])
		 eventSrc.on(transitions[i].eventName, transitions[i].callback);
		}
	this.currentState = stateName;
	return this;
}

AlxAutomate.prototype.getCallBackForTransition	= function(transition) {
	var self = this;
	return function(event) {
		 if( OP[transition.op](event.value, transition.value) ) {
			 self.emit('leave_' + self.currentState, {transition: transition});
			 self.setSate(transition.state)
			 self.emit('enter_' + self.currentState, {transition: transition});
			}
		};
}

AlxAutomate.prototype.whichStateIfActiobn			= function(actionName) {
	var i
	  , transitions = this.automate.states[this.currentState].transitions
	  , eventName, value;
	if(this.actions[actionName]) {
		 eventName	= this.actions[actionName].eventName;
		 value		= this.actions[actionName].value;
		 for(i=0; i<transitions.length; i++) {
			 if(  transitions[i].eventName === eventName
			   && OP[transitions[i].op](value, transitions[i].value) ) {return transitions[i].state;}
			}
		}
	return this.currentState;
}

AlxAutomate.prototype.goingToState					= function(stateName) {
	/*var L = []
	  , s = this.currentState;*/
	
	// Find the shortest actions path to go to stateName from currentState
	
	return null;
}

 /*
    { initialState	: "INIT"
	, states	: { INIT	: { transitions : [ {state: 'PLAYING', eventName: 'TransportState', op: 'equal', value: 'PLAYING'}
											  , {state: 'STOPPED', eventName: 'TransportState', op: 'equal', value: 'STOPPED'}
											  , {state: 'PAUSED' , eventName: 'TransportState', op: 'equal', value: 'PAUSED_PLAYBACK'}
											  ]
							  }
				  , PLAYING	: { enter		: {action: {}}
							  , transitions	: [ {state: 'STOPPED', eventName: 'TransportState', op: 'equal', value: 'STOPPED'}
											  , {state: 'PAUSED' , eventName: 'TransportState', op: 'equal', value: 'PAUSED_PLAYBACK'}
											  ]
							  }
				  , STOPPED	: { enter		: {action: {}}
							  , transitions	: [ {state: 'PLAYING', eventName: 'TransportState', op: 'equal', value: 'PLAYING'}
											  , {state: 'PAUSED' , eventName: 'TransportState', op: 'equal', value: 'PAUSED_PLAYBACK'}
											  ]
							  }
				  , PAUSED	: { enter		: {action: {}}
							  , transitions	: [ {state: 'STOPPED', eventName: 'TransportState', op: 'equal', value: 'STOPPED'}
											  , {state: 'PLAYING', eventName: 'TransportState', op: 'equal', value: 'PLAYING'}
											  ]
							  }
				  }
	, events	: [ 'PLAYING', 'STOPPED', 'PAUSED']
	, eventSrc	: null // self...
	, actions	: { PLAY	: {eventName: 'TransportState', value:'PLAYING'			}
				  , STOP	: {eventName: 'TransportState', value:'STOPPED'			}
				  , PAUSED	: {eventName: 'TransportState', value:'PAUSED_PLAYBACK'	}
				  }
	}
 */

 
module.exports = AlxAutomate;

