const registerForm = document.getElementById("register-form");
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
const pacienteActual = usuarios.find(usuario => usuario.id === usuarioLogueado?.id);

if (!usuarioLogueado) {
  window.location.href = "login-paciente.html";
}
let logout = document.getElementById("logout");

logout.addEventListener("click", e => { localStorage.removeItem("usuarioLogueado"); window.location.href = "../index.html"; e.preventDefault() });

let bienvenida = document.getElementById("bienvenida");

bienvenida.textContent = `Bienvenido, ${usuarioLogueado.nombre}`;
const campoFecha = document.getElementById("fecha-deseada");
const selectorDoctor = document.getElementById("doctor-select");

campoFecha.addEventListener("change", () => {

    const fecha = campoFecha.value;

    const agendas = JSON.parse(localStorage.getItem("agendas")) || [];

    const agendasDisponibles = agendas.filter(
        agenda => agenda.fecha === fecha
    );

    selectorDoctor.innerHTML =
        '<option value="" selected disabled>Seleccione un doctor</option>';

    const doctoresAgregados = new Set();

    agendasDisponibles.forEach(agenda => {

        if (doctoresAgregados.has(agenda.doctorId)) return;

        const opcion = document.createElement("option");

        opcion.value = agenda.doctorId;
        opcion.textContent = agenda.doctorNombre;

        selectorDoctor.appendChild(opcion);

        doctoresAgregados.add(agenda.doctorId);
    });

});
const selectorHora = document.getElementById("hora-cita");

function convertirHora(hora) {
    const [tiempo, periodo] = hora.trim().toLowerCase().split(/\s+/);
    const [h, m] = tiempo.split(":").map(Number);

    return ((h % 12) + (periodo === "pm" ? 12 : 0)) * 60 + m;
}
function cargarHorarios() {
    selectorHora.innerHTML = '<option value="">Seleccione una hora</option>';
    selectorHora.disabled = true;

    const fecha = campoFecha.value;
    const doctorId = selectorDoctor.value;

    if (!fecha || !doctorId) return;

    const agendas = JSON.parse(localStorage.getItem("agendas")) || [];

    const agendasDoctor = agendas.filter(agenda =>
        agenda.fecha === fecha &&
        String(agenda.doctorId) === String(doctorId)
    );

    const horarios = new Set();

    agendasDoctor.forEach(agenda => {
        const inicio = convertirHora(agenda.horaInicio);
        const fin = convertirHora(agenda.horaFin);

        for (let minuto = inicio; minuto + 30 <= fin; minuto += 30) {
            const hora = String(Math.floor(minuto / 60)).padStart(2, "0");
            const minutos = String(minuto % 60).padStart(2, "0");

            horarios.add(`${hora}:${minutos}`);
        }
    });
    const citas = JSON.parse(localStorage.getItem("citas")) || [];

const citasOcupadas = citas.filter(cita =>
    cita.fechaDeseada === fecha &&
    String(cita.doctorId) === String(doctorId) &&
    cita.estado !== "cancelada"
);

citasOcupadas.forEach(cita => {
    horarios.delete(cita.hora);
});

    [...horarios].sort().forEach(hora => {
        const opcion = document.createElement("option");
        opcion.value = hora;
        opcion.textContent = hora;
        selectorHora.appendChild(opcion);
    });

    selectorHora.disabled = horarios.size === 0;
}
campoFecha.addEventListener("change", cargarHorarios);
selectorDoctor.addEventListener("change", cargarHorarios);

registerForm.addEventListener("submit", e => {
  e.preventDefault()
const motivoConsulta = document.getElementById("motivo-consulta");
const fechaDeseada = document.getElementById("fecha-deseada");
const tipoAtencion = document.getElementById("tipo-atencion");
const doctorSelect = document.getElementById("doctor-select");

let citas = JSON.parse(localStorage.getItem("citas")) || [];
const agendas = JSON.parse(localStorage.getItem("agendas")) || [];

const doctorDisponible = agendas.some(agenda =>
    String(agenda.doctorId) === String(doctorSelect.value) &&
    agenda.fecha === fechaDeseada.value
);

if (!doctorDisponible) {
    alert("El doctor seleccionado no tiene una agenda disponible para esta fecha");
    return;
}
if (!selectorHora.value) {
    alert("Debes seleccionar una hora para la cita");
    return;
}

const turnoOcupado = citas.some(cita =>
    String(cita.doctorId) === String(doctorSelect.value) &&
    cita.fechaDeseada === fechaDeseada.value &&
    cita.hora === selectorHora.value &&
    cita.estado !== "cancelada"
);

if (turnoOcupado) {
    alert("Este horario ya está reservado. Selecciona otra hora");
    cargarHorarios();
    return;
}

const nuevaCita = {
  id: Date.now(),
  paciente: usuarioLogueado.nombre,
  cc: pacienteActual.documentNumber,
  motivoConsulta: motivoConsulta.value,
  fechaDeseada: fechaDeseada.value,
  tipoAtencion: tipoAtencion.value,
  doctorId: Number(doctorSelect.value),
  doctor: doctorSelect.options[doctorSelect.selectedIndex].textContent.trim(),
  hora: selectorHora.value,
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





