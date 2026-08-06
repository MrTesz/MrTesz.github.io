function selectMsg() {
    activeIdx = null;
    renderSidebar();
    renderEditorPanel();
}

function selectEmbed(i) {
    activeIdx = i;
    renderSidebar();
    renderEditorPanel();
}

function renderSidebar() {
    const msgItem = document.getElementById('msgNavItem');
    msgItem.className = 'msg-item' + (activeIdx === null ? ' active' : '');

    const list = document.getElementById('embedList');
    list.innerHTML = '';
    embeds.forEach((e, i) => {
        const item = document.createElement('div');
        item.className = 'embed-item' + (i === activeIdx ? ' active' : '');
        item.innerHTML = `
      <div class="embed-color-dot" style="background:${e.color}"></div>
      <span class="embed-item-label">${esc(e.title || 'Embed ' + (i + 1))}</span>
      <button class="embed-item-del" title="Löschen" onclick="removeEmbed(${i}, event)">✕</button>
    `;
        item.addEventListener('click', () => selectEmbed(i));
        list.appendChild(item);
    });
}

function addEmbed() {
    if (embeds.length >= 10) {
        confirm("Du kannst nicht mehr als 10 Embeds hinzufügen")
        return;
    }

    embeds.push(defaultEmbed());
    selectEmbed(embeds.length - 1);

    saveState();
}

function removeEmbed(i, ev) {
    ev.stopPropagation();
    embeds.splice(i, 1);
    if (activeIdx >= embeds.length) activeIdx = embeds.length > 0 ? embeds.length - 1 : null;
    renderAll();

    saveState();
}