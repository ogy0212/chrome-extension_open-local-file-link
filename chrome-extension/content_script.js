
document.body.addEventListener("click", function (evt) {
	// ユーザーの操作によるイベントならisTrusted == true
	// Chrome 46.0～
	// https://developer.mozilla.org/ja/docs/Web/API/Event/isTrusted
	if (!evt.isTrusted) return;
	var target = evt.target;
	while (target.parentNode && target.tagName !== "A") {
		target = target.parentNode;
	}
	if (target.tagName === "A") {
		var path = target.href;
		if (path.lastIndexOf("file://", 0) === 0) {
			evt.preventDefault();
			// 拡張が再読み込みされた場合エラーになるので捕捉
			try {
				chrome.runtime.sendMessage({
					method: "openLocalFile",
					path: path
				});
			} catch (e) {}
		}
	}
});

var Button = {
	LEFT: 0,
	MIDDLE: 1,
	RIGHT: 2
};

// <pre>, <p>, <code>にlocalファイルのパスが書かれている場合にリンクにする
(function () {
	"use strict";
	var className = "chrome-extension-" + chrome.runtime.id + "-local-file-link";
	
	var style = document.createElement("style");
	style.appendChild(document.createTextNode(`
		.${className} {
			cursor: pointer;
			text-decoration: underline;
		}
		.${className}:hover {
			text-decoration: none;
		}
	`));
	(document.head || document.body).appendChild(style);

	Array.prototype.forEach.call(document.querySelectorAll("pre, p, code"), function (elem) {
		var text = elem.innerText.replace(/^\s*(.*)\s*$/, function (all, m1) {
			return m1;
		}).replace(/^"(.*)"$/, function (all, m1) {
			return m1;
		});
		if (/^\\\\[^\r\n]+$/.test(text)) {
			elem.classList.add(className);
			elem.title = "クリック（左/中）でローカルファイルを開く\nby Chrome拡張：ローカルファイルリンク有効化";
			elem.addEventListener("mousedown", function (evt) {
				var button = evt.button;
				if (button === Button.LEFT || button === Button.MIDDLE) {
					evt.preventDefault();
					chrome.runtime.sendMessage({
						method: "openLocalFile",
						path: "file:" + text
					});
				}
			});
		}
	});
})();
