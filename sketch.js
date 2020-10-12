// ------------------- GLOBAL VARS ------------------------ // 

// canvas Z-Index
var ERROR_VALUE = -1;
var zIndex = 300;
var gridSize = 80;
var box_size = 1;
let fg = null;
var histogramData = [];

// edges
var BLUE_TYPE = 1;
var RED_TYPE = 2;

// nodes
var ORGAN = 1;
var BLOOD_VASSAL = 2;
var MAX_R = 0;

// organ status
var NODE_STATUS = "o";
var EDGE_STATUS = "a";
var ORGAN_PANEL_OPEN = false;
var RAT_BLOOD_PANEL_OPEN = false;
var IS_PANEL_OPEN = false;
var is_copyed = false;
var IS_PRINT_MODE = false;


// ------------------- END OF GLOBAL VARS ------------------------ // 

// setup all the simulation before starting 
function setup() {
	// set up the simulator in the page
	widthElement = document.getElementById('game-holder').getBoundingClientRect().width;
	box_size = widthElement / gridSize * 2;
	MAX_R = box_size - 1;
	var cnv = createCanvas(widthElement, widthElement * 2);
	cnv.parent('game');
	fg = new FlowGraph();
	noCursor();
}

// loop run on the simulation
function draw() 
{
	drawGrid();
	fg.show();
	putMouse();
}


async function mouseClicked() 
{
	// if panel open, ignore short keys
	if (IS_PANEL_OPEN || keyIsDown(69) || IS_PRINT_MODE) // 'E' key code
	{
		return;
	}
	
	var nowMouseX = mouseX;
	var nowMouseY = mouseY;
	
	// if click outside the panel, ignore it
	if (mouseX > widthElement || mouseX < 0 || mouseY > widthElement * 2 || mouseY < 0)
	{
		return;
	}
	
	// find if hiting some node
	var nextToNode = fg.nextToNode(nowMouseX, nowMouseY);
	
	if (keyIsDown(16) && keyIsDown(17)) // if 'shift' + 'crtl' pressed 
	{
		if (nextToNode != ERROR_VALUE)
		{	
			if (fg.picked_status())
			{
				var old_w = document.getElementById("edge_w").value;
				var pickedIndex = fg.get_picked_node();
				$('#rat_blood_vassal_panel').show();
				RAT_BLOOD_PANEL_OPEN = true;
				IS_PANEL_OPEN = true;
				noLoop();
				while(RAT_BLOOD_PANEL_OPEN)
				{
					await sleep(1000);
				}
				// put points
				var nodes_count = parseInt(document.getElementById("value_holder_rat_blood_vassals").value);
				var nodes_name = document.getElementById("value_holder_rat_blood_vassals_name").value;
				var w = document.getElementById("edge_w").value;
				// right type of edge
				var edge_status = RED_TYPE;
				if (EDGE_STATUS == "v")
				{
					edge_status = BLUE_TYPE;
				}
				
				for (var i = 1; i < nodes_count - 1; i++)
				{
					var point = locationBetweenDots(fg.nodes[pickedIndex], fg.nodes[nextToNode], nodes_count - 1 - i, nodes_count - 1);
					fg.add_node(point.x, point.y, BLOOD_VASSAL, nodes_name + " (" + i + ")", "", 1);
					fg.nodes[fg.nodes.length - 1].hide();
					// add line from first dot
					if (i == 1)
					{
						fg.add_edge(pickedIndex, fg.nodes.length - 1, w, edge_status);
					}	
					else // dot between 2 lines
					{
						fg.add_edge(fg.nodes.length - 2, fg.nodes.length - 1, w, edge_status);
					}
					fg.edges[fg.edges.length - 1].hide();
				}
				fg.add_edge(fg.nodes.length - 1, nextToNode, w, edge_status); // close line
				fg.edges[fg.edges.length - 1].hide();
				fg.add_show_edge(pickedIndex, nextToNode, nodes_name, edge_status); // the line to show in the visualization but not in the model
				fg.unmark_node(pickedIndex);
				document.getElementById("node_id").value = "";
				document.getElementById("edge_w").value = old_w;
			}
			else
			{
				fg.mark_node(nextToNode);
				document.getElementById("node_id").value = fg.nodes[nextToNode].id;
			}
		}
	}
	else if (!keyIsDown(16)) // if 'shift' is not pressed
	{
		// check if next to node, if not this is a new node
		if (nextToNode == ERROR_VALUE)
		{	
			var organ_name = "";
			var lip = "";
			var ts = 1;
			// add new node
			var node_type = ORGAN;
			if (NODE_STATUS == "b")
			{
				node_type = BLOOD_VASSAL;
			}
			else
			{
				$('#organ_add_panel').show();
				ORGAN_PANEL_OPEN = true;
				IS_PANEL_OPEN = true;
				noLoop();
				while(ORGAN_PANEL_OPEN)
				{
					await sleep(1000);
				}
				var organ_name = document.getElementById("organ_name").value;
				document.getElementById("organ_name").value = "";
				var lip = document.getElementById("lip").value;
				var ts = document.getElementById("ts").value;
			}
			fg.add_node(Math.round(nowMouseX / box_size) * box_size, Math.round(nowMouseY / box_size) * box_size, node_type, organ_name, lip, ts);
		}
		else // picked a node 
		{
			// if this node picked, unpick it
			if (fg.is_node_marked(nextToNode))
			{
				fg.unmark_node(nextToNode);
				document.getElementById("node_id").value = "";
			}
			else // not a picked node
			{
				// if second node or first
				if (fg.picked_status())
				{
					var pickedIndex = fg.get_picked_node();
					var w = document.getElementById("edge_w").value;
					if (w == "")
					{
						w = 1;
					}					
					var edge_status = RED_TYPE;
					if (EDGE_STATUS == "v")
					{
						edge_status = BLUE_TYPE;
					}
					fg.add_edge(pickedIndex, nextToNode, parseInt(w), edge_status);
					fg.unmark_node(pickedIndex);
					document.getElementById("node_id").value = "";
				}
				else
				{
					fg.mark_node(nextToNode);
					document.getElementById("node_id").value = fg.nodes[nextToNode].id;
				}
			}
		}
	}
	else
	{
		// check if next to node, if does - remove it
		if (nextToNode != ERROR_VALUE)
		{
			// just to make sure we don't delete something marked
			if (fg.is_node_marked(nextToNode))
			{
				fg.unmark_node(nextToNode);
			}
			fg.delete_node(nextToNode);
		}
		else // check if need to delete edge
		{
			fg.try_delete_edge(mouseX, mouseY);
			fg.try_delete_show_edge(mouseX, mouseY);
		}
	}
	
	// update stats
	document.getElementById("nodes_count").innerHTML = "" + fg.nodes_count();
	document.getElementById("edges_count").innerHTML = "" + fg.edges_count();
	
	// just to make sure won't be changes in the table 
	if (fg.nodes_count() > 0)
	{
		document.getElementById("blood_vassal_node_form").style.display = "none";
	}
	
	// update graph
	drawHistogram();
}


