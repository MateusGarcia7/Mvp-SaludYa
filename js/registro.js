const form = document.getElementById("register-form");

function validateRegistroData(data) {
  const requiredFields = [
    "name",
    "email",
    "password",
    "genero",
    "edad",
    "confirmPassword",
    "documentType",
    "documentNumber",
  ];

  return requiredFields.every(
    (field) => data[field] !== undefined && String(data[field]).trim() !== ""
  );
}

function isEmailRegistered(email, usuarios = []) {
  return usuarios.some((usuario) => usuario.email === email);
}

function createRegistroUsuario(data) {
  return {
    id: Date.now(),
    rol: "paciente",
    name: data.name,
    email: data.email,
    password: data.password,
    edad: data.edad,
    genero: data.genero,
    documentType: data.documentType,
    documentNumber: data.documentNumber,
  };
}

function handleRegisterSubmit(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const genero = document.getElementById("gender").value;
  const edad = document.getElementById("age").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const documentType = document.getElementById("document-type").value;
  const documentNumber = document.getElementById("document-number").value;
  const name = document.getElementById("name").value;

  const formData = {
    name,
    email,
    password,
    genero,
    edad,
    confirmPassword,
    documentType,
    documentNumber,
  };

  if (!validateRegistroData(formData)) {
    alert("Todos los campos son obligatorios");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (isEmailRegistered(email, usuarios)) {
    alert("El correo ya está registrado");
    return;
  }

  const nuevoUsuario = createRegistroUsuario(formData);
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Usuario registrado exitosamente");
  safeRedirect("./login-paciente.html");
}

if (form) {
  form.addEventListener("submit", handleRegisterSubmit);
}

const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (usuario) {
  safeRedirect("../pages/asignacion.html");
}

function safeRedirect(url) {
  if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.includes("jsdom")) {
    return;
  }

  try {
    window.location.assign(url);
  } catch (error) {
    if (error && typeof error.message === "string" && error.message.includes("Not implemented: navigation")) {
      return;
    }
    throw error;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validateRegistroData,
    isEmailRegistered,
    createRegistroUsuario,
    handleRegisterSubmit,
  };
}
