// Import stylesheets

$("#get-posts-btn").on("click", () => getPosts());
$("#add-new-post").on("submit", (event) => addNewPost(event));
$("div.posts").on("click", ".delete-post-btn", function() {
  deletePost($(this));
});
$("div.posts").on("click", ".edit-post-btn", function() {
  editPost($(this));
});
$("div.posts").on("click", ".get-post-comments-btn", function() {
  getPostComments($(this));
});


function getPostComments($button) {
  let postId = $button.parent().attr("data-post_id");
  let path = `/posts/${postId}/comments`;

  ajaxGet(path, (data) => {
    appendCommentsToView(data);
  });
}

function appendCommentsToView(comments) {
  comments.forEach(comment =>
    $("div[data-post_id=" + comment.postId + "]")
      .find(".post-comments")
      .append(getCommentHtml(comment))
  );
}

function getCommentHtml(comment) {
  return `
  	<div>
    	<p>Komentarz posta o id: ${comment.postId}</p>
      <p>Id komentarza: ${comment.id}</p>
      <p>Email: ${comment.email}</p>
      <p>Nazwa: ${comment.name}</p>
      <p>Treść komentarza ${comment.body}</p>
    </div>
  `;
}

function editPost($button) {
  let postId = $button.parent().attr("data-post_id");
  let path = `/posts/${postId}`;
  let data = {
    title: $button.siblings("input").val(),
    body: $button.siblings("textarea").val()
  };
  updatePost(path, data);
}

function deletePost($button) {
  let postId = $button.parent().attr("data-post_id");
  let path = `/posts/${postId}`;

  ajaxDelete(path, () => {removePostFromView(postId)});
  
}

function removePostFromView(postId) {
  $("div[data-post_id=" + postId + "]").remove();
}

function addNewPost(event) {
  event.preventDefault();

  let path = "/posts";
  let data = {
    userId: "999",
    title: $("#new-post-title-input").val(),
    body: $("#new-post-body-textarea").val()
  };
  ajaxPost(path, data, (data) => appendPostToPostsDiv(data));
}

function appendPostToPostsDiv(post) {
  $("div.posts").append(getPostHtml(post));
}

function appendPostsToPostsDiv(posts) {
  posts
    //.filter((post, index) => index < 2)
    .forEach(post => appendPostToPostsDiv(post));
}

function getPostHtml(post) {
  return `
  	<div data-post_id="${post.id}">
    	<p>Post id: ${post.id}</p>
    	<p>User id: ${post.userId}</p>
     	<label for="post-title-input">Post title: </label>
      	<input type="text" name="post-title-input" value="${post.title}" /><br />
     	<label for="post-body-textarea">Post body: </label>
      	<textarea name="post-body-textarea">${post.body}</textarea>
      <button type="button" class="delete-post-btn">Usun Post</button>
      <button type="button" class="edit-post-btn">Edytuj Post</button>
      <button type="button" class="get-post-comments-btn">Pokaż komentarze</button>
      <div class="post-comments"></div>
    <hr>
    </div>
 `;
}

function updatePost(path, data) {
  ajaxPut(path, data, (response) => {
    alert("Post id: " + response.id + " został edytowany");
  })
}

function getPosts() {
  ajaxGet('/posts', (data) => appendPostsToPostsDiv(data));
}

function ajaxPut(path, data, onSuccess) {
  ajax('PUT', path, onSuccess, { data: data });
}

function ajaxDelete(path, onSuccess) {
  ajax('DELETE', path, onSuccess);
}

function ajaxPost(path, data, onSuccess) {
  ajax('POST', path, onSuccess, {
    data: data
  });
} 

function ajaxGet(path, onSuccess) {
  ajax('GET', path, onSuccess, {
    dataType: "JSON"
  });
}

function ajax(method, path, onSuccess, extraSettings = {}) {
  $.ajax({
    method: method,
    url: `https://6082afec5dbd2c001757a40f.mockapi.io` + path,
    success: (data) => onSuccess(data),
    ...extraSettings,
    error: (error) => handleError(error)
  });
}

function handleError(error) {
  alert("Wystąpił błąd");
} 