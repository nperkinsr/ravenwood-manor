class RelicList {
    constructor(data, container) {
        this.relics = data;
        this.container = container;
    }

    render() {
        this.container.innerHTML = ""; // Clear the container before rendering
        this.relics.forEach(relic => {
            const template = new window.ravenwood.Template('relicCard', relic);
            const renderedHTML = template.render();
            this.container.insertAdjacentHTML('beforeend', renderedHTML);
        });
    }
}

window.ravenwood.views.RelicList = RelicList;