/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import {
	NOTICE_CREATE,
	NOTICE_REMOVE,
	POST_SAVE_SUCCESS,
	ROUTE_SET
} from 'state/action-types';
import { items } from '../reducer';

describe( 'reducer', () => {
	describe( 'items()', () => {
		it( 'should default to an empty object', () => {
			const state = items( undefined, {} );
			expect( state ).to.eql( {} );
		} );

		context( 'NOTICE_CREATE', () => {
			it( 'should properly add new notice', () => {
				const notice = { noticeId: 1, text: 'Example Notice Text' };
				const original = deepFreeze( {} );
				const state = items( original, {
					type: NOTICE_CREATE,
					notice: notice
				} );

				expect( state ).to.eql( {
					1: notice
				} );
			} );
		} );

		context( 'NOTICE_REMOVE', () => {
			it( 'should properly remove selected notice', () => {
				const original = deepFreeze( {
					1: { noticeId: 1 },
					2: { noticeId: 2 },
					3: { noticeId: 3 }
				} );
				const state = items( original, {
					type: NOTICE_REMOVE,
					noticeId: 2
				} );

				expect( state ).to.eql( {
					1: { noticeId: 1 },
					3: { noticeId: 3 }
				} );
			} );

			it( 'should return same state on remove attempt if notice not tracked', () => {
				const original = deepFreeze( {
					1: { noticeId: 1 },
					3: { noticeId: 3 }
				} );
				const state = items( original, {
					type: NOTICE_REMOVE,
					noticeId: 2
				} );

				expect( state ).to.equal( original );
			} );
		} );

		context( 'ROUTE_SET', () => {
			it( 'should remove notices on route set', () => {
				const original = deepFreeze( {
					1: { noticeId: 1 }
				} );
				const state = items( original, {
					type: ROUTE_SET
				} );

				expect( state ).to.eql( {} );
			} );

			it( 'should preserve persistent notices on route set', () => {
				const original = deepFreeze( {
					1: { noticeId: 1 },
					2: { noticeId: 2, isPersistent: true }
				} );
				const state = items( original, {
					type: ROUTE_SET
				} );

				expect( state ).to.eql( {
					2: { noticeId: 2, isPersistent: true }
				} );
			} );

			it( 'should preserve altered notice to be displayed on next page on route set', () => {
				const original = deepFreeze( {
					1: { noticeId: 1 },
					2: { noticeId: 2, displayOnNextPage: true }
				} );
				const state = items( original, {
					type: ROUTE_SET
				} );

				expect( state ).to.eql( {
					2: { noticeId: 2, displayOnNextPage: false }
				} );
			} );
		} );

		context( 'POST_SAVE_SUCCESS', () => {
			it( 'should return same state if save payload lacks status', () => {
				const original = deepFreeze( {} );
				const state = items( original, {
					type: POST_SAVE_SUCCESS,
					post: { title: 'Hello World' }
				} );

				expect( state ).to.equal( original );
			} );

			it( 'should return same state if status has no corresponding text', () => {
				const original = deepFreeze( {} );
				const state = items( original, {
					type: POST_SAVE_SUCCESS,
					post: {
						title: 'Hello World',
						status: 'invalid'
					}
				} );

				expect( state ).to.equal( original );
			} );

			it( 'should return state with single trash success', () => {
				const original = deepFreeze( {} );
				const state = items( original, {
					type: POST_SAVE_SUCCESS,
					post: { status: 'trash' }
				} );

				expect( state ).to.eql( {
					POST_SAVE_SUCCESS: {
						showDismiss: true,
						isPersistent: false,
						displayOnNextPage: false,
						status: 'is-success',
						noticeId: 'POST_SAVE_SUCCESS',
						count: 1,
						text: 'Post successfully moved to trash'
					}
				} );
			} );

			it( 'should return state with multiple trash success', () => {
				const original = deepFreeze( {
					POST_SAVE_SUCCESS: {
						showDismiss: true,
						isPersistent: false,
						displayOnNextPage: false,
						status: 'is-success',
						noticeId: 'POST_SAVE_SUCCESS',
						count: 1,
						text: 'Post successfully moved to trash'
					}
				} );
				const state = items( original, {
					type: POST_SAVE_SUCCESS,
					post: { status: 'trash' }
				} );

				expect( state ).to.eql( {
					POST_SAVE_SUCCESS: {
						showDismiss: true,
						isPersistent: false,
						displayOnNextPage: false,
						status: 'is-success',
						noticeId: 'POST_SAVE_SUCCESS',
						count: 2,
						text: '2 posts successfully moved to trash'
					}
				} );
			} );

			it( 'should return state with single publish success', () => {
				const original = deepFreeze( {} );
				const state = items( original, {
					type: POST_SAVE_SUCCESS,
					post: { status: 'publish' }
				} );

				expect( state ).to.eql( {
					POST_SAVE_SUCCESS: {
						showDismiss: true,
						isPersistent: false,
						displayOnNextPage: false,
						status: 'is-success',
						noticeId: 'POST_SAVE_SUCCESS',
						count: 1,
						text: 'Post successfully published'
					}
				} );
			} );

			it( 'should return state with multiple publish success', () => {
				const original = deepFreeze( {
					POST_SAVE_SUCCESS: {
						showDismiss: true,
						isPersistent: false,
						displayOnNextPage: false,
						status: 'is-success',
						noticeId: 'POST_SAVE_SUCCESS',
						count: 1,
						text: 'Post successfully published'
					}
				} );
				const state = items( original, {
					type: POST_SAVE_SUCCESS,
					post: { status: 'publish' }
				} );

				expect( state ).to.eql( {
					POST_SAVE_SUCCESS: {
						showDismiss: true,
						isPersistent: false,
						displayOnNextPage: false,
						status: 'is-success',
						noticeId: 'POST_SAVE_SUCCESS',
						count: 2,
						text: '2 posts successfully published'
					}
				} );
			} );
		} );
	} );
} );
