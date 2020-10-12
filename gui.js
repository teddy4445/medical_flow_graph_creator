const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function changeNodeStatus()
{
	var e = document.getElementById("node_type");
	NODE_STATUS = e.options[e.selectedIndex].value;
}

function changeEdgeStatus()
{
	var e = document.getElementById("edge_type");
	EDGE_STATUS = e.options[e.selectedIndex].value;
}

function setOrganNodeSettings()
{
	var organ_name = document.getElementById("organ_name").value;
	var lip = document.getElementById("lip").value;
	var ts = document.getElementById("ts").value;
	
	if (organ_name == "" || lip == "" || ts == "")
	{
		alert("Fill all the needed data");
		return false;
	}
	
	$('#organ_add_panel').hide();
	ORGAN_PANEL_OPEN = false;
	setTimeout(function(){ IS_PANEL_OPEN = false; }, 20);
	loop();
	return true;
}

function PickRatBloodVassal()
{
	var e = document.getElementById("model_bv_node_count");
	var rat_blood_value = e.options[e.selectedIndex].value;
	document.getElementById("value_holder_rat_blood_vassals").value = rat_blood_value;
	var id_and_name = e.options[e.selectedIndex].innerHTML.split("|");
	document.getElementById("value_holder_rat_blood_vassals_name").value = "[" + id_and_name[0] + "] " + id_and_name[1];
	document.getElementById("edge_w").value = data[parseInt(id_and_name[0])-1][3] * 10000; // 3 is the index of the radius in the array
	
	if (rat_blood_value == "")
	{
		alert("You need to pick an element");
		return false;
	}
	// Don't delete cause this makes problem with the delete option in the model
	// delete this option
	// e.remove(e.selectedIndex);
	
	$('#rat_blood_vassal_panel').hide();
	RAT_BLOOD_PANEL_OPEN = false;
	setTimeout(function(){ IS_PANEL_OPEN = false; }, 20);
	loop();
	return true;
}

function pickNode()
{
	var node_id = document.getElementById("node_id").value;
	
	// do nothing if no node id
	if (node_id == "")
	{
		return false;
	}
	
	// check if we have such node, if we do - pick it, unpick all other nodes
	fg.pick_only(node_id);
	return false;
}


function keyPressed() 
{
	// if panel open, ignore short keys
	if (IS_PANEL_OPEN)
	{
		return;
	}
	
	if (keyCode === 79) // code of 'O'
	{
		document.getElementById("node_type").selectedIndex = 0;
		NODE_STATUS = "o";
	}
	
	if (keyCode === 66) // code of 'b'
	{
		document.getElementById("node_type").selectedIndex = 1;
		NODE_STATUS = "b";
	}
	
	if (keyCode === 65) // code of 'a'
	{
		document.getElementById("edge_type").selectedIndex = 0;
		EDGE_STATUS = "a";
	}
	
	if (keyCode === 86) // code of 'v'
	{
		document.getElementById("edge_type").selectedIndex = 1;
		EDGE_STATUS = "v";
	}
	
	if (keyCode === 83) // code of 's'
	{
		downloadasTextFile("fg_save_version.txt", JSON.stringify(fg));
		downloadasTextFile("fg_py_code.txt", fg.to_string());
	}
	
	if (keyCode === 76) // code of 'l'
	{
		$('#load_data_file').show();
		IS_PANEL_OPEN = true;
	}
	
	if (keyCode === 80) // code of 'p'
	{
		IS_PRINT_MODE = !IS_PRINT_MODE;
	}
	
	if (keyCode === 82) // code of 'r'
	{
		if (fg.nodes_count() == 0)
		{
			alert("add at least one node to the flow graph");
			return;
		}
		$('#release_fg_panel').show();
		IS_PANEL_OPEN = true;
	}
	
	if (keyIsDown(17) && keyIsDown(90)) // 'crtl' + 'z' keys download
	{
		// load last model
		if (last_fg.size() != 0)
		{
			// load last fg
			fg = last_fg.pop();	
			
			// update stats
			document.getElementById("nodes_count").innerHTML = "" + fg.nodes_count();
			document.getElementById("edges_count").innerHTML = "" + fg.edges_count();
	
			// update graph
			drawHistogram();
		}
		else
		{
			alert("No more undo action avalible"); 
		}
	}
	
	if (keyIsDown(17) && keyIsDown(67)) // 'crtl' + 'c' keys download
	{
		// load last model
		if (fg.nodes_count() > 0 && !is_copyed && fg._delete_happend == 0)
		{
			// load last fg
			fg.copy_reverse();
			
			// update stats
			document.getElementById("nodes_count").innerHTML = "" + fg.nodes_count();
			document.getElementById("edges_count").innerHTML = "" + fg.edges_count();
	
			// update graph
			drawHistogram();
			
			// make sure no 2 copies on the same graph has been done
			is_copyed = true;
		}
		else
		{
			alert("Cannot copy a graph more then once"); 
		}
	}
}

