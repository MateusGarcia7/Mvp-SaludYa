const formn = document.getElementById('loginForm');

formn.addEventListener('submit', (e) => {  
  e.preventDefault(); 

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const usuarioEncontrado = usuarios.find(usuario => usuario.email === email && usuario.password === password);

  if (usuarioEncontrado) {


  if (usuarioEncontrado.rol !== "admin" && usuarioEncontrado.rol !== "doctor") {
    alert("No tienes permisos para acceder");
    return;
  }
    
   const sesion = {
    id: usuarioEncontrado.id,
    nombre: usuarioEncontrado.nombre,
    email: usuarioEncontrado.email,
    role: usuarioEncontrado.rol
};

localStorage.setItem(
  "usuarioLogueado",
  JSON.stringify(sesion)
);
    window.location.href = '../pages/menu-doctor.html';
  } else {
    alert('Credenciales incorrectas');
  }
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (usuario) {
    window.location.href = "../pages/menu-doctor.html";
  }
});