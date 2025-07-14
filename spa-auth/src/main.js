const app = document.getElementById("app");

const views = import.meta.glob('./views/*.html', { as: 'raw', eager: true });

const routes = {
  "/login": views["./views/login.html"],
  "/register": views["./views/register.html"],
  "/home": views["./views/home.html"],
};

function navigate(path) {
  window.location.hash = path;
}

function loadView(path) {
  const html = routes[path] || routes["/login"];
  app.innerHTML = html;
  initForms();
}

function initForms() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = loginForm.username.value.trim();
      const password = loginForm.password.value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem("session", JSON.stringify(user));
        navigate("/home");
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = registerForm.username.value.trim();
      const password = registerForm.password.value;
      const role = registerForm.role.value;

      if (!username || !password || !role) {
        alert("Completa todos los campos");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const existe = users.find((u) => u.username === username);

      if (existe) {
        alert("Ese usuario ya está registrado");
        return;
      }

      users.push({ username, password, role });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Usuario registrado con éxito");
      navigate("/login");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("session");
      navigate("/login");
    });
  }

  const session = JSON.parse(localStorage.getItem("session"));
  if (location.hash === "#/home" && !session) {
    navigate("/login");
  }

  if (session && location.hash === "#/home") {
    const welcome = document.getElementById("welcome");
    if (welcome) {
      welcome.innerText = `Bienvenido, ${session.username} (Rol: ${session.role})`;
    }
  }
}

window.addEventListener("hashchange", () => {
  loadView(location.hash.slice(1));
});

window.addEventListener("load", () => {
  const path = location.hash.slice(1) || "/login";
  loadView(path);
});
