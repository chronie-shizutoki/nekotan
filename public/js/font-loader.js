// すべてのフォントとリソースがロードされたことを確認する
window.addEventListener('load', function() {
    document.fonts.ready.then(function () {
        document.body.style.opacity = '1';
    });
});
