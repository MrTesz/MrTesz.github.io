export default function init(document) {
    fetch("/global/footer.html")
        .then(r => r.text())
        .then(html => document.getElementById("footer-container").innerHTML = html);

//    if ('serviceWorker' in navigator)
//        navigator.serviceWorker.register('/sw.js');
}