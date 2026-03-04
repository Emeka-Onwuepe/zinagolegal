const loaderContainer = document.getElementById('loaderContainer')
// read local storage
const readStorage = (slice) =>{
    return JSON.parse(localStorage.getItem(slice)) || null
}

const writeStorage = (slice, data) =>{
    localStorage.setItem(slice, JSON.stringify(data))
}

const deleteStorage = (slice) =>{
    localStorage.removeItem(slice)
}

const addcommas = (num) =>{
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const loading = (action='none') =>{
    let state = readStorage('loading') || {loading: false}
    if (action.type == 'LOADING') {
            loaderContainer.style.display = 'block'
            state = {...state, loading: true}
    }else if (action.type == 'LOADED') {
            loaderContainer.style.display = 'none'
            state = {...state, loading: false}
    }
    writeStorage('loading', state)
    return state
}

const user = (action='none') =>{
    let state = readStorage('user') || {user: null}
    if (action.type == 'SET') {
            state = {...state, user: action.user}
    }else if (action.type == 'UPDATE') {
            state = {...state, user: null}
            deleteStorage('user')
            return null
    }
    writeStorage('user', state)
    return state
}

const payment = (action='none') =>{
    let state = readStorage('payment') || {payment: null}
    if (action.type == 'SET') {
    
            state = {...state, payment: action.payment}
    }else if (action.type == 'CLEAR') {
            deleteStorage('payment')
            return null
    } 
    writeStorage('payment', state)
    return state
}  

loading({type:'LOADED'})