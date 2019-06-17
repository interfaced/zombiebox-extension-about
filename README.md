# zombiebox-extension-about

[ZombieBox](https://zombiebox.tv) extension for displaying main info about an application.

## Usage

The extension provides popup `About` that should be integrated to the application. To do this, call `About.processKey` with the given key in main `processKey` method:

```js
import About from 'about/about';
import BaseApplication from 'generated/zb/base-application';

/**
*/
export default class Application extends BaseApplication {
    /**
     * @override
     */
    processKey(zbKey, e) {
	    About.processKey(zbKey);

	    return super.processKey(zbKey, e);
	}
}
```

To display the information about the application press `1235789` (like `Z`) on the remote.

## Custom key sequence

The default key sequence can be changed by calling `About.setKeySequence` method:

```js
About.setKeySequence([
	Keys.DIGIT_1,
	Keys.DIGIT_2,
	Keys.DIGIT_3,
]);
```

## Passing custom information

There is an ability to customize the displayed information. To do this, call  `About.setCustomDataProvider` with a new function-provider:

```js
About.setCustomDataProvider((defaultData) => {
	defaultData['apiVersion'] = app.getApiVersion();
	
	return defaultData;
});
```

**Note**: a new key must be defined by bracket notation.
