let embeds = [];
let activeIdx = null; // null = message, number = embed
let msgContent = '';

const defColor = '#5865f2'

function genId() {
    return Math.random().toString(36).slice(2, 8);
}

function defaultEmbed() {
    return { id: genId(), title: '', description: '', color: defColor, url: '', timestampString: null, thumbnailUrl: '', authorName: '', footerText: '', imageUrl: '', fieldsJson: [] };
}

function saveState() {
    localStorage.setItem('embedBuilder', JSON.stringify({ embeds, msgContent }));
}
function resetAll() {
    if (!confirm('Alles löschen? Das kann nicht rückgängig gemacht werden.')) return;
    localStorage.removeItem('embedBuilder');
    embeds = [];
    msgContent = '';
    activeIdx = null;
    renderAll();
}