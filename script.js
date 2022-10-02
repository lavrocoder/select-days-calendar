let selected_days = []
const SELECTED_CLASS_NAME = "selected"

selectDay = function (event, year, month, day){
    let date = `${year}-${month}-${day}`
    let result = event.classList.toggle(SELECTED_CLASS_NAME)
    if (result) {
        selected_days.push(date)
    } else {
        selected_days.splice(selected_days.indexOf(date), 1)
    }
}

selectDaysOfWeek = function (day_number) {
    let elems = document.querySelectorAll(`tr td.day:nth-child(${day_number})`)
    let all_deselected = true
    for (let i = 0; i < elems.length; i++) {
        if (elems[i].classList.contains(SELECTED_CLASS_NAME)) {
            all_deselected = false
            break
        }
    }
    if (all_deselected) {
        for (let i = 0; i < elems.length; i++) {
            if (! elems[i].classList.contains(SELECTED_CLASS_NAME)){
                elems[i].classList.add(SELECTED_CLASS_NAME)
                let date = elems[i].id.replace("date", "")
                selected_days.push(date)
            }
        }
    } else {
        for (let i = 0; i < elems.length; i++) {
            if (elems[i].classList.contains(SELECTED_CLASS_NAME)){
                elems[i].classList.remove(SELECTED_CLASS_NAME)
                let date = elems[i].id.replace("date", "")
                selected_days.splice(selected_days.indexOf(date), 1)
            }
        }
    }
}

chooseSelectedDays = function () {
    for (let i = 0; i < selected_days.length; i++) {
        let elem = document.querySelector(`#date${selected_days[i]}`)
        if (elem !== null) {
            elem.classList.add(SELECTED_CLASS_NAME);
        }
    }
}

let isDrawing = false
let isDeselecting = false
startDrawing = function (event) {
    isDrawing = true
    isDeselecting = event.classList.contains(SELECTED_CLASS_NAME)
}

drawing = function (event) {
    if (isDrawing) {
        // console.log(event)
        if (isDeselecting) {
            let date = event.id.replace("date", "")
            event.classList.remove(SELECTED_CLASS_NAME)
            selected_days.splice(selected_days.indexOf(date), 1)
        } else {
            let date = event.id.replace("date", "")
            event.classList.add(SELECTED_CLASS_NAME)
            selected_days.push(date)
        }
    }
}
endDrawing = function (event) {
    isDrawing = false
}

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
                    weeks[week][day_of_week] = `<td id="date${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}" class="today day" onclick="selectDay(this, ${day.getFullYear()}, ${day.getMonth()}, ${day.getDate()})" onmousedown="startDrawing(this)" onmousemove="drawing(this)">${day.getDate()}</td>`
                } else {
                    weeks[week][day_of_week] = `<td id="date${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}" class="day" onclick="selectDay(this, ${day.getFullYear()}, ${day.getMonth()}, ${day.getDate()})" onmousedown="startDrawing(this)" onmousemove="drawing(this)">${day.getDate()}</td>`
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
        chooseSelectedDays()
    }

    let next = new Date(year, month + 1)
    document.querySelector(".next").onclick = function () {
        createCalendar(next.getFullYear(), next.getMonth())
        chooseSelectedDays()
    }

    let prev = new Date(year, month - 1)
    document.querySelector(".prev").onclick = function () {
        createCalendar(prev.getFullYear(), prev.getMonth())
        chooseSelectedDays()
    }
}

let today = new Date()
createCalendar(today.getFullYear(), today.getMonth())