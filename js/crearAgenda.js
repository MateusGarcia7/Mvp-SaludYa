const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
const monthYear = document.getElementById("monthYear");
const calendarDates = document.getElementById("calendarDates");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentDate = new Date(2026, 4, 1);

if (!usuario) {
    window.location.href = "../index.html";
}

if (usuario.role !== "doctor" && usuario.role !== "admin") {
    window.location.href = "../index.html";
}

document.getElementById("doctorNombre").value = usuario.nombre;

let fechaSeleccionada = null;
function renderCalendar() {
  if (!monthYear || !calendarDates) return;

  calendarDates.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];

  monthYear.textContent = `${monthNames[month]} DE ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("button");
    empty.classList.add("inactive");
    empty.disabled = true;
    calendarDates.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const button = document.createElement("button");
    button.textContent = day;

   button.addEventListener("click", () => {

  document.querySelectorAll(".calendar-dates button")
    .forEach(btn => btn.classList.remove("selected"));

  button.classList.add("selected");

  fechaSeleccionada =
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
});

    calendarDates.appendChild(button);
  }
}


prevMonth?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonth?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

const btnGuardarAgenda = document.getElementById("btnGuardarAgenda");

btnGuardarAgenda.addEventListener("click", () => {
  const horaInicio = document.getElementById("horaInicio").value;

  const horaFin = document.getElementById("horaFin").value;
  console.log(horaInicio, horaFin);

  if (!fechaSeleccionada) {
    alert("Seleccione una fecha");

    return;
  }

  let agendas = JSON.parse(localStorage.getItem("agendas")) || [];

  const agendaExistente = agendas.find(
    (agenda) =>
      agenda.doctorId === usuario.id &&
      agenda.fecha === fechaSeleccionada &&
      agenda.horaInicio === horaInicio &&
      agenda.horaFin === horaFin,
  );

  if (agendaExistente) {
    alert("Ya existe una agenda con esa fecha y horario");

    return;
  }

  const nuevaAgenda = {
    id: Date.now(),

    doctorId: usuario.id,

    doctorNombre: usuario.nombre,

    fecha: fechaSeleccionada,

    horaInicio,

    horaFin,
  };

  agendas.push(nuevaAgenda);

  localStorage.setItem("agendas", JSON.stringify(agendas));

  alert("Agenda creada correctamente");

  cargarAgendas();
});

function cargarAgendas() {
  const contenedor = document.getElementById("listaAgendas");

  if (!contenedor) return;

  let agendas = JSON.parse(localStorage.getItem("agendas")) || [];

  const agendasDoctor = agendas.filter(
    (agenda) => agenda.doctorId === usuario.id,
  );

  contenedor.innerHTML = "";

  agendasDoctor.forEach((agenda) => {
    contenedor.innerHTML += `
                <div class="agenda-item" style=color:#333;>

                    <p>
                        ${agenda.fecha}
                    </p>

                    <p>
                        ${agenda.horaInicio}
                        -
                        ${agenda.horaFin}
                    </p>

                    <button class="btn-danger"
                        onclick="eliminarAgenda(${agenda.id})"
                    >
                        Eliminar
                    </button>

                </div>
            `;
  });
}

function eliminarAgenda(id) {
  const confirmar = confirm("¿Eliminar esta agenda?");

  if (!confirmar) return;

  let agendas = JSON.parse(localStorage.getItem("agendas")) || [];

  agendas = agendas.filter((agenda) => agenda.id !== id);

  localStorage.setItem("agendas", JSON.stringify(agendas));

  cargarAgendas();
}

const btnLogout = document.getElementById("logoutBtn");

if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");

    window.location.href = "../index.html";
  });
}

cargarAgendas();