import './style.css'

const container = document.getElementById("app");

const userI = document.querySelector(".usersInfo");

const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = `
  <div class="modal-content">
    <span class="close">&times;</span>
    <div class="comments-container"></div>
  </div>
`;
document.body.appendChild(modal);

// Функции для работы с модальным окном
function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
  modal.querySelector('.comments-container').innerHTML = '';
}

// Обработчики для модального окна
modal.querySelector('.close').addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});


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
      UserCard.tabIndex = 0;
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
                card.innerHTML = `
                <h2>${post.id}- ${post.title}</h2>
                <p>${post.body}</p>
                <div class="div-of-buttons">
                  <button class="buttonC" data-post-id="${post.id}">More</button>
                  <button class="buttonD" data-post-id="${post.id}">Delete</button>
                </div>
                <div class="like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill btn-like" tabindex="0" viewBox="0 0 16 16">
  <path data-id-post="${post.id}" class="like-path" d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
</svg>
                  <span>${post.likes || 0}</span>
                </div>`;
                card.classList.add('card');
                container.append(card);
            });
        })
        .catch(error => console.error(error));
}

container.addEventListener('click', (event) => {
  if (event.target.classList.contains('buttonC')) {
    const postId = event.target.dataset.postId;
    fetchCommentsByPost(postId);
  }
});
function fetchCommentsByPost(postId) {
  fetch(`http://localhost:3000/comments?postId=${postId}`)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error(`${response.status} — ${response.statusText}`);
    })
    .then(comments => {
      const commentsContainer = modal.querySelector('.comments-container');
      commentsContainer.innerHTML = `<h3 class="com_post">Comments for post ${postId}</h3>`;
      
      comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
          <h4>${comment.id}) ${comment.name} (${comment.email})</h4>
          <p>${comment.body}</p>
        `;
        commentsContainer.appendChild(commentElement);
      });
      
      openModal();
    })
    .catch(error => console.error(error));
}


// --------------------лайки - метод patch----------------------
document.querySelector(".app_c").addEventListener('click',(e)=>{
  if(e.target.classList.contains("like-path")){
    let idPost = e.target.dataset.idPost;
    let number = +e.target.closest('.like').querySelector('span').innerText + 1;
    fetch("http://localhost:3000/posts/"+idPost,
      {
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        },
        method: "PATCH",
        body:JSON.stringify({
          "likes":number
        })
      }
    ).catch((error) => console.log(error))
  }
});
//--------------------------------Delete------------------------------
document.querySelector(".app_c").addEventListener('click',(e)=>{
  if(e.target.classList.contains("buttonD")){
    let idPost = e.target.dataset.postId;
    fetch(`http://localhost:3000/posts/${idPost}`,
      {
        method: 'DELETE',
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        }
      }
    ).then(data => data.json())
    .then(json => console.log(json))
    .catch((error)=> console.log(error))
  }
});

//---------------------------------Post-----------------------------
const modalCreate = document.querySelector(".modal-create-post");
const createPostButton = document.querySelector(".create-post-button");

function openModalCreate() {
  modalCreate.style.display = 'block';
}
createPostButton.addEventListener('click', openModalCreate);

function closeModalCreate() {
  modalCreate.style.display = 'none';
}
modalCreate.querySelector('.close').addEventListener('click', closeModalCreate);

let formCreate = document.getElementById("form-create-post");

const usersResponse = await fetch('http://localhost:3000/users');
let users = await usersResponse.json();

function populateAuthorsSelect() {
  const authorSelect = document.getElementById('author-select');
  
  users.forEach(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.name || `User ${user.id}`;
    authorSelect.appendChild(option);
  });
}
populateAuthorsSelect();

formCreate.addEventListener('submit' ,async(e)=>{
    e.preventDefault();
  let data = {
    "userId": document.getElementById("author-select").value,
    "title":document.getElementById("title").value,
    "body": document.getElementById("body").value
  }
  console.log(data);
  let response = await fetch(`http://localhost:3000/posts`,
      {
        method: 'POST',
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  let result = await response.json();

  alert(result.message);
})




//---------------------------------LocalStorage---------------------
//---------------------------------1)Theme--------------------------

const btnLight = document.getElementById("light-theme");
const btnDark = document.getElementById("dark-theme");

let browserTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
browserTheme = browserTheme ? "dark" : "light";

let theme = localStorage.getItem('theme') || browserTheme;
if(theme === 'light'){
  btnLight.checked = true;
}
else{
  btnDark.checked = true;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/src/dark.css";
  link.id = "dark-style"
  document.querySelector("head").append(link);
}

btnLight.addEventListener("change", () =>{
  localStorage.setItem("theme","light");
  document.getElementById("dark-style").remove();
})
btnDark.addEventListener("change", () =>{
  localStorage.setItem("theme","dark");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/src/dark.css";
  link.id = "dark-style"
  document.querySelector("head").append(link);
})