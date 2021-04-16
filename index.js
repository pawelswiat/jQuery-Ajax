// Import stylesheets
import "./style.css";

$("#createPost").submit(() => addNewPost(event)) 

function addNewPost(event) {
	event.preventDefault();
  let setPostTitle = $("#post-title-input").val();
  let setPostBody = $("#post-body-input").val(); 
	
 	$.ajax({
  		url: 'https://jsonplaceholder.typicode.com/posts',
	    method: 'POST',
    	data: {
      	userId: "999",
        title: setPostTitle,
        body: setPostBody
      },
      success: (post) => {
      	appendPostToBody(post);
        alert('Post został dodany')
      }
	  })
}


$("#btn-get-posts").click(() => getPosts());

function getPosts() {
  $.ajax({
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/",
    dataType: "json",
    success: posts => appendPostsToBody(posts)
  });
}

function appendPostToBody(post) {
	$("body").append(getPostHtml(post));
}

function appendPostsToBody(posts) {
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
      <hr>
    `;
}