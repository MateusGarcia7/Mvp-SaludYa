function crearAdminPorDefecto() {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const adminExiste = usuarios.find((usuario) => usuario.rol === "admin");

  if (!adminExiste) {
    usuarios.push({
      id: Date.now(),
      name: "Administrador",
      email: "admin@admin.com",
      password: "admin123",
      rol: "admin",
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
}

crearAdminPorDefecto();

