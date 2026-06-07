const form = document.getElementById("register-form");


form.addEventListener("submit", (e) => {
  e.preventDefault();
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;
const genero = document.getElementById("gender").value;
const edad = document.getElementById("age").value;
const confirmPassword = document.getElementById("confirm-password").value;
const documentType = document.getElementById("document-type").value;
const documentNumber = document.getElementById("document-number").value;
const name = document.getElementById("name").value;
console.log(
  email,
  password,
  genero,
  edad,
  confirmPassword,
  documentType,
  documentNumber,
  name,
);
  if (
    !name ||
    !email ||
    !password ||
    !genero ||
    !edad ||
    !confirmPassword ||
    !documentType ||
    !documentNumber
  ) {
    alert("Todos los campos son obligatorios");
    return;
  }


  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const existeUsuario = usuarios.find((usuario) => usuario.email === email);

  if (existeUsuario) {
    alert("El correo ya está registrado");
    return;
  }
  const nuevoUsuario = {
    id: Date.now(),
    rol: "paciente",
    name,
    email,
    password,
    edad,
    genero,
    documentType,
    documentNumber,
  };
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Usuario registrado exitosamente");
  window.location.href = "./login-paciente.html";
});
const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (usuario) {
  window.location.href = "../pages/asignacion.html";
}