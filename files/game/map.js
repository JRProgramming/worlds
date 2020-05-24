(function() {
	class Map extends HTMLElement {
		constructor() {
			super();

			let width = this.getAttribute("width") | 0;
			let height = this.getAttribute("height") | 0;

			this.style.width = width * 32 + "px";
			this.style.height = height * 32 + "px";

			this.shadow = this.attachShadow({mode:"closed"});

			const linkElem = document.createElement('link');
			linkElem.setAttribute('rel', 'stylesheet');
			linkElem.setAttribute('href', '/game/map.css');

			this.shadow.appendChild(linkElem);

			var root = document.createElement("div");
			root.className = "root";
			this.shadow.appendChild(root);

			root.style.width = width * 32 + "px";
			root.style.height = height * 32 + "px";

			for (let i = 0; i < width * height; i++) {
				let tile = document.createElement("div");
				tile.className = "tile";
				tile.style.left = (i % width) * 32 + "px";
				tile.style.top = ((i / width)|0) * 32 + "px";
				tile.id = "tile-" + i;

				let inner = document.createElement("span");
				inner.className = "inner";
				tile.appendChild(inner);

				tile.addEventListener("click", function(e) {
					if (!e.shiftKey) {
						for (let elem of root.querySelectorAll("[selected=\"\"]")) {
							elem.removeAttribute("selected");
						}
					}

					if (tile.hasAttribute("selected")) {
						tile.removeAttribute("selected");
					} else {
						tile.setAttribute("selected", "");
					}
				});
				root.appendChild(tile);
			}

			let self = this;
			this.addEventListener("keydown", function(e) {
				switch(e.code) {
				case "ArrowUp":
				case "ArrowDown":
				case "ArrowLeft":
				case "ArrowRight": {
					let tile = self.selected()[0];
					let toTile;
					if (e.code == "ArrowUp") toTile = tile - width;
					if (e.code == "ArrowDown") toTile = tile + width;
					if (e.code == "ArrowLeft") toTile = tile - 1;
					if (e.code == "ArrowRight") toTile = tile + 1;

					console.log(tile + " => " + toTile);

					for (let elem of root.querySelectorAll("[selected=\"\"]")) {
						elem.removeAttribute("selected");
					}
					self.tileAt(toTile).setAttribute("selected", "");

					self.dispatchEvent(new CustomEvent("move", {detail:{from:tile,to:toTile}}));
				}
				break;
				case "KeyL": {
					let tile = self.selected()[0];
					self.dispatchEvent(new CustomEvent("launch", {detail:tile}));
				}
				break;
				case "KeyN": {
					let tile = self.selected()[0];
					self.dispatchEvent(new CustomEvent("nuke", {detail:tile}));
				}
				break;
				case "Backspace": {
					let tiles = self.selected();
					self.dispatchEvent(new CustomEvent("delete", {detail:tiles}));
				}
				break;
				}
			})
		}

		selected() {
			return Array.from(this.shadow.querySelectorAll("[selected=\"\"]")).map(e => e.id.slice(5) | 0);
		}

		tileAt(index) {
			return this.shadow.getElementById("tile-" + index);
		}
	}

	customElements.define("w-map", Map);
})();
