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

function secondsToTimeString(now, end, ratio) {
	str = ""
	let end_copy = new Date(end.getTime());
	let elapsed = Math.round(10000*ratio) / 100;

	// Year and month depends on number of days
	// Year
	nyears = 0
	end_copy = new Date(end_copy.setFullYear(end_copy.getFullYear()-1));
	while(end_copy > now) {
		nyears += 1;
		end_copy = new Date(end_copy.setFullYear(end_copy.getFullYear()-1));
	}
	end_copy = new Date(end_copy.setFullYear(end_copy.getFullYear()+1))
	if (nyears > 0)
		str += "<b style=\"font-size: 1.6em\">" + nyears + "</b>Year" + (nyears > 1 ? "s" : "") + " ";
	
	// Month
	nmonth = 0
	end_copy = new Date(end_copy.setMonth(end_copy.getMonth()-1));
	while(end_copy > now) {
		nmonth += 1;
		end_copy = new Date(end_copy.setMonth(end_copy.getMonth()-1));
	}
	end_copy = new Date(end_copy.setMonth(end_copy.getMonth()+1))
	if (nmonth > 0)
		str += "<b style=\"font-size: 1.6em\">" + nmonth + "</b>Month" + (nmonth > 1 ? "s" : "") + " ";

	seconds = (end_copy - now) / 1000
	units = ['Week', 'Day', 'Hour', 'Minute', 'Second'];
	values = [604800, 86400, 3600, 60, 1];
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

function showPartCircles(start, now, end, c, radius, wsw, psw, space) {
	end_copy = new Date(end.getTime());

	// Year and month depends on number of days
	// Year
	end_copy = new Date(end_copy.setFullYear(end_copy.getFullYear()-1));
	while(end_copy > now)
		end_copy = new Date(end_copy.setFullYear(end_copy.getFullYear()-1));
	right_year = new Date(end_copy)
	right_year.setFullYear(right_year.getFullYear()+1)
	yduration = right_year - end_copy
	document.getElementById("year").setAttribute("d", describeArc(c, c, radius-wsw/2-space-psw/2, 0, 360 * (right_year - now) / yduration));
	end_copy = right_year
	
	// Month
	end_copy = new Date(end_copy.setMonth(end_copy.getMonth()-1));
	while(end_copy > now)
		end_copy = new Date(end_copy.setMonth(end_copy.getMonth()-1));
	right_month = new Date(end_copy)
	right_month.setMonth(right_month.getMonth()+1)
	mduration = right_month - end_copy
	document.getElementById("month").setAttribute("d", describeArc(c, c, radius-wsw/2-2*space-3*psw/2, 0, 360 * (right_month - now) / mduration));
	end_copy = right_month

	circles = ['week', 'day', 'hour', 'minute']
	values = [604800, 86400, 3600, 60]
	seconds = (end_copy - now) / 1000
	for (i=0; i < units.length; i++) {
		ratio = (seconds % values[i]) / values[i]
		elem = document.getElementById(circles[i])
		if (typeof elem !== 'undefined' && elem !== null)
			elem.setAttribute("d", describeArc(c, c, radius-wsw/2-(i+3)*space-(2*i+5)*psw/2, 0, 360 * ratio));
	}
}

var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

	for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
					return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
	}
};

var c = null;
var radius = null;
var ss_crit = 600;
var ss_fs = 0.065
var nss_fs = 0.047
var sw_whole = 0.05
var sw_part = 0.006
var space_circle = 0.003

var dim = null;
var stroke_width = null;
var part_sw = null;
var space = null;
var diam = null;
var font_size = null;

$(document).ready(function() {
	var h = $(document).height()
	var w = $(document).width()
	dim = 0.99 * Math.min(h, w)
	$('.item').css({'width':dim+'px', 'height':dim+'px'});
	stroke_width = sw_whole * dim;
	part_sw = sw_part * dim;
	space = space_circle * dim;
	c = dim / 2
	radius = c - stroke_width * 0.8;
	diam = radius * 2;
	font_size = dim > ss_crit ? diam * nss_fs : diam * ss_fs;
	$('.item').append("<h2 style=\"width: "+(0.8*diam)+"px; font-size: "+ font_size +"px\"></h2><svg width=\""+dim+"px\" height=\""+dim+"px\"><path id=\"whole\" fill=\"none\" stroke=\"#fa691d\" stroke-width=\""+stroke_width+"\"/><path id=\"year\" fill=\"none\" stroke=\"#e0e0e0\" stroke-width=\""+part_sw+"\"/><path id=\"month\" fill=\"none\" stroke=\"#e0e0e0\" stroke-width=\""+part_sw+"\"/><path id=\"week\" fill=\"none\" stroke=\"#e0e0e0\" stroke-width=\""+part_sw+"\"/><path id=\"day\" fill=\"none\" stroke=\"#e0e0e0\" stroke-width=\""+part_sw+"\"/><path id=\"hour\" fill=\"none\" stroke=\"#e0e0e0\" stroke-width=\""+part_sw+"\"/><path id=\"minute\" fill=\"none\" stroke=\"#e0e0e0\" stroke-width=\""+part_sw+"\"/></svg>")

	let start = new Date(getUrlParameter('s'));
	let end = new Date(getUrlParameter('e'));
	let whole_delay = (end - start) / 1000;
	var interval = setInterval(function() {
			let now = Date.now()
			let elapsed = (now - start) / 1000
			let ratio = elapsed / whole_delay

			console.log(space+","+stroke_width)
			
			$('h2').html(secondsToTimeString(now, end, ratio));
			
			document.getElementById("whole").setAttribute("d", describeArc(c, c, radius, 0, ratio * 360));
			showPartCircles(start, now, end, c, radius, stroke_width, part_sw, space)
	}, 55);
});

$(window).resize(function() {
	h = $(document).height()
	w = $(document).width()
	dim = 0.99 * Math.min(h, w)
	$('.item').css({'width':dim+'px', 'height':dim+'px'});
	stroke_width = sw_whole * dim;
	part_sw = sw_part * dim;
	space = space_circle * dim;
	console.log("UPDATEEED")
	console.log(space+","+stroke_width)
	c = dim / 2
	radius = c - stroke_width * 0.8;
	diam = radius * 2;
	font_size = dim > ss_crit ? diam * nss_fs : diam * ss_fs
	$('h2').css({'width': 0.8*diam+'px', 'font-size': font_size+'px'});
	$('svg').css({'width': dim+'px', 'height': dim+'px'})
	document.getElementById("whole").setAttribute("stroke-width", stroke_width);
	document.getElementById("year").setAttribute("stroke-width", part_sw);
	document.getElementById("month").setAttribute("stroke-width", part_sw);
	document.getElementById("week").setAttribute("stroke-width", part_sw);
	document.getElementById("day").setAttribute("stroke-width", part_sw);
	document.getElementById("hour").setAttribute("stroke-width", part_sw);
	document.getElementById("minute").setAttribute("stroke-width", part_sw);
});