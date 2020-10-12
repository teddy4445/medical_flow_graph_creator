class Point
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
	
	show() 
	{
		var r = MAX_R / 4;
		ellipse(this.x, this.y, r, r);
	}
	
	copy()
	{
		return new Point(this.x, this.y);
	}
	
}

class Node
{
	constructor(id, x, y, type, organ_name, lip, ts)
	{
		this.id = id;
		this.x = x;
		this.y = y;
		this.type = type;
		this.marked = false;
		this.organ_name = organ_name;
		this.lip = lip;
		this.ts = ts;
		this.need_show = true;
	}
	
	copy()
	{
		var answer = new Node(this.id, this.x, this.y, this.type, this.organ_name, this.lip, this.ts);
		answer.need_show = this.need_show;
		return answer;
	}
	
	static from_json(json)
	{
		var answer = new Node(json.id, json.x, json.y, json.type, json.organ_name, json.lip, json.ts);
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
	
	mark()
	{
		this.marked = true;
	}
	
	unmark()
	{
		this.marked = false;
	}
	
	show() 
	{
		// if don't need to show just jump it
		if (!this.need_show && !this.marked && !IS_PRINT_MODE)
		{
			return;
		}
		
		if (!this.marked)
		{
			if (this.type == ORGAN)
			{				
				fill(150, 100, 200);
				stroke(150, 100, 200);
			}
			else
			{
				fill("yellow");
				stroke("yellow");	
			}
		}
		else
		{
			if (IS_PRINT_MODE)
			{
				fill("black");
				stroke("black");	
			}
			else
			{
				fill("white");
				stroke("white");		
			}
		}
		var r = MAX_R / 3;
		if (this.status == ORGAN)
		{
			r = MAX_R / 2;
		}
		// print place
		ellipse(this.x, this.y, r, r);
		
		// print id
		if (!IS_PRINT_MODE)
		{
			fill(255, 255, 255);	
			strokeWeight(0);
			textSize(12);
			text('' + this.id, this.x - 10 - (this.id.toString().length - 1) * 3, this.y - 10);
		}
		else if(this.type == ORGAN)
		{
			fill(0, 0, 0);	
			strokeWeight(0);
			textSize(12);
			text('' + this.organ_name, this.x - 10 - (this.id.toString().length - 1) * 3, this.y - 10);
		}
	}
	
	to_string(drugs_string = "{}", override_index=-1)
	{
		if (override_index == -1)
		{
			override_index == this.id - 1;
		}
		
		if (this.type == ORGAN)
		{
			return "OrganNode(population=[], time_span=" + this.ts + ", location=[" + Math.floor(this.x) + ", " + Math.floor(this.y) + ", 0], " +
			"local_interaction_protocol=" + this.lip + ", name=\"" + this.organ_name + "\", drugs=" + drugs_string + ", index=" + override_index + ")";	
		}
		else
		{
			// TODO: change vassal_type to be dynamic
			return "VassalNode(population=[], color=True, location=[" + Math.floor(this.x) + ", " + Math.floor(this.y) + ", 0], vassal_type=VassalNode.type_artery, index=" + override_index + ")";
		}
	}
	
	to_string_status()
	{
		if (this.type == ORGAN)
		{
			return "Organ(ts=" + this.ts + ", location=[" + Math.floor(this.x) + ", " + Math.floor(this.y) + "], " +
			"lip=" + this.lip + ", name=\"" + this.organ_name + "\", id=" + this.id + ")";	
		}
		else
		{
			// TODO: change vassal_type to be dynamic
			return "Vassal(location=[" + Math.floor(this.x) + ", " + Math.floor(this.y) + "], id=" + this.id + ")";
		}
	}
}