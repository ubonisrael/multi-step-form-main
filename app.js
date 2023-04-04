//initialize step value
let step = 1

//get all the section (steps)
const sections = document.querySelectorAll('.step')

//get the next and go back buttons
const nextBtn = document.querySelector('.next')
const backBtn = document.querySelector('.back')

//when next button gets clicked, get the next section
nextBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (step < 4) step++
    sections.forEach(elem => {
        elem.classList.remove('active')
    })
    sections[step - 1].classList.add('active')
    if (step > 1 && !backBtn.classList.contains('active')) backBtn.classList.add('active')
})

//when back button gets clicked, get the prev section
backBtn.addEventListener('click', () => {
    if (step > 1) step--
    sections.forEach(elem => {
        elem.classList.remove('active')
    })
    sections[step - 1].classList.add('active')
    if (step < 2 && backBtn.classList.contains('active')) backBtn.classList.remove('active')
})

//get the monthly or yearly periods
const month_container = document.querySelector('.month_container')
const year_container = document.querySelector('.year_container')
const periods = document.querySelectorAll('.period')

//get the toggle input
const togglePeriod = document.querySelector('.switch_period')

//add an event listener for when it is checked
togglePeriod.addEventListener('click', () => {
    if (month_container.classList.contains(('active'))) {
        month_container.classList.remove('active')
        year_container.classList.add('active')
    } else {
        year_container.classList.remove('active')
        month_container.classList.add('active')
    }

    periods.forEach(element => {
        if (element.classList.contains('active_period')) {
            element.classList.remove('active_period')
        } else {
            element.classList.add('active_period')
        }
    })
})
console.log(togglePeriod);