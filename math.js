function squre(x) 
{
	return x * x 
}

function dist2d(start_point, end_point)
{ 
	return squre(start_point.x - end_point.x) + squre(start_point.y - end_point.y) 
}

function distToSegmentSquared(point, line_start_point, line_end_point)
{
  var l2 = dist2d(line_start_point, line_end_point);
  if (l2 == 0) return dist2(point, line_start_point);
  var t = ((point.x - line_start_point.x) * (line_end_point.x - line_start_point.x) + (point.y - line_start_point.y) * (line_end_point.y - line_start_point.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2d(point, { x: line_start_point.x + t * (line_end_point.x - line_start_point.x),
                    y: line_start_point.y + t * (line_end_point.y - line_start_point.y) });
}

function distToSegment(point, line_start_point, line_end_point) 
{ 
	return Math.sqrt(distToSegmentSquared(point, line_start_point, line_end_point)); 
}

function locationBetweenDots(dot1, dot2, i, k)
{
	return new Point((dot1.x * i + dot2.x * (k - i)) / k, (dot1.y * i + dot2.y * (k - i)) / k);
}

function line_m(x1, y1, x2, y2)
{
	if (x2 - x1 != 0)
	{
		return (y2 - y1) / (x2 - x1);
	}
	return 0;
}

function line_from_dot_and_m(x1, y1, m)
{
	if (x2 - x1 != 0)
	{
		return (y2 - y1) / (x2 - x1);
	}
	return 0;
}

function halfWayDot(x1, y1, x2, y2)
{
	return new Point((x1 + x2 ) / 2, (y1 + y2 ) / 2);
}