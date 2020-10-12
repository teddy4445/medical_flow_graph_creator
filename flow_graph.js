let last_fg = new Stack();

function add_last_fq(new_fq)
{
	last_fg.push(new_fq);	
	if (last_fg.size() > 10)
	{
		last_fg.pop_end();
	}
}

class FlowGraph
{
	constructor()
	{
		this.nodes = [];
		this.edges = [];
		this.show_edges = [];
		this._marked_nodes = 0;
		this._running_id = 1;
		this._delete_happend = 0;
	}
	
	copy()
	{
		var answer = new FlowGraph();
		answer._running_id = this._running_id;
		answer._delete_happend = this._delete_happend;
		for (var i = 0; i < this.nodes.length; i++)
		{
			answer.nodes.push(this.nodes[i].copy());
		}
		for (var i = 0; i < this.edges.length; i++)
		{
			answer.edges.push(this.edges[i].copy());
		}
		for (var i = 0; i < this.show_edges.length; i++)
		{
			answer.show_edges.push(this.show_edges[i].copy());
		}
		return answer;
	}
	
	static from_json(json)
	{
		var answer = new FlowGraph();
		answer._running_id = json._running_id;
		for (var i = 0; i < json.nodes.length; i++)
		{
			answer.nodes.push(Node.from_json(json.nodes[i]));
		}
		for (var i = 0; i < json.edges.length; i++)
		{
			answer.edges.push(Edge.from_json(json.edges[i]));
		}
		for (var i = 0; i < json.show_edges.length; i++)
		{
			answer.show_edges.push(ShowEdge.from_json(json.show_edges[i]));
		}
		return answer;
	}
	
	nodes_count()
	{
		return this.nodes.length;
	}
	
	edges_count()
	{
		return this.edges.length;
	}
	
	picked_status()
	{
		return (this._marked_nodes > 0);
	}
	
	add_node(x, y, type, organ_name, lip, ts)
	{
		add_last_fq(this.copy());
		var next_id = this._running_id;
		var change_in_delete = false;
		if (this._delete_happend > 0)
		{
			change_in_delete = true;
			var ids = [];
			for (var i = 0; i < this.nodes.length; i++)
			{
				ids.push(this.nodes[i].id);
			}
			
			if(ids.length == 0)
			{
				this._running_id = 2;
				this._delete_happend = 0;
				next_id = 1;
			}
			
			else if(!ids.includes(1))
			{
				this._delete_happend -= 1;
				next_id = 1;
			}
			else
			{
				ids.sort((a,b)=>a-b);
				for (var i = 0; i < ids.length - 1; i++)
				{
					if(ids[i + 1] - ids[i] != 1)
					{
						next_id = ids[i] + 1;
						break;
					}
				}	
				if (next_id == this._running_id)
				{
					next_id = Math.max(...ids) + 1;
				}
				this._delete_happend -= 1;
			}
		}
		this.nodes.push(new Node(next_id, x, y, type, organ_name, lip, ts));
		console.log("Add node with id = " + next_id);
		if (this._delete_happend == 0 && !change_in_delete)
		{
			this._running_id += 1;
		}
	}
	
	delete_node(node_index)
	{
		IS_PANEL_OPEN = true;
		add_last_fq(this.copy());
		var node_id = this.nodes[node_index].id;
		var i = 0;
		var delete_edge_count = 0;
		while(i < this.edges.length)
		{
			if (this.edges[i].start_node_id == node_id || this.edges[i].end_node_id == node_id)
			{
				this.edges.splice(i, 1);
				i -= 1;
				delete_edge_count += 1;
			}
			i += 1;
		}
		this.nodes.splice(node_index, 1);
		console.log("Delete node with id = " + node_id + ", with " + delete_edge_count + " edges");
		this._delete_happend += 1;
		IS_PANEL_OPEN = false;
	}
	
	try_delete_edge(x, y)
	{
		IS_PANEL_OPEN = true;
		var id_to_index = {};
		for (var i = 0; i < this.nodes.length; i++)
		{
			id_to_index[this.nodes[i].id] = i;
		}
		
		for (var i = 0; i < this.edges.length; i++)
		{
			if (this.edges[i].need_show && distToSegment(new Point(x, y), this.nodes[id_to_index[this.edges[i].start_node_id]], this.nodes[id_to_index[this.edges[i].end_node_id]]) < MAX_R)
			{
				add_last_fq(this.copy());
				console.log("Delete edge with points: (" + this.edges[i].start_node_id + ", " + this.edges[i].end_node_id + ")");
				this.edges.splice(i, 1);
				break;
			}
		}
		IS_PANEL_OPEN = false;
	}
	
