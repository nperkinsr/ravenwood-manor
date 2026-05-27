
const relicCardTemplate = function(data) {
    return `
        <div class="relic-card-wrapper">
            <article class="relic-card">
                <img class="relic-image" src="${data.image}" alt="${data.imageAlt}" />

                <div class="relic-content">
                    <h3 class="relic-name">${data.relicName}</h3>

                    <div class="relic-meta">
                        <span class="relic-cost">${data.cost}</span>
                        <span class="relic-owned">${data.owned}</span>
                    </div>

                    <p class="relic-description">${data.description}</p>
                </div>

                <button class="relic-buy-button" type="button">Buy</button>
            </article>
        </div>
    `;
}

window.ravenwood.templates.relicCard = relicCardTemplate;