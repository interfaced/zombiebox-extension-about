
Integration
-------

Add code like this to your application.js

```javascript
goog.require('zb.popups.About');

yourApp.Application = class extends yourApp.BaseApplication {

    /**
     * @override
     */
    processKey(zbKey, e) {
	    zb.popups.About.processKey(zbKey);

	    return super.processKey(zbKey, e);
	}
};
```
