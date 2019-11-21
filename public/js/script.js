
//import { request } from "http";

function navigationMenu(){
    let menuItems = document.getElementsByTagName( "li" );

    for ( let i = 0; i < menuItems.length; i ++ ){
    menuItems[i].addEventListener( "click", (event) =>{
      event.preventDefault();
      
      let selected = document.getElementsByClassName( "selected" );

      selected[0].className = "";

      event.target.className = "selected";

      let currentSelected = document.getElementsByClassName( "currentSelected" );

      currentSelected[0].hidden = true;
      currentSelected[0].className = "";

      let selectedSection = document.getElementById(event.target.id + "Page");

      selectedSection.hidden = false;
      selectedSection.className = "currentSelected";
    });
  }
}


$("#search").submit(function(Event){
    event.preventDefault();

    var searchTerm = ($("#searchTerm").val());

    //Search
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + searchTerm,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
            "x-rapidapi-key": "35f511e5e4msh7ef135374e3c625p125036jsn0ac6584820aa"
        }
    }
    
    $.ajax(settings).done(function (response) {
        let ejemplo = response.data[3].artist.name;
        for(let i=0; i<5; i++){
            $('#searchResults').append(`<li>${response.data[i].artist.name}</li>`)
        //Agregar boton
        }
        console.log(response.data);
    });

})

function emptyAll(){
    $(".blogPosts").empty();
    $("#title").val("");
    $("#content").val("");
    $("#author").val("");
    $("#id").val("");
}


function init(){

    $(".blogPostsHome").empty();
    $(".favBlogsHome").empty();


    $.ajax({
        url: "http://localhost:8080/api/blog-posts",
        method: "GET",
        dataType: "json",
        success: function(response){
            var cont = 10;
            for (let i=0; i<response.length; i++){
                if(cont>0){
                let title = (`<h2>${response[i].title}</h2>`);
                let author = (`<h4> Written by: ${response[i].author}</h4>`);
                let date = (`<h6>Published on: ${response[i].publishDate}</h6>`);
                let content = (`<p>${response[i].content}</p>`);
                let id = (`<h6 id="postIdHome">ID: ${response[i]._id} </h6>`);
                let buttonFav = (`<div id="buttonFav"><button type='submit' class='addFavorite'> Add to favorites </button></div>`);
                //let secc = $(buttonFav)[0].childNodes[0].className;
                $('.blogPostsHome').append(`<div class="post"> ${title} ${author} ${id} ${date} ${content} ${buttonFav}</div>`);
                cont--;
                } 
            }
        },
        error: function(err){
            if(err.statusText = "404"){
                $('.blogPostsHome').append(`<p>Not logged in. Proceed to login page.<p>`);
            }
            console.log("Error");
        }
    });


    $.ajax({
        url: "http://localhost:8080/api/getFavorites",
        method: "GET",
        dataType: "json",
        success: function(response){
            var cont = 10;
            for (let i=0; i<response.length; i++){
                if(cont>0){
                let title = (`<h2>${response[i].title}</h2>`);
                let author = (`<h4> Written by: ${response[i].author}</h4>`);
                let date = (`<h6>Published on: ${response[i].publishDate}</h6>`);
                let content = (`<p>${response[i].content}</p>`);
                let id = (`<h6 id="postIdHome">ID: ${response[i]._id} </h6>`);
                let buttonFav = (`<div id="buttonFav"><button type='submit' class='favoriteHome'> Add to favorites </button></div>`);
                //let secc = $(buttonFav)[0].childNodes[0].className;
                $('.favBlogsHome').append(`<div class="post"> ${title} ${author} ${id} ${date} ${content} ${buttonFav}</div>`);
                cont--;
                } 
            }
        },
        error: function(err){
            if(err.statusText = "404"){
                console.log("404");
            }
            console.log("Error");
        }
    });
};

