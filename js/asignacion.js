const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (!usuarioLogueado) {
  window.location.href = "login-paciente.html";
}
let logout = document.getElementById("logout");

logout.addEventListener("click", e => { localStorage.removeItem("usuarioLogueado"); window.location.href = "login-paciente.html"; e.preventDefault() });

let bienvenida = document.getElementById("bienvenida");

bienvenida.textContent = `Bienvenido, ${usuarioLogueado.nombre}`;
