// Import stylesheets
import "./style.css";

$("#btn-get-posts").click(() => getPosts());

function getPosts() {
  $.ajax({
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/",
    dataType: "json",
    success: posts => appendPostToBody(posts)
  });
}

function appendPostToBody(posts) {
  posts
    .filter((post, index) => index < 15)
    .forEach(post => {
      $("body").append(getPostHtml(post));
    });
}

function getPostHtml(postData) {
  return `
    	<div>
      	<p>Post id: ${postData.id}</p>
        <p>User id: ${postData.userId}</p>
        <label for="title">Post title: </label>
        	<input type="text" name="title" value="${postData.title}">
				<label for="body">Post body: </label>
        	<textarea name="body">${postData.body}</textarea>
      </div>
    `;
}
