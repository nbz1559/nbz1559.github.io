document.getElementById("siderbardownload").addEventListener("click", async function() {
        const btn = this;
        const originalText = btn.textContent;
        btn.disabled = true;

        try {
            const response = await fetch("https://api.github.com/repos/nbz1559/SaturnV/releases/latest");
            if (!response.ok) throw new Error("Network error");

            const data = await response.json();
            let downloadUrl = "#";
            if (Array.isArray(data.assets) && data.assets.length > 0) {
                downloadUrl = data.assets[0].browser_download_url;
            } else {
                throw new Error("No assets found");
            }
            window.location.href = downloadUrl;
        } catch (err) {
            console.error(err);
            btn.textContent = "Failed to fetch release. Try again.";
            setTimeout(() => {
                btn.textContent = originalText;
            }, 3000);
        } finally {
            btn.disabled = false;
        }
    });

    document.getElementById("sidebardiscord").addEventListener("click", async function(e) {
        e.preventDefault();
        const btn = this;
        btn.disabled = true;

        try {
            const response = await fetch("https://api.saturnvmenu.com/discordinvite");
            if (!response.ok) throw new Error(`Network error: ${response.status}`);

            const data = await response.json();
            if (data.success && data.message) {
                window.open(data.message, "_blank");
            } else {
                throw new Error("Invalid server response");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to fetch Discord invite. Try again.");
        } finally {
            btn.disabled = false;
        }
    });