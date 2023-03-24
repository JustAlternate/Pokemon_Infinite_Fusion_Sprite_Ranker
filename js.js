function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
	// Finish by fetching a new fusion
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
    await new Promise(resolve => setTimeout(resolve, 700));
    document.getElementById("button_heart").onclick=function(){fetch_to_api('smash');}; 
    document.getElementById("button_refresh").onclick=function(){fetch_to_api('pass');}; 
    document.getElementById("button_pass").onclick=function(){fetch_to_api('refresh');}; 
} 
