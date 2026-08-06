function renderPreview() {
    const scroll = document.getElementById('previewScroll');
    const hasContent = msgContent.trim() || embeds.some(e =>
        e.title || e.description || e.authorName || e.footerText || e.imageUrl || e.thumbnailUrl || e.fieldsJson.length > 0
    );

    if (!hasContent) {
        scroll.innerHTML = '<div class="preview-empty">Kein Inhalt</div>';
        return;
    }

    scroll.innerHTML = '';

    // Discord message wrapper
    const msg = document.createElement('div');
    msg.className = 'dc-message';

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'dc-avatar';
    avatar.innerHTML = `<img src="/util-pages/discord-embeds/assets/dc-profile.png" alt="profPic">`;
    msg.appendChild(avatar);

    // Body
    const body = document.createElement('div');
    body.className = 'dc-msg-body';

    const nameRow = document.createElement('div');
    nameRow.className = 'dc-username-row';
    nameRow.innerHTML = `
        <span class="dc-username">FossilSMP〢Argus</span>
        <span class="dc-bot-tag">BOT</span>
        <span class="dc-timestamp">Heute um ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit',minute:'2-digit'})}</span>`;
    body.appendChild(nameRow);

    if (msgContent.trim()) {
        const ct = document.createElement('div');
        ct.className = 'dc-content';
        ct.textContent = msgContent;
        body.appendChild(ct);
    }

    embeds.forEach(e => {
        const hasEmbed = e.title || e.description || e.authorName || e.footerText || e.imageUrl || e.thumbnailUrl || e.fieldsJson.length > 0;
        if (!hasEmbed) return;

        const wrap = document.createElement('div');
        wrap.className = 'dc-embed';

        const pill = document.createElement('div');
        pill.className = 'dc-embed-pill';
        pill.style.background = e.color;
        wrap.appendChild(pill);

        const eb = document.createElement('div');
        eb.className = 'dc-embed-body';

        const inner = document.createElement('div');
        inner.className = 'dc-embed-inner';

        const main = document.createElement('div');
        main.className = 'dc-embed-main';

        if (e.authorName) {
            const a = document.createElement('div');
            a.className = 'dc-embed-author';
            a.textContent = e.authorName;
            main.appendChild(a);
        }
        if (e.title) {
            const t = document.createElement('div');
            t.className = 'dc-embed-title';
            if (e.url) t.innerHTML = `<a href="${esc(e.url)}" target="_blank">${esc(e.title)}</a>`;
            else t.textContent = e.title;
            main.appendChild(t);
        }
        if (e.description) {
            const d = document.createElement('div');
            d.className = 'dc-embed-desc';
            d.textContent = e.description;
            main.appendChild(d);
        }
        if (e.fieldsJson.length > 0) {
            const fields = document.createElement('div');
            fields.className = 'dc-embed-fields';
            e.fieldsJson.forEach(f => {
                const fd = document.createElement('div');
                fd.className = 'dc-embed-field' + (f.inline ? ' inline' : '');
                fd.innerHTML = `<div class="dc-embed-field-name">${esc(f.name)}</div><div class="dc-embed-field-value">${esc(f.value)}</div>`;
                fields.appendChild(fd);
            });
            main.appendChild(fields);
        }

        inner.appendChild(main);

        if (e.thumbnailUrl) {
            const thumb = document.createElement('img');
            thumb.className = 'dc-embed-thumbnail';
            thumb.src = e.thumbnailUrl; thumb.alt = '';
            inner.appendChild(thumb);
        }

        eb.appendChild(inner);

        if (e.imageUrl) {
            const img = document.createElement('img');
            img.className = 'dc-embed-image';
            img.src = e.imageUrl; img.alt = '';
            eb.appendChild(img);
        }
        if (e.footerText || e.timestampString) {
            const foot = document.createElement('div');
            foot.className = 'dc-embed-footer';
            if (e.footerText) foot.appendChild(document.createTextNode(e.footerText));
            if (e.footerText && e.timestampString) {
                const sep = document.createElement('span');
                sep.className = 'dc-embed-footer-sep';
                foot.appendChild(sep);
            }
            if (e.timestampString) {
                foot.appendChild(document.createTextNode(new Date(e.timestampString).toLocaleString('de-DE')));
            }
            eb.appendChild(foot);
        }

        wrap.appendChild(eb);
        body.appendChild(wrap);
    });

    msg.appendChild(body);
    scroll.appendChild(msg);
}