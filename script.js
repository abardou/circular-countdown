
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

	var start = polarToCartesian(x, y, radius, endAngle);
	var end = polarToCartesian(x, y, radius, startAngle);

	var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

	var d = [
			"M", start.x, start.y, 
			"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ");

	return d;       
}

function secondsToTimeString(seconds, units, values, total) {
	str = ""
	elapsed = Math.round(10000*(1 - seconds/total)) / 100;
	for (i=0; i < units.length; i++) {
		if (seconds > values[i]) {
			n = Math.floor(seconds / values[i]);
			str += "<b style=\"font-size: 1.6em\">" + n + "</b>" + units[i] + (n > 1 ? "s" : "") + " ";
			seconds -= n * values[i];
		}
	}

	str += "</br></br><b style=\"font-size: 1.6em\">"+elapsed+"%</b> elapsed"

	return str
}

var c = null;
var radius = null;

$(document).ready(function() {
	var h = $(document).height()
	var w = $(document).width()
	var dim = 0.95 * Math.min(h, w)
	$('.item').css({'width':dim+'px', 'height':dim+'px'});
	var stroke_width = dim * 0.045;
	c = dim / 2
	radius = c - stroke_width;
	var diam = radius * 2;
	var font_size = diam * 0.045
	$('.item').append("<h2 style=\"width: "+(0.85*diam)+"px; font-size: "+ font_size +"px\"></h2><svg width=\""+dim+"px\" height=\""+dim+"px\"><path id=\"arc1\" fill=\"none\" stroke=\"#fa691d\" stroke-width=\""+stroke_width+"\"/></svg>")

	let start = new Date('2020-07-24T08:20:00');
	let end = new Date('2020-08-16T11:05:00');
	let whole_delay = (end - start) / 1000;
	units = ['Week', 'Day', 'Hour', 'Minute', 'Second'];
	values = [604800, 86400, 3600, 60, 1];
	var interval = setInterval(function() {
			let now = Date.now()
			let elapsed = (now - start) / 1000
			let left = whole_delay - elapsed
			let ratio = elapsed / whole_delay
			
			$('h2').html(secondsToTimeString(left, units, values, whole_delay));
			
			document.getElementById("arc1").setAttribute("d", describeArc(c, c, radius, 0, ratio * 360));
	}, 300);
});

$(window).resize(function() {
	console.log("Document resized")
	h = $(document).height()
	w = $(document).width()
	dim = 0.95 * Math.min(h, w)
	$('.item').css({'width':dim+'px', 'height':dim+'px'});
	stroke_width = dim * 0.045;
	c = dim / 2
	radius = c - stroke_width;
	diam = radius * 2;
	font_size = diam * 0.045
	$('h2').css({'width': 0.85*diam+'px', 'font-size': font_size+'px'});
	$('svg').css({'width': dim+'px', 'height': dim+'px'})
	document.getElementById("arc1").setAttribute("stroke-width", stroke_width);
});