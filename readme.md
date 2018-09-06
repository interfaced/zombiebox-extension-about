
Integration
-------

Add code like this to your application.js

```javascript

/**
 * @inheritDoc
 */
yourApp.Application.prototype.processKey = function(zbKey, e) {
	zb.popups.About.processKey(zbKey);

	return goog.base(this, 'processKey', zbKey, e);
};
```
