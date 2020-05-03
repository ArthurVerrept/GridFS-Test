// const clothesList = document.getElementById('picme');
// fetch('http://localhost:5000/dashboard/getPics')
// .then(res => res.json())
// .then((item) => {
//     //.map() is used to cycle through the array, and a template literal is used to return HTML for
//     //each item in the array. We call these contact, and we can access items inside each contact, using contact.NAMEOFITEM. InnerHTML is then used to parse the returned HTML to the contactList object
//     let dataFeed = item.map((item) => {
//         return `
//         <br>
//         <div>
//             <p>${item.filename}</p>
//             <p>${item.brand}</p>
//             <p>${item.itemName}</p>
//         </div>
//         <hr>
//     `
//     }).join('');
//     clothesList.innerHTML = dataFeed;
// })
// .catch(err => { throw err });