# zombiebox-extension-about

[ZombieBox](https://zombiebox.tv) extension for displaying main info about an application.

## Usage

The extension provides popup `zb.popups.About` that should be integrated to the application. To do this, call `zb.popups.About.processKey` with the given key in main `processKey` method:

```js
goog.provide('my.Application');
goog.require('my.BaseApplication');
goog.require('zb.popups.About');

/**
*/
my.Application = class extends my.BaseApplication {
    /**
     * @override
     */
    processKey(zbKey, e) {
	    zb.popups.About.processKey(zbKey);

	    return super.processKey(zbKey, e);
	}
}
```

To display the information about the application press `1235789` (like `Z`) on the remote.

## Custom key sequence

The default key sequence can be changed by calling `zb.popups.About.setKeySequence` method:

```js
zb.popups.About.setKeySequence([
	zb.device.input.Keys.DIGIT_1,
	zb.device.input.Keys.DIGIT_2,
	zb.device.input.Keys.DIGIT_3,
]);
```

## Passing custom information

There is an ability to customize the displayed information. To do this, call  `zb.popups.About.setCustomDataProvider` with a new function-provider:

```js
zb.popups.About.setCustomDataProvider((defaultData) => {
	defaultData['apiVersion'] = app.getApiVersion();
	
	return defaultData;
});
```

**Note**: a new key must be defined by bracket notation.