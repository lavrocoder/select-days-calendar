getWeeksOfMonth = function (year, month) {
    // День недели первого дня месяца
    // [ВС, ПН, ВТ, СР, ЧТ, ПТ, СБ]
    let first_day = new Date(year, month, 1).getDay();
    // Число последнего дня
    let last_day = new Date(year, month + 1, 0).getDate();

    let days = [];
    // Пустые ячейки первой недели
    if (first_day !== 0){
        for (let i = 1; i < first_day; i++) days.push(null);
    } else {
        for (let i = 0; i < 6; i++) days.push(null);
    }

    for (let i = 1; i <= last_day; i++) {
        days.push(new Date(year, month, i));
    }

    let weeks = [];
    let n = 0;
    let week = []
    for (let i = 0; i < days.length; i++){
        n++
        week.push(days[i])
        if (n === 7 || i === days.length -1) {
            n = 0
            weeks.push(week)
            week = []
        }
    }
    let count_null = 7 - weeks[weeks.length-1].length
    for (let i = 0; i < count_null; i++){
        weeks[weeks.length-1].push(null)
    }
    let count_null_weeks = 6 - weeks.length
    for (let i = 0; i < count_null_weeks; i++){
        week = []
        for (let i = 0; i < 7; i++) {
            week.push(null)
        }
        weeks.push(week)
    }
    return weeks
}

createCalendar = function (year, month){
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    let today = new Date()
    let weeks = getWeeksOfMonth(year, month)
    for (let week in weeks){
        for (let day_of_week in weeks[week]) {
            let day = weeks[week][day_of_week]
            if (day === null) {
                weeks[week][day_of_week] = "<td></td>"
            } else {
                if (day.getFullYear() === today.getFullYear() && day.getMonth() === today.getMonth() && day.getDate() === today.getDate()){
                    weeks[week][day_of_week] = `<td id="date${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}" class="today day">${day.getDate()}</td>`
                } else {
                    weeks[week][day_of_week] = `<td id="date${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}" class="day">${day.getDate()}</td>`
                }
            }
        }
    }
    let html = ""
    for (let week in weeks){
        weeks[week] = weeks[week].join("\n")
        html = html + `<tr>${weeks[week]}</tr>`
    }
    document.querySelector(".calendar-days").innerHTML = html
    document.querySelector(".year-month").innerText = `${months[month]} ${year}`
    document.querySelector(".year-month").onclick = function () {
        createCalendar(new Date().getFullYear(), new Date().getMonth())
    }

    let next = new Date(year, month + 1)
    document.querySelector(".next").onclick = function () {
        createCalendar(next.getFullYear(), next.getMonth())
    }

    let prev = new Date(year, month - 1)
    document.querySelector(".prev").onclick = function () {
        createCalendar(prev.getFullYear(), prev.getMonth())
    }
}

let today = new Date()
createCalendar(today.getFullYear(), today.getMonth())