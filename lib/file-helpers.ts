
const events = ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']

export function stopEvents (form : any) {
	events.forEach(( evt : string) => {
		form.addEventListener(evt, (e : any) => {
			e.preventDefault();
			e.stopPropagation();
		});
	});
}
