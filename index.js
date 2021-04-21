// Import stylesheets

$("#get-posts-btn").on("click", () => getPosts());
$("#add-new-post").on("submit", () => addNewPost(event));
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
	
	ajaxGet(function(data) {
  	appendCommentsToPostCommentsDiv(data, postId, $button);
  }, path);
} 

function appendCommentsToPostCommentsDiv(comments, $button) {
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
  console.log(postId)
  let data = {
    title: $button.siblings("input").val(),
  	body: $button.siblings("textarea").val()
	}
  ajaxUpdate(postId, data);
}

function deletePost($button) {
  let postId = $button.parent().attr("data-post_id");
  let path = `/posts/${postId}`

	ajaxDelete(function() {
  	removePostFromView(postId)
  }, path); 
  
}

function removePostFromView(postId) {
	console.log(postId);
  $("div[data-post_id=" + postId + "]").remove();
}

function addNewPost(event) {
  event.preventDefault();  
  
  let path = "/posts";
  let data = {
  	userId: "999",
  	title: $("#new-post-title-input").val(),
  	body: $("#new-post-body-textarea").val()
  }
  
  ajaxPost(data, appendPostToPostsDiv, path)
  
}

function appendPostToPostsDiv(post) {
  $("div.posts").append(getEachPostHtml(post));
}

function getPosts() {

	let path = "/posts";
	ajaxGet(appendPostsToPostsDiv, path);  
}

function appendPostsToPostsDiv(posts) {
  posts
    //.filter((post, index) => index < 2)
    .forEach(post => $("div.posts").append(getEachPostHtml(post)));
}

function getEachPostHtml(post) {
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

function ajaxUpdate(postId, data) {
	console.log(postId, data)
	$.ajax({
    method: "PUT",
    url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
    data: data,
    success: alert("Post id: " + postId + " został edytowany")
  });
}

function ajaxDelete(onSuccess, path) {
	$.ajax({
    method: "DELETE",
    url: `https://jsonplaceholder.typicode.com` + path,
    success: () => onSuccess()
  });
}

function ajaxPost(data, onSuccess, path) {
	$.ajax({
    method: "POST",
    url: "https://jsonplaceholder.typicode.com" + path,
    data: data,
    success: post => onSuccess(post)
  });
}

function ajaxGet(onSuccess, path) {
	$.ajax({
    method: "GET",
    url: `https://jsonplaceholder.typicode.com` + path,
    dataType: "JSON",
    success: data => onSuccess(data)
  });
}