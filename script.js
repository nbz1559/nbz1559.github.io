function updateColumn(columnId, staticData, includeSecondline) {
    const column = document.getElementById(columnId);
    const content = column.querySelector('.card-content');
    content.innerHTML = '<div class="sub-card">Loading...</div>';

    try {
        if (Array.isArray(staticData) && staticData.length > 0) {
            content.innerHTML = '';

            staticData.forEach(groupStr => {
                groupStr = groupStr.replace(/^\{|\}$/g, '');
                const lines = groupStr.split(',');

                const groupDiv = document.createElement('div');
                groupDiv.className = 'sub-card';

                lines.forEach((line, index) => {
                    const p = document.createElement('p');
                    p.textContent = line.trim();

                    if (index === 0 && includeSecondline)  {
                        p.classList.add("first-line");
                    }
                    else if (index === 0) p.classList.add("second-line");
                    if (index === 1 && includeSecondline) p.classList.add("second-line");

                    groupDiv.appendChild(p);
                });

                content.appendChild(groupDiv);
            });
        } else {
            content.innerHTML = `<div class="sub-card">${emptyMessage}</div>`;
        }
    } catch (err) {
        console.error(err);
        content.innerHTML = `<div class="sub-card">Failed to render data.</div>`;
    }
}

    async function update_changelogs() {
        const response = await fetch("https://api.saturnvmenu.com/changelog");
            if (!response.ok) throw new Error(`Network error: ${response.status}`);
            try {
            const data = await response.json();
            if (data.success) {
                updateColumn('changelog-column', data.changelog, true);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function update_announcements() {
        const response = await fetch("https://api.saturnvmenu.com/announcements");
            if (!response.ok) throw new Error(`Network error: ${response.status}`);
            try {
            const data = await response.json();
            if (data.success) {
                updateColumn('announcements-column', data.ANNOUNCEMENTS, false);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function update_version() {
        const response = await fetch("https://api.saturnvmenu.com/version");
            if (!response.ok) throw new Error(`Network error: ${response.status}`);
            try {
            const data = await response.json();
            if (data.success) {
                document.getElementById("versioninfo").textContent = data.version;
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function update_status() {
        const response = await fetch("https://api.saturnvmenu.com/status");
            if (!response.ok) throw new Error(`Network error: ${response.status}`);
            try {
            const data = await response.json();
            if (data.success) {
                document.getElementById("statusinfo").textContent = data.status;
            }
        } catch (err) {
            console.error(err);
        }
    }

    update_changelogs();
    update_announcements();
    update_version();
    update_status();