// print the grid, just to make things nice to show
function drawGrid()
{
	if (IS_PRINT_MODE)
	{
		background(255); // make the canvas black
		return;
	}
	else
	{
		background(0); // make the canvas black	
	}
	var boxSize = widthElement / gridSize;
	
	// set the center lines
	strokeWeight(1);
	stroke(120);
	line(0, boxSize * gridSize, height, boxSize * gridSize);
	line(boxSize * gridSize / 2, 0, boxSize * gridSize / 2, width * 2);
	
	// make box's lines white
	fill(255);
	stroke(255);
	strokeWeight(0.1);
	// print - lines 
	for (var index = 0; index < gridSize * 2; index++)
	{
		line(0, boxSize * index, height, boxSize * index);
	}
	// print | lines 
	for (var index = 0; index < gridSize; index++)
	{
		line(boxSize * index, 0, boxSize * index, width * 2);
	}
}

function putMouse()
{
	strokeWeight(0);
	
	if (keyIsDown(16) && keyIsDown(17)) // 'shift' + "crtl" key code
	{
		fill(255);
		text("m", mouseX - 10, mouseY - 5);
		stroke(6, 255, 136);
	}
	else if (keyIsDown(16)) // 'shift' key code
	{
		fill(255);
		text("-", mouseX - 7, mouseY - 5);
		stroke(255, 50, 0);	
	}
	else if (keyIsDown(69)) // 'E' key code
	{
		var boxSize = widthElement / gridSize;
		// check if "move" mode is on
		fill(220);
		var textStatus = fg.node_status(mouseX, mouseY);
		if (textStatus != "")
		{
			rect(0, Math.max(0, mouseY - 200), Math.min(2 * textWidth(textStatus) + 20, widthElement), boxSize * 3);
			fill(0);
			text(textStatus, 5, Math.max(20, mouseY - 200));	
		}
		fill(255);
		text("i", mouseX - 7, mouseY - 5);
		stroke(0, 100, 255);
	}
	else
	{
		textSize(10);
		fill(255);
		if (NODE_STATUS == "o")
		{
			text("o", mouseX - 7, mouseY - 5);
			stroke(150, 100, 200);
		}
		else
		{
			text("b", mouseX - 7, mouseY - 5);
			stroke(255, 204, 0);	
		}
	}
	strokeWeight(3);
	line(mouseX - 5, mouseY, mouseX + 5, mouseY);
	line(mouseX, mouseY - 5, mouseX, mouseY + 5);

}