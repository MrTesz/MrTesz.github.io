let embeds = [];
let activeIdx = null; // null = message, number = embed
let msgContent = '';
let buttons = [];

const defColor = '#5865f2'
const BUTTON_STYLES = {
    PRIMARY:   { label: 'Blau',    value: 1 },
    SECONDARY: { label: 'Grau',    value: 2 },
    SUCCESS:   { label: 'Grün',    value: 3 },
    DANGER:    { label: 'Rot',     value: 4 },
    LINK:      { label: 'Link',    value: 5 }, // braucht url statt id
};

function genId() {
    return Math.random().toString(36).slice(2, 8);
}

function defaultEmbed() {
    return { id: genId(), title: '', description: '', color: defColor, url: '', timestampString: null, thumbnailUrl: '', authorName: '', footerText: '', imageUrl: '', fieldsJson: [] };
}

function saveState() {
    localStorage.setItem('embedBuilder', JSON.stringify({ embeds, msgContent, buttons }));
}
function resetAll() {
    if (!confirm('Alles löschen? Das kann nicht rückgängig gemacht werden.')) return;
    localStorage.removeItem('embedBuilder');
    embeds = [];
    buttons = [];
    msgContent = '';
    activeIdx = null;
    renderAll();
}