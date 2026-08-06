function renderEditorPanel() {
    const msgEditor = document.getElementById('msgEditor');
    const embedContent = document.getElementById('editorContent');

    msgEditor.style.display = 'block';
    document.getElementById('msgContent').value = msgContent;
    renderButtons();

    if (activeIdx === null) {
        embedContent.style.display = 'none';
    } else {
        embedContent.style.display = 'flex';
        renderEmbedEditor();
    }
}

function renderEmbedEditor() {
    const e = embeds[activeIdx];
    const content = document.getElementById('editorContent');
    content.innerHTML = `
    <div class="section" id="sec-basic">
      <div class="section-head" onclick="toggleSection('sec-basic')">
        <span>Basis</span><span class="section-toggle">▾</span>
      </div>
      <div class="section-body">
        <div class="field-row">
          <div class="form-group" style="flex:1">
            <label>Titel</label>
            <input type="text" placeholder="Embed Titel..." value="${esc(e.title)}" oninput="update('title', this.value)">
          </div>
          <div class="form-group" style="flex:0 0 54px">
            <label>Farbe</label>
            <input type="color" value="${e.color}" oninput="update('color', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label>URL (Titel-Link)</label>
          <input type="url" placeholder="https://..." value="${esc(e.url)}" oninput="update('url', this.value)">
        </div>
        <div class="form-group">
          <label>Beschreibung</label>
          <textarea placeholder="Beschreibung..." oninput="update('description', this.value)">${esc(e.description)}</textarea>
        </div>
      </div>
    </div>

    <div class="section" id="sec-meta">
      <div class="section-head" onclick="toggleSection('sec-meta')">
        <span>Author & Footer</span><span class="section-toggle">▾</span>
      </div>
      <div class="section-body">
        <div class="form-group">
          <label>Author Name</label>
          <input type="text" placeholder="Name..." value="${esc(e.authorName)}" oninput="update('authorName', this.value)">
        </div>
        <div class="form-group">
          <label>Footer Text</label>
          <input type="text" placeholder="Footer..." value="${esc(e.footerText)}" oninput="update('footerText', this.value)">
        </div>
        <div class="form-group">
          <label>Timestamp (leer = kein)</label>
          <input type="datetime-local" value="${e.timestampString ? e.timestampString.slice(0,16) : ''}" oninput="update('timestampString', this.value ? new Date(this.value).toISOString() : null)">
        </div>
      </div>
    </div>

    <div class="section" id="sec-img">
      <div class="section-head" onclick="toggleSection('sec-img')">
        <span>Bilder</span><span class="section-toggle">▾</span>
      </div>
      <div class="section-body">
        <div class="form-group">
          <label>Thumbnail URL</label>
          <input type="url" placeholder="https://..." value="${esc(e.thumbnailUrl)}" oninput="update('thumbnailUrl', this.value)">
        </div>
        <div class="form-group">
          <label>Bild URL</label>
          <input type="url" placeholder="https://..." value="${esc(e.imageUrl)}" oninput="update('imageUrl', this.value)">
        </div>
      </div>
    </div>

    <div class="section" id="sec-fields">
      <div class="section-head" onclick="toggleSection('sec-fields')">
        <span>Fields <span style="color:var(--text-dim);font-weight:400">(${e.fieldsJson.length}/25)</span></span>
        <span class="section-toggle">▾</span>
      </div>
      <div class="section-body" id="fieldsList"></div>
    </div>
  `;
    renderFields();
}

function toggleSection(id) {
    document.getElementById(id).classList.toggle('collapsed');
}