	try_delete_show_edge(x, y)
	{	
		IS_PANEL_OPEN = true;
		for (var i = 0; i < this.show_edges.length; i++)
		{
			if (distToSegment(new Point(x, y), new Point(this.show_edges[i].x1, this.show_edges[i].y1), new Point(this.show_edges[i].x2, this.show_edges[i].y2)) < MAX_R)
			{
				add_last_fq(this.copy());
				var name = this.show_edges[i].name;
				console.log("Delete show edge named: " + name);
				
				for (var node_index = 0; node_index < this.nodes.length; node_index++)
				{
					if(this.nodes[node_index].organ_name.includes(name))
					{
						this.delete_node(node_index);
						node_index -= 1;
					}
				}
				
				this.show_edges.splice(i, 1);
				break;
			}
		}
		IS_PANEL_OPEN = false;
	}
	
	add_edge(node_i_index, node_j_index, w, type)
	{
		add_last_fq(this.copy());
		var node_i_id = this.nodes[node_i_index].id;
		var node_j_id = this.nodes[node_j_index].id;	
		
		if (this.has_this_edge(node_i_index, node_j_index))
		{
			return false;
		}
		
		this.edges.push(new Edge(node_i_id, node_j_id, w, type));
		console.log("Add edge with points: (" + node_i_id + ", " + node_j_id + ")");
		return true;
	}
	
	add_show_edge(start_node_index, end_node_index, name, edge_status)
	{
		IS_PANEL_OPEN = true;
		add_last_fq(this.copy());
		if (this.has_this_edge(start_node_index, end_node_index))
		{
			this.try_delete_edge(this.nodes[start_node_index].x, this.nodes[end_node_index].y);
		}
		
		this.show_edges.push(new ShowEdge(this.nodes[start_node_index].x, this.nodes[start_node_index].y,
										  this.nodes[end_node_index].x, this.nodes[end_node_index].y,
										  name, edge_status));
		IS_PANEL_OPEN = false;
	}
	
	has_this_edge(node_i_index, node_j_index)
	{
		var node_i_id = this.nodes[node_i_index].id;
		var node_j_id = this.nodes[node_j_index].id;
		
		for (var i = 0; i < this.edges.length; i++)
		{
			if ((this.edges[i].start_node_id == node_i_id && this.edges[i].end_node_id == node_j_id) || 
				(this.edges[i].start_node_id == node_j_id && this.edges[i].end_node_id == node_i_id))
			{
				return true;
			}
		}
		return false;
	}
	
	nextToNode(x, y)
	{
		var best_node = ERROR_VALUE;
		var best_score = MAX_R + 1;
		for (var i = 0; i < this.nodes.length; i++)
		{
			var score = int(dist(this.nodes[i].x, this.nodes[i].y, x, y));
			if(score < MAX_R && this.nodes[i].need_show)
			{
				if (score < best_score)
				{
					best_node = i;
					best_score = score;
				}
			}
		}
		return best_node;
	}
	
