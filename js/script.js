const monthYear = document.getElementById("monthYear");
const calendarDates = document.getElementById("calendarDates");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentDate = new Date(2026, 4, 1);

function renderCalendar() {
    if (!monthYear || !calendarDates) return;

    calendarDates.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
        "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
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
            button.classList.toggle("selected");
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