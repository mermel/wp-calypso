/**
 * External dependencies
 */
import takeRight from 'lodash/takeRight';

/**
 * Internal dependencies
 */
import {
	GUIDED_TOUR_SHOW,
	GUIDED_TOUR_UPDATE,
	THEMES_RECEIVE,
	PREVIEW_IS_SHOWING,
	SET_SECTION,
} from 'state/action-types';

const isDesignRoute = ( { path } ) => 0 === path.indexOf( '/design' );

const relevantTypes = {
	GUIDED_TOUR_SHOW,
	GUIDED_TOUR_UPDATE,
	THEMES_RECEIVE,
	PREVIEW_IS_SHOWING,
	ROUTE_SET: isDesignRoute,
	SET_SECTION,
};

const isRelevantAction = ( action ) =>
	relevantTypes.hasOwnProperty( action.type ) &&
	( typeof relevantTypes[ action.type ] !== 'function' ||
		relevantTypes[ action.type ]( action ) );

const newAction = ( action ) => ( {
	...action, timestamp: Date.now()
} );

const maybeAdd = ( state, action ) =>
	action
		? takeRight( [ ...state, action ], 50 )
		: state;

export default ( state = [], action ) =>
	isRelevantAction( action )
		? maybeAdd( state, newAction( action ) )
		: state;
