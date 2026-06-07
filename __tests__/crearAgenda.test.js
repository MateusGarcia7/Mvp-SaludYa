describe("Crear agenda y selección de fechas", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="monthYear"></div>
      <div id="calendarDates" class="calendar-dates"></div>
      <button id="prevMonth"></button>
      <button id="nextMonth"></button>
      <input id="doctorNombre" />
      <button id="btnGuardarAgenda"></button>
      <input id="horaInicio" />
      <input id="horaFin" />
      <div id="listaAgendas"></div>
      <button id="logoutBtn"></button>
    `;

    window.alert = jest.fn();
    window.confirm = jest.fn();
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });

    localStorage.clear();
    localStorage.setItem(
      "usuarioLogueado",
      JSON.stringify({ id: 1, nombre: "Doctor Test", role: "doctor" }),
    );

    jest.resetModules();
    require("../js/crearAgenda.js");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("muestra alerta si no se selecciona una fecha", () => {
    document.getElementById("horaInicio").value = "08:00";
    document.getElementById("horaFin").value = "09:00";

    document.getElementById("btnGuardarAgenda").click();

    expect(window.alert).toHaveBeenCalledWith("Seleccione una fecha");
  });

  test("selecciona una fecha y marca el botón correspondiente", () => {
    const button = document.querySelector("#calendarDates button:not(.inactive)");
    expect(button).toBeTruthy();

    button.click();

    expect(button.classList.contains("selected")).toBe(true);
    expect(document.getElementById("doctorNombre").value).toBe("Doctor Test");
  });

  test("detecta agendas duplicadas por fecha y horario", () => {
    const buttons = document.querySelectorAll("#calendarDates button:not(.inactive)");
    buttons[0].click();

    document.getElementById("horaInicio").value = "08:00";
    document.getElementById("horaFin").value = "09:00";

    const fechaSeleccionada = document.querySelector("#calendarDates button.selected").textContent;
    const formattedDate = `2026-05-${String(fechaSeleccionada).padStart(2, "0")}`;

    localStorage.setItem(
      "agendas",
      JSON.stringify([
        {
          id: 1,
          doctorId: 1,
          doctorNombre: "Doctor Test",
          fecha: formattedDate,
          horaInicio: "08:00",
          horaFin: "09:00",
        },
      ]),
    );

    document.getElementById("btnGuardarAgenda").click();

    expect(window.alert).toHaveBeenCalledWith(
      "Ya existe una agenda con esa fecha y horario",
    );
  });

  test("elimina una agenda cuando la confirmación es positiva", () => {
    const crearAgenda = require("../js/crearAgenda.js");

    localStorage.setItem(
      "agendas",
      JSON.stringify([
        {
          id: 1,
          doctorId: 1,
          doctorNombre: "Doctor Test",
          fecha: "2026-05-01",
          horaInicio: "08:00",
          horaFin: "09:00",
        },
      ]),
    );

    window.confirm.mockReturnValue(true);
    crearAgenda.eliminarAgenda(1);

    expect(window.confirm).toHaveBeenCalledWith("¿Eliminar esta agenda?");
    expect(JSON.parse(localStorage.getItem("agendas"))).toEqual([]);
  });

  test("no elimina una agenda cuando la confirmación es negativa", () => {
    const crearAgenda = require("../js/crearAgenda.js");

    localStorage.setItem(
      "agendas",
      JSON.stringify([
        {
          id: 2,
          doctorId: 1,
          doctorNombre: "Doctor Test",
          fecha: "2026-05-02",
          horaInicio: "10:00",
          horaFin: "11:00",
        },
      ]),
    );

    window.confirm.mockReturnValue(false);
    crearAgenda.eliminarAgenda(2);

    expect(window.confirm).toHaveBeenCalledWith("¿Eliminar esta agenda?");
    expect(JSON.parse(localStorage.getItem("agendas"))).toHaveLength(1);
  });
});
