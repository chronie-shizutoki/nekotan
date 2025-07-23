// Confirm that all fonts and resources have been loaded
window.addEventListener('load', function() {
    document.fonts.ready.then(function () {
        document.body.style.opacity = '1';
    });
});
