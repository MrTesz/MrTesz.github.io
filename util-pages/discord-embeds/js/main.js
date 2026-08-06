function esc(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderAll() {
    renderSidebar();
    renderEditorPanel();
    renderPreview();
}

document.getElementById('modalOverlay').addEventListener('click', function(ev) {
    if (ev.target === this) closeModal();
});

const saved = localStorage.getItem('embedBuilder');
if (saved) {
    const data = JSON.parse(saved);
    embeds = data.embeds || [];
    msgContent = data.msgContent || '';
}

renderAll();