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
                <button class="buttonC" data-post-id="${post.id}">more</button>
                <div class="like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill btn-like" viewBox="0 0 16 16">
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