	get_picked_node()
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			if(this.nodes[i].marked)
			{
				return i;
			}
		}
		return ERROR_VALUE;
	}
	
	pick_only(node_id)
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].marked = false;
			if(this.nodes[i].id == node_id)
			{
				this.nodes[i].marked = true;
			}
		}
		this._marked_nodes = 1;
	}
	
	is_node_marked(node_index)
	{
		return this.nodes[node_index].marked;
	}
	
	mark_node(node_index)
	{
		this.nodes[node_index].mark();
		this._marked_nodes += 1;
	}
	
	unmark_node(node_index)
	{
		this.nodes[node_index].unmark();
		this._marked_nodes -= 1;
	}
	
	show()
	{
		if (!IS_PRINT_MODE)
		{
			for (var i = 0; i < this.nodes.length; i++)
			{
				this.nodes[i].show();
			}
			for (var i = 0; i < this.edges.length; i++)
			{
				this.edges[i].show(this.nodes);
			}
			for (var i = 0; i < this.show_edges.length; i++)
			{
				this.show_edges[i].show(this.nodes);
			}
		}
		else
		{
			// the order is replaced and the show edges is useless so do not run on it 
			for (var i = 0; i < this.edges.length; i++)
			{
				this.edges[i].show(this.nodes);
			}
			for (var i = 0; i < this.nodes.length; i++)
			{
				this.nodes[i].show();
			}
			
		}
	}
	
	node_status(x, y)
	{
		var node_index = this.nextToNode(x, y);
		if (node_index == ERROR_VALUE)
		{
			return "";
		}	
		else
		{
			return this.nodes[node_index].to_string_status();
		}
	}
	
	degree_histogram()
	{
		var degreesPerNode = [];
		for (var i = 0; i < this.nodes.length; i++)
		{
			degreesPerNode.push(0);
		}
		for (var i = 0; i < this.edges.length; i++)
		{
			degreesPerNode[this.edges[i].start_node_id] += 2;
			degreesPerNode[this.edges[i].end_node_id] += 2;
		}
		
		var degrees = {};
		for (var i = 0; i < degreesPerNode.length; i++)
		{
			if (!(degrees[degreesPerNode[i]] === undefined))
			{
				degrees[degreesPerNode[i]] += 1;
			}
			else
			{
				degrees[degreesPerNode[i]] = 1;
			}
		}
		var answer = [];
		for (var value in degrees)
		{
			answer.push([parseInt(value), degrees[value]]);
		}
		return answer;
	}
	
	copy_reverse()
	{
		// find the most "x" location and add to it 'x_marge' to all new edges
		var max_x = 0;
		for (var i = 0; i < this.nodes.length; i++)
		{
			if (this.nodes[i].x > max_x)
			{
				max_x = this.nodes[i].x;
			}
		}
		var last_id = this._running_id - 1;
		// add all the needed nodes
		var so_far_nodes = this.nodes.length;
		for (var i = 0; i < so_far_nodes; i++)
		{
			var this_node = this.nodes[i];
			this_node.allow_show(); // show on the original graph too
			this.add_node(this_node.x + max_x, this_node.y, BLOOD_VASSAL, "", "", this_node.ts);
		}
		// add all edges and show edges but on the opposite side
		var so_far_edges = this.edges.length;
		for (var i = 0; i < so_far_edges; i++)
		{
			var this_edge = this.edges[i];
			var new_type = BLUE_TYPE;
			if (this_edge.type == BLUE_TYPE)
			{
				new_type = RED_TYPE;
			}
			this.edges.push(new Edge(last_id + this_edge.end_node_id , last_id + this_edge.start_node_id, this_edge.w, new_type, false));
		}
		var so_far_show_edges = this.show_edges.length;
		for (var i = 0; i < so_far_show_edges; i++)
		{
			var this_show_edge = this.show_edges[i];
			var new_type = BLUE_TYPE;
			if (this_show_edge.type == BLUE_TYPE)
			{
				new_type = RED_TYPE;
			}
			this.show_edges.push(new ShowEdge(this_show_edge.x2 + max_x, this_show_edge.y2,
											  this_show_edge.x1 + max_x, this_show_edge.y1,
											  this_show_edge.name + " (backward)",
											  new_type));
		}
	}
	
	to_string(drugs)
	{
		var organs = "organs = [";
		var vassals = "vassals = ["; 	
		var organs_count = 0; 	
		var vassal_count = 0;
		for (var i = 0; i < this.nodes.length; i++)
		{
			if (this.nodes[i].type == ORGAN)
			{
				organs += this.nodes[i].to_string(drugs, organs_count) + ", ";
				organs_count += 1;	
			}
		} 
		for (var i = 0; i < this.nodes.length; i++)
		{
			if (this.nodes[i].type != ORGAN)
			{
				vassals += this.nodes[i].to_string(drugs, vassal_count + organs_count) + ", ";
				vassal_count += 1;	
			}
		} 
		organs += "]";
		vassals += "]";
		
		var edges = "edges = [";
		for (var i = 0; i < this.edges.length; i++)
		{
			edges += this.edges[i].to_string();
			if (i != this.edges.length - 1)
			{
				edges += ", ";
			}
		}
		edges += "]";
		
		return edges + "\n" + vassals + "\n" + organs + "\nflow_graph = MnrFlowGraph(organs=organs, vassals=vassals, edges=edges)";
	}
}