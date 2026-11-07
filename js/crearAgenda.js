
const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

const monthYear = document.getElementById("monthYear");
const calendarDates = document.getElementById("calendarDates");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentDate = new Date();

if (!usuario) {
    window.location.href = "../index.html";
}

if (usuario && usuario.role !== "doctor" && usuario.role !== "admin") {
    window.location.href = "../index.html";
}

document.getElementById("doctorNombre").value = usuario?.nombre || "";

let fechaSeleccionada = null;

// FORMATEAR FECHAS
function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// CONVERTIR HORAS A MINUTOS
function convertirHoraAMinutos(hora) {
    const [tiempo, periodo] = hora.trim().split(/\s+/);

    const [horas, minutos] = tiempo.split(":").map(Number);

    let horas24 = horas;

    if (periodo) {
        horas24 = (horas % 12) + (periodo.toLowerCase() === "pm" ? 12 : 0);
    }

    return horas24 * 60 + minutos;
}

// DETECTAR HORARIOS SUPERPUESTOS
function haySolapamiento(agendas, doctorId, fecha, horaInicio, horaFin) {
    const inicioNuevo = convertirHoraAMinutos(horaInicio);
    const finNuevo = convertirHoraAMinutos(horaFin);

    return agendas.some(agenda => {
        if (agenda.doctorId !== doctorId || agenda.fecha !== fecha) {
            return false;
        }

        const inicioExistente = convertirHoraAMinutos(agenda.horaInicio);
        const finExistente = convertirHoraAMinutos(agenda.horaFin);

        return inicioNuevo < finExistente && finNuevo > inicioExistente;
    });
}

// DETECTAR AGENDAS DUPLICADAS
function isAgendaDuplicate(agendas, doctorId, fecha, horaInicio, horaFin) {
    return agendas.some(
        (agenda) =>
            agenda.doctorId === doctorId &&
            agenda.fecha === fecha &&
            agenda.horaInicio === horaInicio &&
            agenda.horaFin === horaFin
    );
}

// VALIDAR DATOS DE LA AGENDA
function validateAgendaData(fecha, agendas, doctorId, horaInicio, horaFin) {

    if (!fecha) {
        return {
            valid: false,
            message: "Seleccione una fecha"
        };
    }

    const hoy = new Date();

    const fechaActual = formatDate(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate()
    );

    if (fecha < fechaActual) {
        return {
            valid: false,
            message: "No puedes crear agendas en fechas anteriores"
        };
    }

    if (isAgendaDuplicate(agendas, doctorId, fecha, horaInicio, horaFin)) {
        return {
            valid: false,
            message: "Ya existe una agenda con esa fecha y horario"
        };
    }

    if (haySolapamiento(agendas, doctorId, fecha, horaInicio, horaFin)) {
        return {
            valid: false,
            message: "Ya tienes una agenda registrada que se superpone con este horario"
        };
    }

    return {
        valid: true,
        message: ""
    };
}

// CREAR OBJETO DE AGENDA
function createAgendaObject(usuario, fecha, horaInicio, horaFin) {
    return {
        id: Date.now(),
        doctorId: usuario.id,
        doctorNombre: usuario.nombre,
        fecha,
        horaInicio,
        horaFin
    };
}

// OBTENER FECHA SELECCIONADA
function getFechaSeleccionada() {
    return fechaSeleccionada;
}

// RENDERIZAR CALENDARIO
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
        "DICIEMBRE"
    ];

    monthYear.textContent = `${monthNames[month]} DE ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // ESPACIOS VACIOS AL INICIO DEL MES
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("button");

        empty.classList.add("inactive");
        empty.disabled = true;

        calendarDates.appendChild(empty);
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // GENERAR DIAS DEL MES
    for (let day = 1; day <= lastDate; day++) {

        const button = document.createElement("button");
        button.textContent = day;

        const fechaBoton = new Date(year, month, day);

        // BLOQUEAR FECHAS ANTERIORES
        if (fechaBoton < hoy) {
            button.disabled = true;
            button.classList.add("inactive");
        }

        // SELECCIONAR FECHA
        button.addEventListener("click", () => {

            document.querySelectorAll(".calendar-dates button").forEach(
                (btn) => btn.classList.remove("selected")
            );

            button.classList.add("selected");

            fechaSeleccionada = formatDate(year, month, day);
        });

        calendarDates.appendChild(button);
    }
}

// MES ANTERIOR
prevMonth?.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

// MES SIGUIENTE
nextMonth?.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// MOSTRAR CALENDARIO
renderCalendar();

// BOTON GUARDAR AGENDA
const btnGuardarAgenda = document.getElementById("btnGuardarAgenda");

btnGuardarAgenda.addEventListener("click", () => {

    if (
        !usuario ||
        (usuario.role !== "doctor" && usuario.role !== "admin")
    ) {
        return;
    }

    const horaInicio = document.getElementById("horaInicio").value;
    const horaFin = document.getElementById("horaFin").value;

    const validation = validateAgendaData(
        fechaSeleccionada,
        JSON.parse(localStorage.getItem("agendas")) || [],
        usuario.id,
        horaInicio,
        horaFin
    );

    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    let agendas = JSON.parse(localStorage.getItem("agendas")) || [];

    const nuevaAgenda = createAgendaObject(
        usuario,
        fechaSeleccionada,
        horaInicio,
        horaFin
    );

    agendas.push(nuevaAgenda);

    localStorage.setItem("agendas", JSON.stringify(agendas));

    alert("Agenda creada correctamente");

    cargarAgendas();
});

// MOSTRAR AGENDAS CREADAS
function cargarAgendas() {

    if (
        !usuario ||
        (usuario.role !== "doctor" && usuario.role !== "admin")
    ) {
        return;
    }

    const contenedor = document.getElementById("listaAgendas");

    if (!contenedor) return;

    let agendas = JSON.parse(localStorage.getItem("agendas")) || [];

    const agendasDoctor = agendas.filter(
        (agenda) => agenda.doctorId === usuario.id
    );

    contenedor.innerHTML = "";

    agendasDoctor.forEach((agenda) => {

        contenedor.innerHTML += `
            <div class="agenda-item" style="color:#333;">

                <p>
                    ${agenda.fecha}
                </p>

                <p>
                    ${agenda.horaInicio}
                    -
                    ${agenda.horaFin}
                </p>

                <button
                    class="btn-danger"
                    onclick="eliminarAgenda(${agenda.id})"
                >
                    Eliminar
                </button>

            </div>
        `;
    });
}

// ELIMINAR UNA AGENDA
function eliminarAgenda(id) {

    if (
        !usuario ||
        (usuario.role !== "doctor" && usuario.role !== "admin")
    ) {
        return;
    }

    const confirmar = confirm("¿Eliminar esta agenda?");

    if (!confirmar) return;

    let agendas = JSON.parse(localStorage.getItem("agendas")) || [];

    agendas = agendas.filter((agenda) => agenda.id !== id);

    localStorage.setItem("agendas", JSON.stringify(agendas));

    cargarAgendas();
}

// CERRAR SESION
const btnLogout = document.getElementById("logoutBtn");

if (btnLogout) {

    btnLogout.addEventListener("click", (e) => {

        e.preventDefault();

        localStorage.removeItem("usuarioLogueado");

        window.location.href = "../index.html";
    });
}

// CARGAR AGENDAS AL INICIAR
cargarAgendas();

// EXPORTACIONES PARA PRUEBAS
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        renderCalendar,
        formatDate,
        validateAgendaData,
        createAgendaObject,
        eliminarAgenda,
        getFechaSeleccionada
    };
}
