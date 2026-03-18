const public_key = document.getElementById("public_key").innerHTML
const make_payment_button = document.getElementsByClassName("process")
const csrtoken = document.getElementsByName("csrfmiddlewaretoken")[0].value
let total = document.getElementById("amout")
let Total = total.getAttribute("data")
total.innerHTML = addcommas(Total)

const service_amounts = document.getElementsByClassName("service_amounts")
const service = document.getElementById('service')

// <p class="price">Consultation Fee: ₦<span id="amout" data="{{amount}}">{{amount}}</span></p>

const getnum = (str)=>{
    return str.match(/\d+/g)
}

for (const span of service_amounts) {
    // let data = addcommas(getnum(span.innerHTML)[0])
    span.innerHTML = addcommas(span.innerHTML)
}

const onchange = (e)=>{
    const index = e.target.selectedIndex
    const selected = e.target[index]
    const amount = getnum(selected.innerHTML).join('')
    Total = amount
    total.setAttribute('data',amount)
    total.innerHTML = addcommas(amount)
    // amount = parseInt(amount)
    console.log(amount)
}

service.addEventListener('change', onchange)



const ProcessOrder = async(data, token=csrtoken, url = '/consultation/consult') => {
    let response = await fetch(url, {
        method: 'POST', // or 'PUT'
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': token
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return await response.json()
}


function payWithPaystack(OrderId, Total, email) {
    console.log('paystack init')
    // loaderContainer.style.display = 'block'
    // const id = e.target.id
    // const order_data = document.getElementById(`data${id}`)
    // console.log(order_data.innerHTML.split(";"))
    // const [OrderId, Total, email] = order_data.innerHTML.split(";")
    // let email = 'pascalemy2010@gmail.com'

    var handler = PaystackPop.setup({
        key: public_key, // Replace with your public key

        email: email,

        amount: parseFloat(Total) * 100, // the amount value is multiplied by 100 to convert to the lowest currency unit

        currency: 'NGN', // Use GHS for Ghana Cedis or USD for US Dollars

        ref: OrderId, // Replace with a reference you generated

        callback: function(response) {
            //this happens after the payment is completed successfully
            var reference = response.reference;


            // Make an AJAX call to your server with the reference to verify the transaction
            const data = {
                action: "payment",
                orderId: OrderId,

            }
            ProcessOrder(data).
            then(data => {
                    // wait here
                    // loaderContainer.style.display = 'none'
                    payment({type:'CLEAR'})
                    set_pending_payment()
                    alert('Payment complete!');


                    // const parentNode = e.target.parentNode
                    // const paragraph = document.createElement("p")
                    // paragraph.innerHTML = "Paid"
                    // parentNode.appendChild(paragraph)
                    // e.target.remove()

                })
                .catch((error) => {
                    // loaderContainer.style.display = 'none'
                    set_pending_payment()
                    alert(error)
                });
        },

        onClose: function() {
            // loaderContainer.style.display = 'none'
            set_pending_payment()
            alert('Transaction was not completed, window closed.');

        },

    });

    handler.openIframe();

    // if ()

}


const validateEmail =(input) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(input.value).toLowerCase())
    }
const validatePhoneNumber = (input) => {
    if(input.value[0] == '+'){
        input.value = input.value.slice(1)
    }
    if(input.value.length > 15){
        return false
    }

        const re = /^\d+$/
        return re.test(String(input.value))
    }

// console.log(formData)
// console.log(forminputs)
// forgroups.forEach(element => {
//     console.log(element)
// });

const onSubmit = (e)=>{
    const errormgs = document.getElementsByClassName('error')
    for(const err of errormgs){
        err.innerHTML = ''
    }
    e.preventDefault()
    loading({type:'LOADING'})
    let orderId =  'zingo' + Date.now().toString() + Math.random().toString(36).substr(2, 9)
    // get form data
    const forgroups  = document.getElementsByClassName('formGroup')
    const formData = {action: "create",orderId}
    const forminputs = []
    let error = false
    for (const input_group of forgroups) {
        for(const input of input_group.children){

            if(input.localName != 'label' && input.localName != 'p'){
                if(input.value != ''){
                    formData[input.name] = input.value
                    forminputs.push(input)
                }else{
                    error = true
                    const id = input.id + 'er'
                    console.log(id)
                    let err = document.getElementById(id)
                    err.innerHTML = `${input.name} must not be blank`
                    
                }  
            }  

             // validate email
            if(input.name == 'email' && input.value != ''){
                if(!validateEmail(input)){
                    error = true
                    const id = input.id + 'er'
                    let err = document.getElementById(id)
                    err.innerHTML = `Enter a valid email`
                }
             } 
            // validate phone number
             if(input.name == 'phone' && input.value != ''){
                if(!validatePhoneNumber(input)){
                    error = true
                    const id = input.id + 'er'
                    let err = document.getElementById(id)
                    err.innerHTML = `Enter a valid phone number`
                }
            }
        }
        }
    
        if(error){
            loading({type:'LOADED'})
            return
        }

    const paymentData = {orderId:formData.orderId,Total:Total,
                         email:formData.email,name:formData.name,
                         paid:false,service:formData.service
                        }
    
    // send to backend
    ProcessOrder(formData)
    .then(data=>{
        payment({type:'SET', payment: paymentData})
        // clear inputs
        forminputs.forEach((input)=>input.value = '')
        // pay with paystack
         payWithPaystack(orderId, Total, formData.email)
        set_pending_payment()

    }
       )
    .catch(err=>console.log(err))
        loading({type:'LOADED'})    
}

const set_pending_payment = () =>{
    let payment = readStorage('payment')
    if(payment){
        payment = payment.payment
    }
    const loading_state = readStorage('loading')
    const pending_payment = document.getElementById('pending_payment')
    const selected_service = document.getElementById('selected_service')
    const pending_amount = document.getElementById('pending_amount')


    if(payment && !loading_state.loading){
        selected_service.innerHTML = `You have a pending payment for ${payment.service.toLowerCase()} consultation`
        pending_amount.innerHTML = addcommas(payment.Total)
        pending_payment.style.display = 'block'
        make_payment_button[0].style.backgroundColor = 'gray'
        make_payment_button[0].style.cursor = 'not-allowed'
        make_payment_button[0].disabled = true
    }else{
        pending_payment.style.display = 'none'
        make_payment_button[0].style.background = '#007bff'
        make_payment_button[0].style.cursor = 'pointer'
        make_payment_button[0].disabled = false
    }
}

const make_pending_payment = () =>{
    loading({type:'LOADING'})    
    const payment = readStorage('payment')
    if(payment){
        payWithPaystack(payment.payment.orderId, 
            payment.payment.Total, 
            payment.payment.email)
    }
    loading({type:'LOADED'})   
    set_pending_payment()
 
}

set_pending_payment()

for (const button of make_payment_button) {
    button.addEventListener('click', onSubmit)
}
const pending_payment_button = document.getElementById('make_payment')
pending_payment_button.addEventListener('click', make_pending_payment)

const delete_consultation_button = document.getElementById('delete_consultation')
const delete_consultation = () =>{
    loading({type:'LOADING'})

    ProcessOrder({action:'delete',orderId: readStorage('payment').payment.orderId})
    .then(data=>{
        payment({type:'CLEAR'})
        set_pending_payment()
    }
       )
    .catch(err=>console.log(err)) 

    loading({type:'LOADED'})

}

delete_consultation_button.addEventListener('click', delete_consultation)