// download a .txt file into your computer
function downloadasTextFile(filename, text) 
{
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);	
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();	
	document.body.removeChild(element);
}

function closeLoadModelPanel()
{
	$('#load_data_file').hide();
	IS_PANEL_OPEN = false;
}

function closeReleasePanel()
{
	$('#release_fg_panel').hide();
	IS_PANEL_OPEN = false;
}

function releaseModel()
{
	var population_of_nanorobotics_size = document.getElementById("population_of_nanorobotics_size").value;
	var population_of_nanorobotics_half_life = document.getElementById("population_of_nanorobotics_half_life").value;
	var mnr_state_code = document.getElementById("mnr_state_code").value;
	var injection_node_index = document.getElementById("injection_node_index").value;
	var global_interaction_protocol = document.getElementById("global_interaction_protocol").value;
	var drugs = document.getElementById("drugs").value;
	
	if (population_of_nanorobotics_size == "" ||
		population_of_nanorobotics_half_life == "" ||
		mnr_state_code == "" ||
		injection_node_index == "" ||
		drugs == "" ||
		global_interaction_protocol == "")
	{
		alert("Fill all the needed data");
		return false;
	}
	var drugs_list = drugs.split(",");
	var drugs_string = "{";
	for (var i = 0; i < drugs_list.length; i++)
	{
		drugs_string += "\"" + drugs_list[i] + "\": 0, ";
	}
	drugs_string += "}";
	
	var answer = fg.to_string(drugs_string);
	answer += "\nflow_graph = ConvertGraphToCircular.convert(fg=flow_graph)\nnano_size = " + population_of_nanorobotics_size + "\npopulation_decay = MnrPopulationDecay(original_size=nano_size, half_life=" + population_of_nanorobotics_half_life + ")\nmnr_population = MnrPopulation(initial_population=[MNR(index=index, kill_tics=population_decay.get_next_kill_tics(), state=" + mnr_state_code + ") for index in range(nano_size)])\nflow_graph.inject_population(node_index=" + injection_node_index + ", population=mnr_population.get_population())\nglobal_interaction_protocol = GlobalInteractionProtocol(global_interaction_protocol=" + global_interaction_protocol + "())\nmodel = BloodMnrModel(flow_graph=flow_graph, mnr_population=mnr_population, global_interaction_protocol=global_interaction_protocol)";
	
	downloadasTextFile("fg_with_metadata_py_code.txt", answer);
	$('#release_fg_panel').hide();
	IS_PANEL_OPEN = false;
}

$(document).on('change', '#fg_load_file', function(event) 
{
	var reader = new FileReader();
	reader.onload = function(event) 
	{
		fg = FlowGraph.from_json(JSON.parse(event.target.result));
	
		// update stats
		document.getElementById("nodes_count").innerHTML = "" + fg.nodes_count();
		document.getElementById("edges_count").innerHTML = "" + fg.edges_count();
	}
	
	reader.readAsText(event.target.files[0]);
	$('#load_data_file').hide();
	IS_PANEL_OPEN = false;	
});