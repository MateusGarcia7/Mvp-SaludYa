
let logout = document.getElementById("logout");

logout.addEventListener("click", (e) => {
  localStorage.removeItem("usuarioLogueado");
  window.location.href = "login-paciente.html";
  e.preventDefault();
});

function mostrarCitas() {
  const lista = document.getElementById("listaCitas");

  let citas = JSON.parse(localStorage.getItem("citas")) || [];

  lista.innerHTML = "";

  citas.forEach((cita) => {
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
mostrarCitas();

function eliminarCita(id) {
  let citas = JSON.parse(localStorage.getItem("citas")) || [];

  const cita = citas.find((cita) => cita.id === id);

  const confirmar = confirm(`¿Eliminar la cita de ${cita.paciente}?`);

  if (!confirmar) return;

  citas = citas.filter((cita) => cita.id !== id);

  localStorage.setItem("citas", JSON.stringify(citas));

  mostrarCitas();
}
