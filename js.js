

fetch('https://justalternate.fr:8080/nbr_of_total_fusion')
	.then((response) => {
		return response.text();
	})
	.then((html) => {
		    document.getElementById("total_fusion").innerHTML = html;
	})


function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}

function fetch_stats(){
    fetch('https://justalternate.fr:8080/nbr_of_votes')
		.then((response) => {
			return response.text();
		})
		.then((html) => {
			    document.getElementById("total_votes").innerHTML = html;
		})
}


function fetch_to_api(endpoint){
	// Stop buttons to work during the fetchs request.
	document.getElementById("button_heart").onclick=null; 
	document.getElementById("button_refresh").onclick=null; 
	document.getElementById("button_pass").onclick=null; 

	// Get what fusion was shown before
	const fusion = document.getElementById("fusion_name").innerHTML;

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
    			    document.getElementById("image_fusion").src=("CustomBattlers/"+lines[1]+"/"+lines[0]+"");
    			    document.getElementById("parent1").src=("VanillaBattlers/"+lines[1]+".png");
    			    document.getElementById("parent2").src=("VanillaBattlers/"+lines[2]+".png");
		})
    // Wait a 700 ms before reactivate buttons in order to avoid spam
    await new Promise(resolve => setTimeout(resolve, 1000));
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
			for (var i=0; i< lines.length -1; i++){
				let elem = lines[i];
				let elem_split_point = elem.split('.');
				let parent1 = elem_split_point[0];
				let elem_of_leaderboard = document.createElement("img")
				elem_of_leaderboard.src = ("CustomBattlers/"+parent1+"/"+elem+"");
				leaderboard_div.appendChild(elem_of_leaderboard);


			}
		})
    await new Promise(resolve => setTimeout(resolve, 5000));
    document.getElementById("button_leaderboard").onclick=function(){fetch_leaderboard();}; 
}
