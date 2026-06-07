
let logout = document.getElementById("logout");

logout.addEventListener("click", (e) => {
  localStorage.removeItem("usuarioLogueado");
  window.location.href = "login-paciente.html";
  e.preventDefault();
});

const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
function mostrarCitas(listaCitas) {
  const lista = document.getElementById("listaCitas");

  lista.innerHTML = "";

  listaCitas.forEach((cita) => {
    lista.innerHTML += `
      <tr>
        <td>${cita.fechaDeseada}</td>
        <td>${cita.paciente}</td>
        <td>
          <div class="attention-cell">
            <span>${cita.tipoAtencion}</span>

            <button onclick="eliminarCita(${cita.id})">
              Eliminar
            </button>
          </div>
        </td>
      </tr>
    `;
  });
}

let citas = JSON.parse(localStorage.getItem("citas")) || [];

if (usuarioLogueado.role === "doctor" || usuarioLogueado.role === "admin") {
  mostrarCitas(citas);
} else if (usuarioLogueado.role === "paciente") {
  const misCitas = citas.filter(
    (cita) => cita.paciente === usuarioLogueado.nombre,
  );

  mostrarCitas(misCitas);
}

function cargarCitas() {
  let citas = JSON.parse(localStorage.getItem("citas")) || [];

  if (usuarioLogueado.role === "doctor" || usuarioLogueado.role === "admin") {
    mostrarCitas(citas);
  } else {
    const misCitas = citas.filter(
      (cita) => cita.paciente === usuarioLogueado.nombre,
    );

    mostrarCitas(misCitas);
  }
}


function eliminarCita(id) {
  let citas = JSON.parse(localStorage.getItem("citas")) || [];

  const cita = citas.find((cita) => cita.id === id);

  const confirmar = confirm(`¿Eliminar la cita de ${cita.paciente}?`);

  if (!confirmar) return;

  citas = citas.filter((cita) => cita.id !== id);

  localStorage.setItem("citas", JSON.stringify(citas));

  cargarCitas();
}

const crearAgenda = document.getElementById("crearAgenda");
if (
  crearAgenda &&
  (!usuarioLogueado ||
    (usuarioLogueado.role !== "doctor" && usuarioLogueado.role !== "admin"))
) {
  crearAgenda.style.display = "none";
}

if (
  !usuarioLogueado ||
  (usuarioLogueado.role !== "doctor" && usuarioLogueado.role !== "admin")
) {
  crearAgenda.style.display = "none";
}

  