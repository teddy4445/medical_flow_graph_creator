class ShowEdge
{
	constructor(x1, y1, x2, y2, name, type)
	{
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.name = name;
		this.type = type;
		this.centerPoint = halfWayDot(this.x1, this.y1, this.x2, this.y2);
		var m = line_m(this.x1, this.y1, this.x2, this.y2);
		if (this.y1 == this.y2)
		{
			this.rotation = 0;
		}
		else if (this.x1 == this.x2)
		{
			this.rotation = 90;
		}
		else if (m != 0)
		{
			this.rotation = Math.atan(m) / Math.PI * 180;
		}
		else
		{
			this.rotation = 0;
		}
		this.tringle_dots = [];
		var dist = 5;
		var dist_squre = dist * dist;
		var start_node = new Point(x1, y1);
		var end_node = new Point(x2, y2);
		if (end_node.x == start_node.x)
		{
			var base_y = end_node.y - dist;
			if (end_node.y < start_node.y)
			{
				base_y = end_node.y + dist;
			}
			var second_point = new Point(end_node.x + dist, base_y);
			var third_point = new Point(end_node.x - dist, base_y);
		}
		else if (end_node.y == start_node.y)
		{
			var base_x = end_node.x - dist;
			if (end_node.x < start_node.x)
			{
				base_x = end_node.x + dist;
			}
			var second_point = new Point(base_x, end_node.y + dist);
			var third_point = new Point(base_x, end_node.y - dist);
		}
		else
		{					
			var m = line_m(start_node.x, start_node.y, end_node.x, end_node.y);
			var ortogonal_m = -1 / m;
			var inner_dist = 1;
			if (end_node.x > start_node.x)
			{
				while (dist2d(new Point(end_node.x - inner_dist, end_node.y - inner_dist * m), end_node) < dist_squre)
				{
					inner_dist += 1;
				}
				var base_x = end_node.x - inner_dist;
				var base_y = end_node.y - inner_dist * m;
			}
			else
			{
				while (dist2d(new Point(end_node.x + inner_dist, end_node.y + inner_dist * m), end_node) < dist_squre)
				{
					inner_dist += 1;
				}
				var base_x = end_node.x + inner_dist;
				var base_y = end_node.y + inner_dist * m;
			}
			inner_dist = 1;
			while (dist2d(new Point(base_x + inner_dist, base_y + inner_dist * ortogonal_m), new Point(base_x - inner_dist, base_y - inner_dist * ortogonal_m)) < dist_squre)
			{
				inner_dist += 1;
			}
			var second_point = new Point(base_x + inner_dist, base_y + inner_dist * ortogonal_m);
			var third_point = new Point(base_x - inner_dist, base_y - inner_dist * ortogonal_m);
		}
		this.tringle_dots.push(new Point(end_node.x, end_node.y));
		this.tringle_dots.push(second_point);
		this.tringle_dots.push(third_point);
	}
	
	copy()
	{
		var answer = new ShowEdge(this.x1, this.y1, this.x2, this.y2, this.name, this.type);
		answer.need_show = this.need_show;
		return answer;
	}
	
	static from_json(json)
	{
		var answer = new ShowEdge(json.x1, json.y1, json.x2, json.y2, json.name, json.type);
		answer.need_show = json.need_show;
		return answer;
	}
	
	show(nodes) 
	{
		if (IS_PRINT_MODE)
		{
			return;
		}
		
		strokeWeight(1);
		stroke(6, 255, 136);
		line(this.x1, this.y1, this.x2, this.y2);	
		strokeWeight(0);
		textSize(10);
		rectMode(CENTER);
		angleMode(DEGREES);
		push();
		var text_width = textWidth(this.name);
		fill(255);
		var shift = 3;
		if (this.rotation == 90) // x1 = x2
		{
			translate(this.centerPoint.x + shift, this.centerPoint.y - text_width / 2);	
		}
		else if (this.rotation == 0) // y1 = y2
		{
			translate(this.centerPoint.x - text_width / 2, this.centerPoint.y - shift);		
		}
		else if(this.rotation > 0 && this.rotation < 90)
		{
			translate(this.centerPoint.x - text_width * this.rotation / 180, this.centerPoint.y - text_width * this.rotation / 180);		
		}
		else if(this.rotation < 0 && this.rotation > -90)
		{
			translate(this.centerPoint.x - text_width / 2, this.centerPoint.y - text_width * Math.atan(this.rotation) / 6.28);		
		}
		
		rotate(this.rotation);
		text(this.name, 0, 0);
		pop();
		// print the type of this vassal
		if (this.type == RED_TYPE)
		{
			fill("#a20420");
		}
		else if (this.type == BLUE_TYPE)
		{
			fill("#4224FF");
		}
		var r = 8;
		ellipse(this.centerPoint.x, this.centerPoint.y, r, r);
		// print direction triangle
		fill(0, 220, 111);
		triangle(this.tringle_dots[0].x, 
				this.tringle_dots[0].y, 
				this.tringle_dots[1].x, 
				this.tringle_dots[1].y, 
				this.tringle_dots[2].x, 
				this.tringle_dots[2].y)	
	}
}

