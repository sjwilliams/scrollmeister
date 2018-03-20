// @flow

import Behavior from 'behaviors/Behavior.js';

export default class DebugGuidesBehavior extends Behavior {
	static get schema(): any {
		return {
			color: {
				type: 'string',
				default: '#0cf'
			}
		};
	}

	static get behaviorName(): string {
		return 'debugguides';
	}

	static get dependencies(): Array<string> {
		return ['guidelayout'];
	}

	attach() {
		this._createElement();

		//Whenever the guide layout updates, render the guides.
		this.listenAndInvoke(this.el, 'guidelayout:layout', () => {
			this._render();
		});
	}

	detach() {
		this._removeElement();
	}

	_createElement() {
		this._guidesWrapper = document.createElement('div');
		this._guidesWrapper.style.cssText = `
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
		`;

		if (document.body) {
			document.body.appendChild(this._guidesWrapper);
		}
	}

	_removeElement() {
		if (document.body) {
			document.body.removeChild(this._guidesWrapper);
		}
	}

	_render() {
		let guides = this.el.guidelayout.engine.guides;

		let html = guides.map(guide => {
			let width = guide.width;
			let opacity = 0.2;

			if (guide.width === 0) {
				width = 1;
				opacity = 1;
			}

			return `
				<div title="${guide.name}" style="position: absolute; top: 0; bottom: 0; background:${this.props.color}; left: ${
				guide.rightPosition
			}px; opacity: ${opacity}; px; width: ${width}px;"></div>
			`;
		});

		this._guidesWrapper.innerHTML = html.join('');
	}
}
