/**
 * Internal dependencies
 */
import {
	isServiceWorkerSupported,
} from 'lib/service-worker';
import bumpStat from 'state/analytics/actions';

export function isUnsupportedChromeVersion() {
	if ( window && window.chrome && window.navigator.appVersion ) {
		const chromeVersion = window.navigator.appVersion.match( /Chrome\/(\d+)/ )[ 1 ];
		if ( chromeVersion < 50 ) {
			bumpStat( 'calypso_push_notif_unsup_chrome', chromeVersion );
			return true;
		}
	}
	return false;
}

export function isPushNotificationsSupported() {
	return (
		isServiceWorkerSupported() &&
		! isUnsupportedChromeVersion() &&
		'showNotification' in window.ServiceWorkerRegistration.prototype &&
		'PushManager' in window
	);
}

export function isPushNotificationsDenied() {
	return (
		( ! ( 'Notification' in window ) ) ||
		'denied' === window.Notification.permission
	);
}
