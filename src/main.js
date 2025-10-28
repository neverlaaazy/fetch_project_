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
                card.innerHTML = `<h2>${post.id}- ${post.title}</h2><p>${post.body}</p><button class="buttonC" data-post-id="${post.id}">more</button>`;
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