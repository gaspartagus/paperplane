var _;

function gravity(solid1,solid2) {
	var G = 1,
			Dx = solid2.x - solid1.x,
			Dy = solid2.y - solid1.y,
			D4 = Math.pow(Dx*Dx + Dy*Dy, 2),
			ax = G * solid1.m * solid2.m * Dx / D4,
			ay = G * solid1.m * solid2.m * Dy / D4;
	return [ax,ay];
}

function Solid(force,options){
	var DEFAULTS = {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		m: 0,
		t: 0,
		tpl: "<div>-|-></div>",
	};
	_.assign(this,_.merge(options,DEFAULTS));

	// DOM section
	var template = _.template(this.tpl);

	this.el = document.createElement("div");
	this.el.innerHTML = template(this);

	document.body.appendChild(this.el);

	// Physics section
	function interactions(solids) {
		var solid = this;
		var dt = performance.now()-solid.t;
		if(dt > 500) return;
		solids.forEach(function(s){
			if(s!==solid){
				var A = this.force(solid,s); // self
				solid.vx += dt*A[0];
				solid.vy += dt*A[1];
				solid.x += dt*solid.vx;
				solid.y += dt*solid.vy;
			}
		})
		solid.t = performance.now();
	}

	function elapse(solids) {
		interactions(solids);
		requestAnimationFrame(function(){
			elapse(solids);
		});
	}

	this.startOfTimes = elapse;

};

var plane = new Solid(gravity);

