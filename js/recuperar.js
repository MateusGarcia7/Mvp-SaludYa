const enviarEnlace = document.getElementById("enviarEnlace");

enviarEnlace.addEventListener("click", () => {
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();

  if (email === "") {
    alert("Por favor, ingresa tu correo electrónico.");
    return;
  }



  alert(`Se ha enviado un enlace de recuperación a ${email}.`);
  emailInput.value = ""; 
  window.location.href = "../index.html";
});