function renderFields() {
    const e = embeds[activeIdx];
    const container = document.getElementById('fieldsList');
    if (!container) return;
    container.innerHTML = '';

    e.fieldsJson.forEach((f, fi) => {
        const card = document.createElement('div');
        card.className = 'field-card';
        card.innerHTML = `
      <div class="field-card-head">
        <span>Field ${fi + 1}</span>
        <div style="display:flex;align-items:center;gap:10px;">
          <label class="field-inline-toggle">
            <input type="checkbox" ${f.inline ? 'checked' : ''} onchange="updateField(${fi}, 'inline', this.checked)">
            inline
          </label>
          <button class="btn btn-danger-soft" style="padding:2px 7px;font-size:10px;" onclick="removeField(${fi})">✕</button>
        </div>
      </div>
      <div class="form-group">
        <label>Name</label>
        <input type="text" placeholder="Field Name..." value="${esc(f.name)}" oninput="updateField(${fi}, 'name', this.value)">
      </div>
      <div class="form-group">
        <label>Value</label>
        <textarea placeholder="Field Value..." oninput="updateField(${fi}, 'value', this.value)">${esc(f.value)}</textarea>
      </div>
    `;
        container.appendChild(card);
    });

    if (e.fieldsJson.length < 25) {
        const btn = document.createElement('button');
        btn.className = 'btn-add-field';
        btn.textContent = '＋ Field hinzufügen';
        btn.onclick = addField;
        container.appendChild(btn);
    }
}
function updateField(fi, key, value) {
    if (activeIdx === null) return;
    embeds[activeIdx].fieldsJson[fi][key] = value;
    renderPreview();

    saveState();
}
function addField() {
    if (activeIdx === null) return;
    embeds[activeIdx].fieldsJson.push({ name: '', value: '', inline: false });
    renderFields();
    renderPreview();

    saveState();
}
function removeField(fi) {
    if (activeIdx === null) return;
    embeds[activeIdx].fieldsJson.splice(fi, 1);
    renderFields();
    renderPreview();

    saveState();
}

function renderButtons() {
    const container = document.getElementById('buttonsList');
    if (!container) return;
    container.innerHTML = '';

    buttons.forEach((b, bi) => {
        const card = document.createElement('div');
        card.className = 'field-card';
        card.innerHTML = `
            <div class="field-card-head">
                <span>Button ${bi + 1}</span>
                <button class="btn btn-danger-soft" style="padding:2px 7px;font-size:10px" onclick="removeButton(${bi})">✕</button>
            </div>
            <div class="field-row">
                <div class="form-group" style="flex:1">
                    <label>Label</label>
                    <input type="text" placeholder="Klick mich" value="${esc(b.label)}" oninput="updateButton(${bi}, 'label', this.value)">
                </div>
                <div class="form-group" style="flex:0 0 100px">
                    <label>Style</label>
                    <select onchange="updateButton(${bi}, 'style', parseInt(this.value))">
                        <option value="1" ${b.style===1?'selected':''}>Blau</option>
                        <option value="2" ${b.style===2?'selected':''}>Grau</option>
                        <option value="3" ${b.style===3?'selected':''}>Grün</option>
                        <option value="4" ${b.style===4?'selected':''}>Rot</option>
                        <option value="5" ${b.style===5?'selected':''}>Link</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>${b.style === 5 ? 'URL' : 'Custom ID'}</label>
                <input type="text" placeholder="${b.style === 5 ? 'https://...' : 'mein-button-id'}"
                    value="${esc(b.style === 5 ? (b.url||'') : (b.id||''))}"
                    oninput="updateButton(${bi}, '${b.style === 5 ? 'url' : 'id'}', this.value)">
            </div>
        `;
        container.appendChild(card);
    });

    const countEl = document.getElementById('btnCount');
    if (countEl) countEl.textContent = `(${buttons.length}/5)`;

    if (buttons.length < 5) {
        const btn = document.createElement('button');
        btn.className = 'btn-add-field';
        btn.textContent = '＋ Button hinzufügen';
        btn.onclick = addButton;
        container.appendChild(btn);
    }
}
function addButton() {
    buttons.push({ id: '', label: '', style: 1, url: '' });
    renderButtons();
    renderPreview();
    saveState();
}
function removeButton(bi) {
    buttons.splice(bi, 1);
    renderButtons();
    renderPreview();
    saveState();
}
function updateButton(bi, key, value) {
    buttons[bi][key] = value;
    if (key === 'style') renderButtons();
    renderPreview();
    saveState();
}

function updateMsg(val) {
    msgContent = val;
    renderPreview();

    saveState();
}

function update(key, value) {
    if (activeIdx === null) return;
    embeds[activeIdx][key] = value;
    renderSidebar();
    renderPreview();

    saveState();
}