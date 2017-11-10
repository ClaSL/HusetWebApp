function getAllEvents(){
    fetch("http://www.blackbirdmedia.de/wordpress/wp-json/wp/v2/events?_embed&per_page=50")
    .then(res=>res.json())
    .then(showEvents);
}

function getEventsByCategory(id){
    fetch("http://www.blackbirdmedia.de/wordpress/wp-json/wp/v2/events?_embed&categories="+id)
    .then(res=>res.json())
    .then(showEvents);
};

function getSingleEventById(myId){
    console.log(myId);
    fetch("http://www.blackbirdmedia.de/wordpress/wp-json/wp/v2/events/"+myId+"/?_embed")
    .then(res=>res.json())
    .then(showSingleEvent);
};

function getMenu(){
  fetch("http://www.blackbirdmedia.de/wordpress/wp-json/wp/v2/categories")
  .then(e=>e.json())
  .then(showMenu);
};

function showMenu(categories){
    console.log(categories);
    let lt = document.querySelector("#linkTemplate").content;

    categories.forEach(function(category){
        if (category.count > 0){
            let clone = lt.cloneNode(true);
            let parent = document.querySelector("#categorymenu");
            clone.querySelector("a").textContent=category.name;
            clone.querySelector("a").setAttribute("href", "index.html?categoryid="+category.id);
            parent.appendChild(clone);
        }
    });

    //http://marijabelautdinova.com/wp/wp-json/wp/v2/events?categories=7
};

function showSingleEvent(json){
    document.querySelector("#single h1").textContent=json.title.rendered;
    document.querySelector("#single .price span").textContent=json.acf.price;
    document.querySelector("#single img").setAttribute("src", json._embedded["wp:featuredmedia"][0].media_details.sizes.large.source_url);
    document.querySelector(".content").innerHTML = json.content.rendered;

};

function showEvents(data){
    let list = document.querySelector("#list");
    let template = document.querySelector("#eventTemplate").content;

    data.forEach(function(theEvent){
        console.log(theEvent);
        let clone = template.cloneNode(true);
        let title = clone.querySelector("h1");
        //let excerpt = clone.querySelector(".excerpt");
        let smallDescription = clone.querySelector(".small_description")
        let price = clone.querySelector(".price span");
        let img = clone.querySelector("img");
        let link = clone.querySelector("a.read-more");
        let date = clone.querySelector(".event-date");
        let start = clone.querySelector(".starting-time span");


        title.textContent = theEvent.title.rendered;
        //excerpt.innerHTML = theEvent.excerpt.rendered;
        smallDescription.innerHTML = theEvent.acf.small_description;
        price.textContent = theEvent.acf.price;
        date.textContent = theEvent.acf.date;
        start.textContent = theEvent.acf.starting_time;
        console.log(theEvent._embedded["wp:featuredmedia"][0].media_details.sizes);
        img.setAttribute("src", theEvent._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url);

        link.setAttribute("href", "event.html?id="+theEvent.id);

        list.appendChild(clone);
    });
};

let searchParams = new URLSearchParams(window.location.search);
let id = searchParams.get("id");
let categoryid = searchParams.get("categoryid");
//console.log(id);


getMenu();
if(id){
    getSingleEventById(id);
}
if(categoryid){
    getEventsByCategory(categoryid);
}
else {
    getAllEvents();
}
