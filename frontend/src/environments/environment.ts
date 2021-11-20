// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  // wsEndpoint: 'wss://masternet-explorer.beam.mw/ws/explorer/',
  wsEndpoint: 'wss://testnet.imperiumprotocol.com/ws/explorer/',
  reconnectInterval: 2000,
  // apiBaseUrl: 'https://masternet-explorer.beam.mw',
  apiBaseUrl: 'https://testnet.imperiumprotocol.com',
  apiBaseFaucetUrl: 'https://testnet.imperiumprotocol.com',
  envTitle: 'masternet',
  reCAPTCHA: '6Lc4oQMaAAAAAGC66NuYvF_ZJbK6UEw1czgESJpr',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