function reload(){

    $(".blogPostsHome").empty();
    $(".favBlogsHome").empty();


    $.ajax({
        url: "http://localhost:8080/api/blog-posts",
        method: "GET",
        dataType: "json",
        success: function(response){
            var cont = 10;
            for (let i=0; i<response.length; i++){
                if(cont>0){
                let title = (`<h2>${response[i].title}</h2>`);
                let author = (`<h4> Written by: ${response[i].author}</h4>`);
                let date = (`<h6>Published on: ${response[i].publishDate}</h6>`);
                let content = (`<p>${response[i].content}</p>`);
                let id = (`<h6 id="postIdHome">ID: ${response[i]._id}</h6>`);
                let buttonFav = (`<div id="buttonFav">${response[i].button}</div>`);
                //let secc = $(buttonFav)[0].childNodes[0].className;
                $('.blogPostsHome').append(`<div class="post"> ${title} ${author} ${id} ${date} ${content} ${buttonFav}</div>`);
                cont--;
                } 
            }
        },
        error: function(err){
            if(err.statusText = "404"){
                $('.blogPostsHome').append(`<p>Not logged in. Proceed to login page.<p>`);
            }
            console.log("Error");
        }
    });


    $.ajax({
        url: "http://localhost:8080/api/getFavorites",
        method: "GET",
        dataType: "json",
        success: function(response){
            var cont = 10;
            for (let i=0; i<response.length; i++){
                if(cont>0){
                let title = (`<h2>${response[i].title}</h2>`);
                let author = (`<h4> Written by: ${response[i].savedBy}</h4>`);
                let date = (`<h6>Published on: ${response[i].publishDate}</h6>`);
                let content = (`<p>${response[i].content}</p>`);
                let id = (`<h6 id="postIdHome">ID: ${response[i]._id}</h6>`);
                //let buttonFav = (`<div id="buttonFav"><button type='submit' class='favoriteHome'> Delete from Favorites</button></div>`);
                let buttonFav = (`<div id="buttonFav">${response[i].button}</div>`);
                $('.favBlogsHome').append(`<div class="post"> ${title} ${author} ${id} ${date} ${content} ${buttonFav}</div>`);
                cont--;
                } 
            }
        },
        error: function(err){
            if(err.statusText = "300"){
                $('.favBlogsHome').append(`<p>Not logged in. Proceed to login page.<p>`);
            }
            console.log("Error");
        }
    });
};

function initMyPosts(username){
    $(".postsMyBlogs").empty();

    $.ajax({
        url: "http://localhost:8080/api/getUserReviews",
        data: JSON.stringify({
            "username": username
        }),
        method: "GET",
        dataType: "json",
        success: function(response){
            for (let i=0; i<response.blogPosts.length; i++){
                if(response.username == response.blogPosts[i].author){
                let title = (`<h2>${response.blogPosts[i].title}</h2>`);
                let author = (`<h4> Written by: ${response.blogPosts[i].author}</h4>`);
                let date = (`<h6>Published on: ${response.blogPosts[i].publishDate}</h6>`);
                let content = (`<p>${response.blogPosts[i].content}</p>`);
                let id = (`<h6 id="postIdHome">ID: ${response.blogPosts[i]._id} </h6>`);
                $('.postsMyBlogs').append(`<div class="post"> ${title} ${author} ${id} ${date} ${content}</div>`);
                }
            }
        },
        error: function(err){
            if(err.statusText = "404"){
                $('.postsMyBlogs').append(`<p>Not logged in. Proceed to login page.<p>`);
            }
            console.log(err.status);
        }
    });
};


//Add new user
$("#registerSubmit").on("click", (event) => {
    event.preventDefault();
    $("#showErrorRegister").empty();

    $.ajax({
        url: "http://localhost:8080/api/register",
        data: JSON.stringify({
            "username": $("#usernameRegister").val(),
            "password": $("#passwordRegister").val(),
        }),
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            $("#usernameRegister").val("");
            $("#passwordRegister").val("");

        },
        error: function(err){
            console.log(err.statusText);
            $("#showErrorRegister").append(`<p class="errorMessage">Username is taken. Please choose another one.</p>`);
            return err;
        }

    });
})

//Initiate user session
$("#loginSubmit").on("click", (event) => {
    event.preventDefault();

    $.ajax({
        url: "http://localhost:8080/api/auth",
        data: JSON.stringify({
            "username": $("#usernameLogin").val(),
            "password": $("#passwordLogin").val(),
        }),
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            $("#usernameLogin").val("");
            $("#passwordLogin").val("");
            document.getElementById("register").hidden = true;
            document.getElementById("login").hidden = true;
            document.getElementById("logout").hidden = false;
            document.getElementById("loginPage").hidden = true;
            document.getElementById("homePage").hidden = false;
            document.getElementById("home").className = "selected";
            document.getElementById("login").className = "";
            document.getElementById("homePage").className = "currentSelected";
            document.getElementById("loginPage").className = "";
            init();
            initMyPosts(response);
        },
        error: function(err){
            console.log(err.statusText);
            return err;
        }

    });
})

