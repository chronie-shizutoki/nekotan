// 确保所有字体和资源加载完成
window.addEventListener('load', function() {
    document.fonts.ready.then(function () {
        document.body.style.opacity = '1';
    });
});
