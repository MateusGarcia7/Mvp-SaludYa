const registerForm = document.getElementById("register-form");
const usuario = JSON.parse(localStorage.getItem("usuarios")); 

const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (!usuarioLogueado) {
  window.location.href = "login-paciente.html";
}
let logout = document.getElementById("logout");

logout.addEventListener("click", e => { localStorage.removeItem("usuarioLogueado"); window.location.href = "login-paciente.html"; e.preventDefault() });

let bienvenida = document.getElementById("bienvenida");

bienvenida.textContent = `Bienvenido, ${usuarioLogueado.nombre}`;

registerForm.addEventListener("submit", e => {
  e.preventDefault()
const motivoConsulta = document.getElementById("motivo-consulta");
const fechaDeseada = document.getElementById("fecha-deseada");
const tipoAtencion = document.getElementById("tipo-atencion");
const doctorSelect = document.getElementById("doctor-select");

let citas = JSON.parse(localStorage.getItem("citas")) || [];

const nuevaCita = {
  id: Date.now(),
  paciente: usuarioLogueado.nombre,
  cc: usuario.documentNumber,
  motivoConsulta: motivoConsulta.value,
  fechaDeseada: fechaDeseada.value,
  tipoAtencion: tipoAtencion.value,
  doctor: doctorSelect.value,
  estado: "pendiente",
};
citas.push(nuevaCita);
localStorage.setItem("citas", JSON.stringify(citas));
alert("Cita registrada exitosamente");
registerForm.reset();

});


const crearAgenda = document.getElementById("crearAgenda");

if (
  !usuarioLogueado ||
  (usuarioLogueado.role !== "doctor" && usuarioLogueado.role !== "admin")
) {
  crearAgenda.style.display = "none";
}





