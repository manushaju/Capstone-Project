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

// function initMap(){
//     console.log("addede")
//     const map_location = { lat: -25.344, lng: 131.031}

//     const map = new google.maps.Map(document.getElementById(map), {
//         zoom: 4,
//         center: map_location,
//     })

//     const marker = new google.maps.Marker({
//         position: uluru,
//         map: map,
//       });
// }