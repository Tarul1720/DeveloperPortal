const acc = document.createDocumentFragment();
const subAcc = document.createDocumentFragment();
const navLinks = document.createDocumentFragment();
const segment = location.search.match(/(?:\?segment=)(.+)(?=&)/)
	? location.search.match(/(?:\?segment=)(.+)(?=&)/)[1]
	: undefined;
const apiId = location.search.match(/(?:&id=)(\d+)$/)
	? +location.search.match(/(?:&id=)(\d+)$/)[1]
	: +location.search.match(/(?:\?id=)(\d+)$/)[1];

acc.appendChild(document.querySelector('#tier1').firstElementChild);
subAcc.appendChild(acc.querySelector('#tier2').firstElementChild);
navLinks.appendChild(subAcc.querySelector('#tier3').firstElementChild);

loadMenu();

async function loadMenu() {
	document.querySelector('#tier1').innerHTML = null;

	try {
		const response = await fetch('/api/v1/tree?recursive=true&submissionDetails=true');

		if (response.ok) {
			const data = await response.json();

			const items = data.nodes.map((item) => {
				return {
					name: item.name,
					pathSegment: item.pathSegment,
					children: item.children.map((item) => {
						return {
							name: item.name,
							pathSegment: item.pathSegment,
							submissions: item.submissionIds.length ? item.submissions : []
						};
					})
				};
			});

			items.forEach((item1, index) => {
				const accId = `acc${index + 1}`;
				// tier 1
				const parentTier = document.createElement('DIV');
				parentTier.setAttribute('id', accId);
				parentTier.className = 'accordion px-2';

				// tier 1 button
				let tier1 = acc.cloneNode(true);
				tier1.querySelector('.accordion-button').innerText = item1.name;
				tier1.querySelector('.accordion-button').setAttribute('href', `/apiCatalog/filter${item1.pathSegment}`);
				tier1.querySelector('.accordion-button').setAttribute('data-bs-target', `#${accId}Collapse`);
				tier1.querySelector('.accordion-button').setAttribute('aria-controls', `${accId}Collapse`);

				// tier 1 dropdown
				tier1.querySelector('.accordion-collapse').setAttribute('id', `${accId}Collapse`);
				tier1.querySelector('.accordion-collapse').setAttribute('data-bs-parent', `#${accId}`);
				tier1.querySelector('.accordion-collapse').setAttribute('aria-labelledby', `${accId}Heading`);

				if (item1.children.some((item) => item.pathSegment === `/${segment}`)) {
					tier1.querySelector('.accordion-button').classList.remove('collapsed');
					tier1.querySelector('.accordion-collapse').classList.add('show');
				}

				// tier 2
				item1.children.forEach((item2, index) => {
					let tier2 = subAcc.cloneNode(true);
					tier2.querySelector('.accordion-header').setAttribute('id', `#${accId}SubHeading${index + 1}`);

					// tier 2 button
					tier2.querySelector('.accordion-button').innerText = item2.name;
					tier2.querySelector('.accordion-button').setAttribute('href', `/apiCatalog/filter${item2.pathSegment}`);
					tier2.querySelector('.accordion-button').setAttribute('data-bs-target', `#${accId}SubCollapse${index + 1}`);
					tier2.querySelector('.accordion-button').setAttribute('aria-controls', `${accId}SubCollapse${index + 1}`);

					// tier 2 dropdown
					tier2.querySelector('.accordion-collapse').setAttribute('id', `${accId}SubCollapse${index + 1}`);
					tier2.querySelector('.accordion-collapse').setAttribute('aria-labelledby', `${accId}SubHeading${index + 1}`);

					if (item2.submissions.some((item) => item.id === +apiId)) {
						tier2.querySelector('.accordion-button').classList.remove('collapsed');
						tier2.querySelector('.accordion-collapse').classList.add('show');
					}

					// tier 3 links
					item2.submissions.forEach((item3) => {
						let tier3 = navLinks.cloneNode(true);
						let path = item2.pathSegment.replace('/', '');

						tier3
							.querySelector('.nav-link')
							.setAttribute('href', `/apiCatalog/details/index.gsp?segment=${path}&id=${item3.id}`);
						tier3.querySelector('.nav-link').innerText = item3.title;

						tier2.querySelector('#tier3').appendChild(tier3);
					});

					tier1.querySelector('#tier2').appendChild(tier2);
				});

				parentTier.appendChild(tier1);
				document.querySelector('#tier1').appendChild(parentTier);
			});

			document.querySelectorAll('.accordion-button').forEach((item) => {
				item.addEventListener('click', (e) => {
					location.href = e.target.href;
				});
			});
		} else {
			throw new Error(response.statusText);
		}
	} catch (error) {
		console.error(error);
	}
}

function showResults() {
	document.querySelector('.try-it-res').classList.add('show');
}

function hideResults() {
	document.querySelector('.try-it-res').classList.remove('show');
}