//Write new review
$("#postBlog").on("click", (event) => {
    event.preventDefault();

    $.ajax({
        url: "http://localhost:8080/api/blog-posts",
        data: JSON.stringify({
            "title": $("#titlePost").val(),
            "content": $("#contentPost").val(),
            //"author": $("#authorPost").val(),
            "publishDate": new Date(),
            "button": `<button type='submit' class='addFavorite'> Add to favorites </button>`
        }),
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            $(".errorPost").empty();
            $("#titlePost").val("");
            $("#contentPost").val("");
            init();
            initMyPosts(response);
        },
        error: function(err){
            console.log(err.statusText);
            $(".errorPost").text("Error: Fields are incomplete.");
        }

    });
})


$(".blogPostsHome, .favBlogsHome").on("click", "button", function(event) {
    event.preventDefault();

    let buttonFav = $(this);
    let divButton = buttonFav.parent().parent();
    let post = divButton[0].childNodes;

    if(buttonFav.hasClass("favoriteHome")){
        $.ajax({
            url: "http://localhost:8080/api/deleteFavorite",
            data: JSON.stringify({
                "postId": post[5].innerHTML
            }),
            method: "GET",
            dataType: "json",
            success: function(response){
                for(let i=0; i<response.length; i++){
                    let varID = "ID: " + response[i]._id;
                    if(varID == post[5].innerHTML){
                        $.ajax({
                            url: "http://localhost:8080/api/deleteFavorite",
                            data: JSON.stringify({
                                "id": response[i]._id
                            }),
                            method: "DELETE",
                            dataType: "json",
                            contentType: "application/json",
                            success: function(response){
                            },
                            error: function(err){
                                console.log("Error");
                            }
                        });
                    }
                }
            },
            error: function(err){
                console.log("Error");
            }
        });
    } else{
        $.ajax({
            url: "http://localhost:8080/api/addFavorite",
            data: JSON.stringify({
                "postId": post[5].innerHTML,
                "title": post[1].innerHTML,
                "content": post[9].innerHTML,
                "publishDate": post[7].innerHTML,
                "button": `<button type="submit" class="favoriteHome"> Delete from favorites </button>`
            }),
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            success: function(response){
            },
            error: function(err){
                console.log(err.statusText);
            }
        });

        //divButton[0].hidden = true;
    }
    reload();
});


$("#deleteBlog").on("click", (event) => {
    event.preventDefault();

    let id = $("#idDelete").val();

    $.ajax({
        url: "http://localhost:8080/api/deleteReview",
        data: JSON.stringify({"id": id}),
        method: "DELETE",
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            $(".errorDelete").empty();
            $("#idDelete").val("");
            init();
            initMyPosts(response);
        },
        error: function(err){
            console.log(err.status);
            let status = err.status;
            if (! id){
                $(".errorDelete").text("Error: Id is missing.");
                status = 406;
            }
            if (status == 404){
                $(".errorDelete").text("Error: Blog was not found.");
            }
        }

    });
})


$("#updateBlog").on("click", (event) => {
    event.preventDefault();

    let id = $("#idUpdate").val();

    let content = {
        "title": $("#titleUpdate").val() != "" ? $("#titleUpdate").val() : undefined,
        "content": $("#contentUpdate").val() != "" ? $("#contentUpdate").val() : undefined,
    }

    $.ajax({
        url: "http://localhost:8080/api/blog-posts" + "/" + id,
        method: "PUT",
        data: JSON.stringify({
            "id": id,
            "content": content
        }),
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            $(".errorUpdate").empty();
            $("#idUpdate").val("");
            $("#titleUpdate").val("");
            $("#contentUpdate").val("");
            init();
            initMyPosts(response);
        },
        error: function(err){
            console.log(err.status);
            let status = err.status;
            if (! id){
                $(".errorUpdate").text("Error: ID is missing.");
                status = 404;
            }
            if (status == 406){
                $(".errorUpdate").text("Error: Blog was not found.");
            }
        }

    });
})

navigationMenu();
init();
//initMyPosts();