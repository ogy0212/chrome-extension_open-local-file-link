// 元のサイトにて、下記イベントを発火してやればよい。
// var event = new CustomEvent('chromeOpen', {
// 	detail: {
// 		url: url
// 	}
// });
// window.dispatchEvent(event);

window.addEventListener('chromeOpen', evt => {
	console.log('event captured!');

	const url = evt.detail.url;
	if (url.startsWith('file://')) {
		evt.preventDefault();
		// 拡張が再読み込みされた場合エラーになるので捕捉
		// Catch the error for the extension is reloaded.
		try {
			chrome.runtime.sendMessage({
				method: 'openLocalFile',
				localFileUrl: url,
			});
		} catch (e) {}
	}
});