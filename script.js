function updateColumn(columnId, groups, emptyMessage = "No data available") {

    const column = document.getElementById(columnId);
    const content = column.querySelector(".card-content");

    content.innerHTML = `<div class="sub-card">Loading...</div>`;

    try {

        if (!Array.isArray(groups) || groups.length === 0) {
            content.innerHTML = `<div class="sub-card">${emptyMessage}</div>`;
            return;
        }

        content.innerHTML = "";

        groups.forEach(groupStr => {

            groupStr = groupStr.replace(/^\{|\}$/g, "");

            const groupDiv = document.createElement("div");
            groupDiv.className = "sub-card";

            const lines = groupStr.split(/\r?\n/);

            lines.forEach(rawLine => {

                let line = rawLine.trim();
                if (!line) return;

                const p = document.createElement("p");

                if (line.startsWith("\\fl")) {
                    p.classList.add("first-line");
                    line = line.replace("\\fl", "").trim();
                }
                else if (line.startsWith("\\sl")) {
                    p.classList.add("second-line");
                    line = line.replace("\\sl", "").trim();
                }

                p.textContent = line;
                groupDiv.appendChild(p);
            });

            content.appendChild(groupDiv);
        });

    }
    catch (err) {
        console.error("Column render error:", err);
        content.innerHTML = `<div class="sub-card">Failed to render data.</div>`;
    }
}

async function fetchJSON(url) {

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }

    return response.json();
}

async function updateChangelogs() {
    try {
        const data = await fetchJSON("https://api.saturnvmenu.com/changelog");

        if (data.success) {
            updateColumn("changelog-column", data.changelog);
        }

    } catch (err) {
        console.error("Changelog fetch error:", err);
    }
}

async function updateAnnouncements() {
    try {
        const data = await fetchJSON("https://api.saturnvmenu.com/announcements");

        if (data.success) {
            updateColumn("announcements-column", data.ANNOUNCEMENTS);
        }

    } catch (err) {
        console.error("Announcements fetch error:", err);
    }
}

async function updateVersion() {
    try {
        const data = await fetchJSON("https://api.saturnvmenu.com/version");

        if (data.success) {
            document.getElementById("versioninfo").textContent = data.version;
        }

    } catch (err) {
        console.error("Version fetch error:", err);
    }
}

async function updateStatus() {
    try {
        const data = await fetchJSON("https://api.saturnvmenu.com/status");

        if (data.success) {
            document.getElementById("statusinfo").textContent = data.status;
        }

    } catch (err) {
        console.error("Status fetch error:", err);
    }
}

updateChangelogs();
updateAnnouncements();
updateVersion();
updateStatus();