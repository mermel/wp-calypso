/**
 * External dependencies.
 */

var boot = require( 'boot' ),
	http = require( 'http' ),
	chalk = require( 'chalk' );

/**
 * Internal dependencies
 */
var pkg = require( './package.json' ),
	config = require( 'config' );

var start = Date.now(),
	port = process.env.PORT || 3000,
	host = process.env.HOST || config( 'hostname' ),
	app = boot(),
	server,
	compiler,
	hotReloader;

console.log( chalk.yellow( '%s booted in %dms - http://%s:%s' ), pkg.name, ( Date.now() ) - start, host, port );
console.info( chalk.cyan( '\nGetting bundles ready, hold on...' ) );

server = http.createServer( app );

// The desktop app runs Calypso in a fork.
// Let non-forks listen on any host.
if ( ! process.env.CALYPSO_IS_FORK ) {
	host = null;
}

server.listen( { port, host }, function() {
	// Tell the parent process that Calypso has booted.
	process.send( { boot: 'ready' } );
} );

// Enable hot reloader in development
if ( config( 'env' ) === 'development' ) {
	hotReloader = require( 'bundler/hot-reloader' );
	compiler = app.get( 'compiler' );

	compiler.plugin( 'compile', function() {
		process.send( { boot: 'compiler compiling' } );
	} );
	compiler.plugin( 'invalid', function() {
		process.send( { boot: 'compiler invalid' } );
	} );
	compiler.plugin( 'done', function() {
		process.send( { boot: 'compiler done' } );
	} );

	hotReloader.listen( server, compiler );
}
