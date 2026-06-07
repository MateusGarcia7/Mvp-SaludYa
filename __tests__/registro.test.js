describe("Registro form validations", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="register-form">
        <input id="name" />
        <input id="email" />
        <input id="password" />
        <input id="confirm-password" />
        <input id="gender" />
        <input id="age" />
        <input id="document-type" />
        <input id="document-number" />
      </form>
    `;

    window.alert = jest.fn();

    localStorage.clear();
    jest.resetModules();
    require("../js/registro.js");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("muestra alerta cuando hay campos vacíos", () => {
    const form = document.getElementById("register-form");

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(window.alert).toHaveBeenCalledWith("Todos los campos son obligatorios");
    expect(localStorage.getItem("usuarios")).toBeNull();
  });

  test("muestra alerta cuando el correo ya está registrado", () => {
    localStorage.setItem(
      "usuarios",
      JSON.stringify([{ email: "test@example.com" }]),
    );

    document.getElementById("name").value = "Paciente";
    document.getElementById("email").value = "test@example.com";
    document.getElementById("password").value = "123456";
    document.getElementById("confirm-password").value = "123456";
    document.getElementById("gender").value = "Femenino";
    document.getElementById("age").value = "30";
    document.getElementById("document-type").value = "Cédula";
    document.getElementById("document-number").value = "12345678";

    document.getElementById("register-form").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    expect(window.alert).toHaveBeenCalledWith("El correo ya está registrado");
    expect(JSON.parse(localStorage.getItem("usuarios"))).toHaveLength(1);
  });

  test("registra un usuario cuando todos los campos están completos", () => {
    document.getElementById("name").value = "Paciente";
    document.getElementById("email").value = "nuevo@example.com";
    document.getElementById("password").value = "123456";
    document.getElementById("confirm-password").value = "123456";
    document.getElementById("gender").value = "Masculino";
    document.getElementById("age").value = "28";
    document.getElementById("document-type").value = "Cédula";
    document.getElementById("document-number").value = "87654321";

    document.getElementById("register-form").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    expect(window.alert).toHaveBeenCalledWith("Usuario registrado exitosamente");

    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    expect(usuarios).toHaveLength(1);
    expect(usuarios[0].email).toBe("nuevo@example.com");
  });
});
