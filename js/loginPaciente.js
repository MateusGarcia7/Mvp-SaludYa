const formn = document.getElementById('loginForm');

formn.addEventListener('submit', (e) => {  
  e.preventDefault(); 

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioEncontrado = usuarios.find(usuario => usuario.email === email && usuario.password === password);

  if (usuarioEncontrado) {

   const sesion = {
    id: usuarioEncontrado.id,
    nombre: usuarioEncontrado.name,
    email: usuarioEncontrado.email
};

localStorage.setItem(
    "usuarioLogueado",
    JSON.stringify(sesion)
);
    window.location.href = '../pages/asignacion.html';
  } else {
    alert('Credenciales incorrectas');
  }
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (usuario) {
    window.location.href = "../pages/asignacion.html";
  }
});