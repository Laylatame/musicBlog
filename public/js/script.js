
//import { request } from "http";

function navigationMenu(){
    console.log("Ya corrio");
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
                let buttonFav = (`<div id="buttonFav"><button type='submit' class='addFavorite'> Add to favorites </button></div>`);
                //let buttonFav = (`<div id="buttonFav">${response[i].button}</div>`);
                let secc = $(buttonFav)[0].childNodes[0].className;
                //if(secc == "addFavorite"){
                    $('.blogPostsHome').append(`<div class="post"> ${title} ${author} ${id} ${date} ${content} ${buttonFav}</div>`);
                //}
                //console.log(secc[0].childNodes[0].className);
                console.log(secc);
                cont--;
                } 
            }
        },
        error: function(err){
            if(err.statusText = "404"){
                $('.blogPostsHome').append(`<p>Not logged in<p>`);
            }
            console.log("Error");
        }
    });

    initFavorites();
}

function initFavorites(){
    

    $(".favBlogsHome").empty();

    $.ajax({
        url: "http://localhost:8080/api/favorites",
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
                let buttonFav = (`<div id="buttonFav"><button type='submit' class='favoriteHome'> Delete from Favorites</button></div>`);
                let secc = $(buttonFav)[0].childNodes[0].className;
                $('.favBlogsHome').append(`<div class="post"> ${title} ${author} ${id} ${date} ${content} ${buttonFav}</div>`);
                console.log(secc);
                cont--;
                } 
            }
        },
        error: function(err){
            if(err.statusText = "404"){
                $('.favBlogsHome').append(`<p>Not logged in<p>`);
            }
            console.log("Error");
        }
    });
}

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


$("#loginSubmit").on("click", (event) => {
    event.preventDefault();
    console.log("Authenticate");

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
        },
        error: function(err){
            console.log(err.statusText);
            return err;
        }

    });
})

$("#postBlog").on("click", (event) => {
    event.preventDefault();
    console.log("Post blog");
    $.ajax({
        url: "http://localhost:8080/api/blog-posts",
        data: JSON.stringify({
            "title": $("#titlePost").val(),
            "content": $("#contentPost").val(),
            //"author": $("#authorPost").val(),
            "publishDate": new Date()
        }),
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            $(".errorPost").empty();
            console.log("success post");
            console.log(response.message);
            $("#titlePost").val("");
            $("#contentPost").val("");
            init();
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
    let postID = divButton[0].childNodes[5];
    if(buttonFav.hasClass("favoriteHome")){
        buttonFav[0].className = "addFavorite";
        buttonFav[0].textContent = "Add to favorites";

        $.ajax({
            url: "http://localhost:8080/api/deleteFavorite",
            data: JSON.stringify({
                "postId": postID.innerHTML
            }),
            method: "GET",
            dataType: "json",
            success: function(response){
                for(let i=0; i<response.length; i++){
                    if(response[i].postId == postID.innerHTML){
                        console.log(response[i]._id)
                        $.ajax({
                            url: "http://localhost:8080/api/deleteFavorite",
                            data: JSON.stringify({
                                "id": response[i]._id
                            }),
                            method: "DELETE",
                            dataType: "json",
                            contentType: "application/json",
                            success: function(response){
                                console.log("Si cottio esto" + i);
                                console.log(response);
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
                "postId": postID.innerHTML
            }),
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            success: function(response){
                console.log(this);
            },
            error: function(err){
                console.log(err.statusText);
            }
        });

        buttonFav[0].className = "favoriteHome";
        buttonFav[0].textContent = "Delete from favorites";
        console.log(divButton);
        divButton[0].hidden = true;
    }
});

/*
$("#deleteBlog").on("click", (event) => {
    event.preventDefault();
    console.log("Delete blog");

    let id = $("#idDelete").val();

    $.ajax({
        url: "http://localhost:8080/api/blog-posts" + "/" + id,
        data: JSON.stringify({"id": id}),
        method: "DELETE",
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            $(".errorDelete").empty();
            console.log(response.message);
            $("#idDelete").val("");
            init();
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

$("#update").on("click", (event) => {
    event.preventDefault();
    console.log("Update blog");
    //console.log($("#title").val()); -> Mandar como undefined

    let id = $("#idUpdate").val();
    console.log(id);

    let content = {
        "title": $("#titleUpdate").val() != "" ? $("#titleUpdate").val() : undefined,
        "content": $("#contentUpdate").val() != "" ? $("#contentUpdate").val() : undefined,
        "author": $("#authorUpdate").val() != "" ? $("#authorUpdate").val() : undefined,
        "publishDate": new Date() //Como hacer para que lea el input
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
            console.log(response.message);
            $("#idUpdate").val("");
            $("#titleUpdate").val("");
            $("#contentUpdate").val("");
            $("#authorUpdate").val("");
            init();
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
*/
navigationMenu();
init();