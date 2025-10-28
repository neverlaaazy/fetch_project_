import './style.css'

const container = document.getElementById("app");

// fetch('http://localhost:3000/posts?userId=1')
//  .then((response) => {
//  	if (response.ok) return response;
//  	throw new Error(`${response.status} — ${response.statusText}`);
//  })
//  .then((response) => response.json())
//  .then((posts) => {
//     posts.forEach((post) => {
//       let card = document.createElement('div');
//       card.innerHTML = `<h2>${post.title}</h2>`;
//       // card.innerHTML = `<h2>${post.body}</h2>`;
//       card.classList.add('card');
//       container.append(card);
//     });
//  })
//  .catch((error) => console.log(error));


const article = document.querySelector(".article");
// async function myFetch(){
//   let response = await fetch('http://localhost:3000/posts/1');
//   let post = await response.json();
//   let card = document.createElement('div');
//   card.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p>`;
//   card.classList.add('card');
//   article.append(card);
//  }

// myFetch();

const userI = document.querySelector(".usersInfo");

fetch('http://localhost:3000/users')
 .then((response) => {
 	if (response.ok) return response;
 	throw new Error(`${response.status} — ${response.statusText}`);
 })
 .then((response) => response.json())
 .then((users) => {
    users.forEach((user) => {
      let UserCard = document.createElement('div');
      UserCard.innerHTML = `<a>${user.id}) ${user.name}</a>`;
      UserCard.classList.add('UserCard');
      UserCard.dataset.userID = user.id;
      UserCard.addEventListener('click', () => {
            fetchPostsByUser(user.id);
        });
      userI.append(UserCard);
    });
 })
 .catch((error) => console.log(error));

 function fetchPostsByUser(userId) {
    fetch(`http://localhost:3000/posts?userId=${userId}`)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`${response.status} — ${response.statusText}`);
        })
        .then(posts => {
            container.innerHTML = '';
            posts.forEach(post => {
                let card = document.createElement('div');
                
                card.innerHTML = `<h2>${post.id}- ${post.title}</h2><p>${post.body}</p>`;
                card.classList.add('card');
                container.append(card);
            });
        })
        .catch(error => console.error(error));
}


// fetch('http://localhost:3000/posts?userId=1')
//  .then((response) => {
//  	if (response.ok) return response;
//  	throw new Error(`${response.status} — ${response.statusText}`);
//  })
//  .then((response) => response.json())
//  .then((posts) => {
//     posts.forEach((post) => {
//       let card = document.createElement('div');
//       card.innerHTML = `<h2>${post.title}</h2>`;
//       // card.innerHTML = `<h2>${post.body}</h2>`;
//       card.classList.add('card');
//       container.append(card);
//     });
//  })
//  .catch((error) => console.log(error));