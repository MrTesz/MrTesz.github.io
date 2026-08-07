function openExport(mode) {
    if (mode === 'cmd') {
        const json = serializeToJson();
        const cmd = `/embed-create json:${json}`;

        document.getElementById('modalTitle').textContent = 'Command Export';
        document.getElementById('modalNote').textContent = 'Direkt in Discord einfügen';
        document.getElementById('modalTextarea').value = cmd;
        document.getElementById('modalTextarea').readOnly = true;
        document.getElementById('modalActionBtn').textContent = 'Kopieren';
        document.getElementById('modalActionBtn').onclick = copyModal;
    } else {
        const json = serializeToJson();

        document.getElementById('modalTitle').textContent = 'JSON Export';
        document.getElementById('modalNote').textContent = 'Für /embed-create';
        document.getElementById('modalTextarea').value = json;
        document.getElementById('modalTextarea').readOnly = true;
        document.getElementById('modalActionBtn').textContent = 'Kopieren';
        document.getElementById('modalActionBtn').onclick = copyModal;
    }
    document.getElementById('modalOverlay').classList.add('open');
}

function openImport() {
    document.getElementById('modalTitle').textContent = 'JSON Import';
    document.getElementById('modalNote').textContent = 'Output von "Embed zu JSON" einfügen';
    document.getElementById('modalTextarea').value = '';
    document.getElementById('modalTextarea').readOnly = false;
    document.getElementById('modalActionBtn').textContent = 'Importieren';
    document.getElementById('modalActionBtn').onclick = doImport;
    document.getElementById('modalOverlay').classList.add('open');
    setTimeout(() => document.getElementById('modalTextarea').focus(), 100);
}

function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

function copyModal() {
    const btn = document.getElementById('modalActionBtn');
    const orig = btn.textContent;
    navigator.clipboard.writeText(document.getElementById('modalTextarea').value).then(ignored => btn.textContent = '✓ Kopiert!');

    setTimeout(() => btn.textContent = orig, 1500);
}

function doImport() {
    try {
        const raw = document.getElementById('modalTextarea').value.trim();
        const parsed = JSON.parse(raw);

        let arr;
        if (parsed.embeds) arr = Array.isArray(parsed.embeds) ? parsed.embeds : [parsed.embeds];
        else arr = Array.isArray(parsed) ? parsed : [parsed];

        if (parsed.content) msgContent = parsed.content;
        if (parsed.buttons) buttons = parsed.buttons.map(b => ({
            id: b.id || '',
            label: b.label || '',
            style: b.style || 1,
            url: b.url || ''
        }));

        embeds = arr.map(r => ({
            id: genId(),
            title: r.title || '',
            description: r.description || '',
            color: r.color != null ? '#' + r.color.toString(16).padStart(6, '0') : defColor,
            url: r.url || '',
            timestampString: r.timestampString || null,
            thumbnailUrl: r.thumbnailUrl || '',
            authorName: r.authorName || '',
            footerText: r.footerText || '',
            imageUrl: r.imageUrl || '',
            fieldsJson: (r.fieldsJson || []).map(fj => {
                if (typeof fj === 'string') {
                    try {
                        return JSON.parse(fj);
                    } catch {
                        return {name: '', value: '', inline: false};
                    }
                }
                return {name: fj.name || '', value: fj.value || '', inline: !!fj.inline};
            })
        }));

        selectEmbed(embeds.length - 1);
        closeModal();
        saveState();
        renderAll();
    } catch(err) { alert('Ungültiges JSON: ' + err.message); }
}

function downloadJson() {
    const json = serializeToJson();
    const blob = new Blob([json], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'embed.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

function serializeToJson() {
    const output = embeds.map(e => ({
        fieldsJson: e.fieldsJson.map(f => JSON.stringify({ name: f.name, value: f.value, inline: f.inline })),
        description: e.description || null,
        color: parseInt(e.color.replace('#', ''), 16),
        url: e.url || null,
        title: e.title || null,
        timestampString: e.timestampString || null,
        thumbnailUrl: e.thumbnailUrl || null,
        authorName: e.authorName || null,
        footerText: e.footerText || null,
        imageUrl: e.imageUrl || null
    }));

    const serializedButtons = buttons.map(b => b.style === 5
        ? { style: b.style, label: b.label, url: b.url }
        : { style: b.style, label: b.label, id: b.id }
    );

    const result = {};
    if (msgContent.trim()) result.content = msgContent;
    if (output.length > 0) result.embeds = output.length === 1 ? output[0] : output;
    if (serializedButtons.length > 0) result.buttons = serializedButtons;

    return JSON.stringify(result, null, 2);
}