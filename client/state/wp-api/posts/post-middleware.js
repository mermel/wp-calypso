import get from 'lodash/get';
import isFunction from 'lodash/isFunction';

import wpcom from 'lib/wp';

import {
	REQUIRE_POST
} from 'state/action-types';

const fetchPost = store => ( { siteId, postId } ) => {
	wpcom
		.site( siteId )
		.post( postId )
		.get()
		.then( savePost )
		.catch( failPost );
};

const relevantActionTypes = {
	[ REQUIRE_POST ]: fetchPost
};

export const postMiddleware = store => next => action => {
	const handler = get( relevantActionTypes, action.type );

	return isFunction( handler )
		? handler( store )( action )
		: next( action );
};

export default postMiddleware;
