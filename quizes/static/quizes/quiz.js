console.log('Hello')
const url = window.location.href

const quizBox = document.getElementById('quiz-box')
const scoreBox = document.getElementById('score-box')
const resultBox = document.getElementById('result-box')
const timerBox = document.getElementById('timer-box')
//let data
const activateTimer = (time) => {

    if (time.toString().length < 2){
        timerBox.innerHTML = `<b>0${time}:00</b>`
    }
    else{
        timerBox.innerHTML = `<b>${time}:00</b>`
    }
    console.log('time', time)
    let minutes = time -1
    let seconds = 60
    let displaySeconds
    let displayMinutes

    const timer = setInterval(()=>{
//        console.log('I am running')
        seconds --
        if (seconds < 0){
            seconds = 59
            minutes --
        }

        if (minutes,toString().length < 2){
            displayMinutes = '0'+minutes

        }
        else{
            displayMinutes = minutes
        }
        if(seconds.toString().length < 2){
            displaySeconds = '0' + seconds
        }
        else{
            displaySeconds = seconds
        }
        if (minutes === 0 && seconds === 0){
            timerBox.innerHTML = "<b> 00:00</b>"
            console.log('time over')
            setTimeout(()=>{
                clearInterval(timer)
                alert('time over')
                sendData()
            }, 500)

        }

        timerBox.innerHTML = ` <b>${displayMinutes}: ${displaySeconds}</b>`
    }, 1000)
    console.log('minutes',minutes)
    // 1 -> 1:59
}

console.log(url)
$.ajax({
    type: 'GET',
    url: `${url}data`,
    success: function(response){
        console.log(response)
        const data = response.data
        console.log(data)
        data.forEach(el => {
            for (const [question, answers] of Object.entries(el)){
                console.log(question)
                console.log(answers)
                quizBox.innerHTML += `
                <hr>
                <div class="mb-2">
                    <b>${question}</b>
                </div>
                `

                answers.forEach(answer=>{
                    quizBox.innerHTML += `
                        <div>
                            <input type="radio" class="ans" id="${question}-${answer}" name="${question}" value="${answer}">
                            <lable for="{question}"> ${answer}</label>
                    `
                })
            }
        });
        activateTimer(response.time)
    },
    error: function(error){
        console.log(error)
    }
})

const quizForm = document.getElementById('quiz-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')


const sendData = () => {
    const elements = [...document.getElementsByClassName('ans')]
    const data = {}
    data['csrfmiddlewaretoken'] = csrf[0].value
    elements.forEach(el =>{
        if (el.checked) {
        data[el.name] = el.value
        }
        else{
        if(!data[el.name]) {
            data[el.name] = null
        }
        }
    })

    $.ajax({
     type: 'POST',
     url: `${url}save/`,
     data: data,
     success: function(response){
     console.log(response)
     const results = response.results
     quizForm.hidden='True'
     console.log(results)

//     score code
     scoreBox.innerHTML = `${response.passed ? 'Congratulations': 'Ups..:'} Your result is ${response.score.toFixed(2)}%`

     results.forEach(res=>{
        const resDiv = document.createElement("div")
        for (const [question, resp] of Object.entries(res)){
        console.log('question',question)
        console.log('resp', resp)
        console.log('****')

        resDiv.innerHTML += question
        const cls = ['container', 'p-2', 'text-light', 'h6']
        resDiv.classList.add(...cls)

        if(resp =='not answered'){
            resDiv.innerHTML += '- not answered'
            resDiv.classList.add('bg-danger')
        }
        else{
            const answer = resp['answered']
            const correct = resp['correct_answer']

            if (answer == correct){
                resDiv.classList.add('bg-success')
                resDiv.innerHTML += ` answered: ${answer}`
            }
            else{
                resDiv.classList.add('bg-danger')
                resDiv.innerHTML += ` | correct answer: ${correct}`
                resDiv.innerHTML += ` | answered: ${answer}`
            }

            console.log('answer:',answer, 'correct:', correct)
        }

        }
//        cont body = document.getElementsByTagName('BODY')[0]
        resultBox.append(resDiv)
     })
     },
     error: function(error){
     console.log(error)
     }
    })
}

quizForm.addEventListener('submit', e=>{
    e.preventDefault()

    sendData()
})