class Edge
{
	constructor(start_node_id, end_node_id, w, type, need_show = true)
	{
		this.start_node_id = start_node_id;
		this.end_node_id = end_node_id;
		this.w = w;
		this.type = type;
		this.need_show = need_show;
		this.tringle_dots = [];
	}
	
	copy()
	{
		var answer = new Edge(this.start_node_id, this.end_node_id, this.w, this.type);
		answer.need_show = this.need_show;
		return answer;
	}
	
	static from_json(json)
	{
		var answer = new Edge(json.start_node_id, json.end_node_id, json.w, json.type);
		answer.need_show = json.need_show;
		return answer;
	}
	
	hide()
	{
		this.need_show = false;
	}
	
	allow_show()
	{
		this.need_show = true;
	}
	
	show(nodes) 
	{
		// if don't need to show just jump it
		if (!this.need_show && !IS_PRINT_MODE)
		{
			return;
		}
		
		try
		{
			if (this.type == RED_TYPE)
			{
				stroke("#DB4437");
				fill("#a20420");
			}
			else if (this.type == BLUE_TYPE)
			{
				stroke("#4285F4");
				fill("#4224FF");
			}
			// stroke("#fcce76");
			
			if (IS_PRINT_MODE)
			{
				var show_w = this.w / 1000;
				if (show_w < 1)
				{
					show_w = 1;
				}
				strokeWeight(show_w);	
			}
			else
			{
				strokeWeight(1);	
			}
			
			var start_node = null;
			var end_node = null;
			for(var i = 0; i < nodes.length; i++)
			{
				if (nodes[i].id == this.start_node_id)
				{
					start_node = nodes[i];
				}
				if (nodes[i].id == this.end_node_id)
				{
					end_node = nodes[i];
				}
			}
			// print line
			line(start_node.x, start_node.y, end_node.x, end_node.y);		
			// check if need to calc tringle_dots or not
			if (this.tringle_dots.length == 0)
			{
				var dist = 5;
				var dist_squre = dist * dist;
				
				if (end_node.x == start_node.x)
				{
					var base_y = end_node.y - dist;
					if (end_node.y < start_node.y)
					{
						base_y = end_node.y + dist;
					}
					var second_point = new Point(end_node.x + dist, base_y);
					var third_point = new Point(end_node.x - dist, base_y);
				}
				else if (end_node.y == start_node.y)
				{
					var base_x = end_node.x - dist;
					if (end_node.x < start_node.x)
					{
						base_x = end_node.x + dist;
					}
					var second_point = new Point(base_x, end_node.y + dist);
					var third_point = new Point(base_x, end_node.y - dist);
				}
				else
				{					
					var m = line_m(start_node.x, start_node.y, end_node.x, end_node.y);
					var ortogonal_m = -1 / m;
					var inner_dist = 1;
					if (end_node.x > start_node.x)
					{
						while (dist2d(new Point(end_node.x - inner_dist, end_node.y - inner_dist * m), end_node) < dist_squre)
						{
							inner_dist += 1;
						}
						var base_x = end_node.x - inner_dist;
						var base_y = end_node.y - inner_dist * m;
					}
					else
					{
						while (dist2d(new Point(end_node.x + inner_dist, end_node.y + inner_dist * m), end_node) < dist_squre)
						{
							inner_dist += 1;
						}
						var base_x = end_node.x + inner_dist;
						var base_y = end_node.y + inner_dist * m;
					}
					inner_dist = 1;
					while (dist2d(new Point(base_x + inner_dist, base_y + inner_dist * ortogonal_m), new Point(base_x - inner_dist, base_y - inner_dist * ortogonal_m)) < dist_squre)
					{
						inner_dist += 1;
					}
					var second_point = new Point(base_x + inner_dist, base_y + inner_dist * ortogonal_m);
					var third_point = new Point(base_x - inner_dist, base_y - inner_dist * ortogonal_m);
				}
				this.tringle_dots.push(new Point(end_node.x, end_node.y));
				this.tringle_dots.push(second_point);
				this.tringle_dots.push(third_point);
			}
			// print direction triangle
			if (!IS_PRINT_MODE)
			{
				triangle(this.tringle_dots[0].x, 
						this.tringle_dots[0].y, 
						this.tringle_dots[1].x, 
						this.tringle_dots[1].y, 
						this.tringle_dots[2].x, 
						this.tringle_dots[2].y)	
			}		
		}
		catch (error)
		{
			console.log("Cannot draw line with nodes ids: (" + this.start_node_id + ", " + this.end_node_id + ")");
		}
	}
	
	to_string()
	{
		return "WEdge(source_node_index=" + (this.start_node_id - 1) + ", target_node_index=" + (this.end_node_id - 1) + ", score=" + this.w + ")";
	}
}