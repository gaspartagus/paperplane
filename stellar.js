var _;

function gravity(solid1,solid2) {
	var G = 1,
			Dx = solid2.x - solid1.x,
			Dy = solid2.y - solid1.y,
			D3 = Math.pow(Dx*Dx + Dy*Dy, 3/2),
			ax = G * solid1.m * solid2.m * Dx / D3,
			ay = G * solid1.m * solid2.m * Dy / D3;
	return [ax,ay];
}

function Solid(force,options){
	var DEFAULTS = {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		m: 1,
		t: 0,
		tpl: "",
		draw: true,
	};
	_.assign(this,_.merge(DEFAULTS,options));
	var self = this;

	// DOM section
	if(this.draw) {
		var template = _.template(this.tpl);
		this.el = document.createElement("div");
		this.el.setAttribute("id",this.name);
		this.el.innerHTML = template(this);
		document.body.appendChild(this.el);
	}

	function DOM(){
		// self.el.style.transform = "translate("+self.x+"px ,"+self.y+"px)";
		// console.log(self.x,self.y);
	}

	// Physics section
	function interactions(solids) {
		var solid = self;
		var dt = performance.now()/1000-solid.t;

		if(dt > 500) return;
		solids.forEach(function(s){
			if(s!==solid){
				var A = force(solid,s);
				solid.vx += dt*A[0];
				solid.vy += dt*A[1];
				solid.x += dt*solid.vx;
				solid.y += dt*solid.vy;
			}
		})
		solid.t = performance.now()/1000;
	}

	function elapse(solids) {
		interactions(solids);
		DOM();
		// console.log(solids)
		requestAnimationFrame(function(){
			elapse(solids);
		});
	}

	this.startOfTimes = elapse;

};


