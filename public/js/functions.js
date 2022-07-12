document.querySelectorAll('.register-passwords').forEach(item => {
    item.addEventListener('change', (e) => {
        var passwords = document.querySelectorAll('.register-passwords')
        if (passwords[0].value === passwords[1].value){
            console.log("passwords matches")
            document.querySelector('#register-btn').removeAttribute('disabled')
        } else {
            document.querySelector('#register-btn').setAttribute('disabled')
        }
    })
})