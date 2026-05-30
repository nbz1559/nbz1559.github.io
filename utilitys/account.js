const API = "https://api.saturnvmenu.com";

document.querySelectorAll(".account-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".account-tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".account-panel").forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
    });
});

function showAlert(id, message, type) {
    const el = document.getElementById(id);
    el.textContent = message;
    el.className = "account-alert " + type;
}
function clearAlert(id) {
    const el = document.getElementById(id);
    el.className = "account-alert";
    el.textContent = "";
}
function setLoading(btnId, loading) { document.getElementById(btnId).disabled = loading; }
function saveSession(token) { localStorage.setItem("sv_token", token); }
function getToken() { return localStorage.getItem("sv_token"); }
function clearSession() { localStorage.removeItem("sv_token"); }
function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function showAccount(user) {
    document.getElementById("view-auth").style.display = "none";
    document.getElementById("view-pending").style.display = "none";
    document.getElementById("view-account").style.display = "flex";
    document.getElementById("account-username").textContent = user.username;
    document.getElementById("account-email").textContent = user.email;
    document.getElementById("account-created").textContent = formatDate(user.created_at);
}

function showPending(email) {
    document.getElementById("view-auth").style.display = "none";
    document.getElementById("view-account").style.display = "none";
    document.getElementById("view-pending").style.display = "flex";
    document.getElementById("pending-email").textContent = email;
}

async function checkSession() {
    const token = getToken();
    if (!token) return;
    try {
        const res = await fetch(API + "/me", { headers: { "Authorization": "Bearer " + token } });
        const data = await res.json();
        if (data.success) showAccount(data.user);
        else clearSession();
    } catch (e) { clearSession(); }
}

async function doSignup() {
    clearAlert("signup-alert");
    const username = document.getElementById("signup-username").value.trim();
    const email    = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    if (!username || !email || !password) {
        showAlert("signup-alert", "Please fill in all fields.", "error");
        return;
    }

    setLoading("signup-btn", true);
    try {
        const res  = await fetch(API + "/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (data.success) {
            showPending(email);
        } else {
            showAlert("signup-alert", data.message || "Something went wrong.", "error");
        }
    } catch (e) {
        showAlert("signup-alert", "Could not reach the server.", "error");
    }
    setLoading("signup-btn", false);
}

async function doLogin() {
    clearAlert("login-alert");
    const email    = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        showAlert("login-alert", "Please fill in all fields.", "error");
        return;
    }

    setLoading("login-btn", true);
    try {
        const res  = await fetch(API + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            saveSession(data.token);
            const me = await fetch(API + "/me", { headers: { "Authorization": "Bearer " + data.token } });
            const meData = await me.json();
            if (meData.success) showAccount(meData.user);
        } else {
            showAlert("login-alert", data.message || "Invalid email or password.", "error");
        }
    } catch (e) {
        showAlert("login-alert", "Could not reach the server.", "error");
    }
    setLoading("login-btn", false);
}

async function doLogout() {
    const token = getToken();
    if (token) {
        try {
            await fetch(API + "/logout", { method: "POST", headers: { "Authorization": "Bearer " + token } });
        } catch (e) {}
    }
    clearSession();
    document.getElementById("view-account").style.display = "none";
    document.getElementById("view-auth").style.display = "flex";
}

document.getElementById("signup-password").addEventListener("keydown", e => { if (e.key === "Enter") doSignup(); });
document.getElementById("login-password").addEventListener("keydown",  e => { if (e.key === "Enter") doLogin(); });

checkSession();