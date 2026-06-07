const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (!usuario) {
  window.location.href = "../index.html";
}

if (usuario.role !== "doctor" && usuario.role !== "admin") {
  window.location.href = "../index.html";
}

document.getElementById("nombreDoctor").textContent =
  `Hola Dr. ${usuario.nombre}`;

const citas = JSON.parse(localStorage.getItem("citas")) || [];

const hoy = new Date().toISOString().split("T")[0];

const citasHoy = citas.filter((cita) => cita.fechaDeseada === hoy).length;

const citasPendientes = citas.filter(
  (cita) => cita.estado === "pendiente",
).length;

const citasCanceladas = citas.filter(
  (cita) => cita.estado === "cancelada",
).length;

const citasAtendidas = citas.filter(
  (cita) => cita.estado === "atendida",
).length;

const listaCitasDoctor = document.getElementById("listaCitasDoctor");

citas.forEach((cita) => {
    const citaDiv = document.createElement("div");
    citaDiv.classList.add("cita-item");
    citaDiv.innerHTML = `
      <strong>Paciente:</strong> ${cita.paciente} <br>
      <strong>Motivo:</strong> ${cita.motivoConsulta} <br>
      <strong>Fecha:</strong> ${cita.fechaDeseada} <br>
      <strong>Tipo de Atención:</strong> ${cita.tipoAtencion} <br>
      <strong>Estado:</strong> ${cita.estado}
    `;
    listaCitasDoctor.appendChild(citaDiv);
  });

document.getElementById("citasHoy").textContent = citasHoy;

document.getElementById("citasPendientes").textContent = citasPendientes;

document.getElementById("citasCanceladas").textContent = citasCanceladas;

document.getElementById("citasAtendidas").textContent = citasAtendidas;

document.getElementById("citasHoyBar").style.height = `${citasHoy * 10}px`;

document.getElementById("citasPendientesBar").style.height =
  `${citasPendientes * 10}px`;

document.getElementById("citasCanceladasBar").style.height =
  `${citasCanceladas * 10}px`;

document.getElementById("citasAtendidasBar").style.height =
  `${citasAtendidas * 10}px`;