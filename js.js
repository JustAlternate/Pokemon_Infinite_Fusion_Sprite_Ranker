fetch('https://justalternate.fr:8080/nbr_of_total_fusion')
	.then((response) => {
		return response.text();
	})
	.then((html) => {
		    document.getElementById("total_fusion_label").innerHTML += html;
	})

if (localStorage.getItem('favorites') == null){
	localStorage.setItem('favorites',JSON.stringify([]));
}

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}

function fetch_stats(){
    fetch('https://justalternate.fr:8080/nbr_of_votes')
		.then((response) => {
			return response.text();
		})
		.then((html) => {
			    document.getElementById("total_votes_label").innerHTML = "Total Votes from the Community : "+html;
		})

    fetch('https://justalternate.fr:8080/nbr_of_fusion_0_votes')
		.then((response) => {
			return response.text();
		})
		.then((html) => {
			    document.getElementById("total_fusion_0_votes").innerHTML = "Remaining sprites with less than 2 total votes : "+html;
		})
}


function fetch_to_api(endpoint){
	// Stop buttons to work during the fetchs request.
	document.getElementById("button_heart").onclick=null; 
	document.getElementById("button_refresh").onclick=null; 
	document.getElementById("button_pass").onclick=null; 

	// Get what fusion was shown before
	const fusion = document.getElementById("fusion_name").innerHTML;

	if (endpoint == "smash"){
    		var favorites = JSON.parse(localStorage.getItem('favorites'));
		favorites.push(fusion);
		console.log(favorites);
		localStorage.setItem('favorites',JSON.stringify(favorites));
	}
	// Check if we want to make a post request
	if (endpoint == "smash" || endpoint == "pass"){
		fetch('https://justalternate.fr:8080/'+endpoint,{
		  method: 'POST',
		  body: JSON.stringify({fusion_name: fusion}),
		  headers:{
		    'Content-Type': 'application/json'
		  }
		})
		.then((response) => {
		  return response.json();
		})
		.then((data) => {
		  console.log(data);
		})
	}
	// Finish by fetching a new fusion and updating stats
	new_fusion();
}
async function new_fusion(){
    // Fetch a random fusion using API
    fetch('https://justalternate.fr:8080/less_viewed_pokemon')
		.then((response) => {
			return response.text();
		})
		.then((html) => {
			    // Show the newly fetched fusion
			    const lines = html.split('\n');
		 	    // Update current fusion name for future post request
			    document.getElementById("fusion_name").innerHTML = lines[0];
    			    document.getElementById("image_fusion").src=("CustomBattlers2/"+lines[0]+"");
    			    document.getElementById("parent1").src=("VanillaBattlers/"+lines[1]+".png");
    			    document.getElementById("parent2").src=("VanillaBattlers/"+lines[2]+".png");
		})
    // Wait a 500 ms before reactivate buttons in order to avoid spam
    await new Promise(resolve => setTimeout(resolve, 500));
    document.getElementById("button_heart").onclick=function(){fetch_to_api('smash');}; 
    document.getElementById("button_refresh").onclick=function(){fetch_to_api('refresh');}; 
    document.getElementById("button_pass").onclick=function(){fetch_to_api('pass');};
    fetch_stats();
} 

async function fetch_leaderboard(){
    const leaderboard_div = document.getElementById("leaderboard");
    while (leaderboard_div.hasChildNodes()){
    	leaderboard_div.removeChild(leaderboard_div.firstChild);
    }
    document.getElementById("button_leaderboard").onclick=null; 
    fetch('https://justalternate.fr:8080/leaderboard')
		.then((response) => {
			return response.text();
		})
		.then((html) => {
			console.log(html);
			const lines = html.split('\n');
			for (var i=0; i< lines.length-1; i++){
				let elem = lines[i];
				let elem_split_point = elem.split('.');
				let parent1 = elem_split_point[0];
				let elem_of_leaderboard = document.createElement("img")
				elem_of_leaderboard.src = ("CustomBattlers2/"+elem+"");
				leaderboard_div.appendChild(elem_of_leaderboard);


			}
		})
    await new Promise(resolve => setTimeout(resolve, 5000));
    document.getElementById("button_leaderboard").onclick=function(){fetch_leaderboard();}; 
}


async function fetch_last_voted(){
    const leaderboard_div = document.getElementById("leaderboard");
    while (leaderboard_div.hasChildNodes()){
    	leaderboard_div.removeChild(leaderboard_div.firstChild);
    }
    document.getElementById("button_last_voted").onclick=null; 
    fetch('https://justalternate.fr:8080/last_voted_fusion')
		.then((response) => {
			return response.text();
		})
		.then((html) => {
			console.log(html);
			const lines = html.split('\n');
			for (var i=0; i< lines.length-1; i++){
				let elem = lines[i];
				let elem_split_point = elem.split('.');
				let parent1 = elem_split_point[0];
				let elem_of_leaderboard = document.createElement("img")
				elem_of_leaderboard.src = ("CustomBattlers2/"+elem+"");
				leaderboard_div.appendChild(elem_of_leaderboard);
			}
		})
    await new Promise(resolve => setTimeout(resolve, 5000));
    document.getElementById("button_last_voted").onclick=function(){fetch_last_voted();}; 
}

function show_favorite(){
    var favorites = JSON.parse(localStorage.getItem('favorites'));
    const leaderboard_div = document.getElementById("leaderboard");
    while (leaderboard_div.hasChildNodes()){
    	leaderboard_div.removeChild(leaderboard_div.firstChild);
    }
    for (var i = 0; i < favorites.length; i++){
	let parent1 = favorites[i].split('.')[0];
	let elem_of_leaderboard = document.createElement("img");
	elem_of_leaderboard.src = ("CustomBattlers2/"+favorites[i]+"");
	leaderboard_div.appendChild(elem_of_leaderboard);
    }
}
