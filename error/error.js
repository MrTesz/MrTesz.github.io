export default function init(document) {
    fetch("/global/footer.html")
        .then(r => r.text())
        .then(html => document.getElementById("footer-container").innerHTML = html);

    const params = new URLSearchParams(location.search);
    const url = params.get('from');

    const actionButton = document.getElementById("action-button");
    actionButton.addEventListener("click", () => {
        if (url !== null)
            window.location.href = url
        else
            window.location.href = window.location.origin
    })
}