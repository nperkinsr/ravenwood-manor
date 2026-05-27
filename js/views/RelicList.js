class RelicList {
    constructor(data, container) {
        this.relics = data;
        this.container = container;
        this.playerStatus = window.ravenwood.playerStatus;
    }

    getRelicOwned(relic) {
        let relicOwned = this.playerStatus.ownedRelics[relic.id];

        if (relicOwned === undefined) {
            relicOwned = 0;
        }

        return relicOwned;
    }

    getRelicCost(relic) {
        const relicOwned = this.getRelicOwned(relic);
        const relicCost = relic.baseCost * Math.pow(relic.costMultiplier, relicOwned);
        const roundedRelicCost = Math.floor(relicCost);

        return roundedRelicCost;
    }

    getRelicDisabled(relic) {
        const relicCost = this.getRelicCost(relic);
        const relicOwned = this.getRelicOwned(relic);
        const playerCurrency = this.playerStatus[relic.currency];
        let relicButtonDisabled = "";

        if (playerCurrency < relicCost) {
            relicButtonDisabled = "disabled";
        }

        if (relic.maxOwned !== undefined) {
            if (relicOwned >= relic.maxOwned) {
            relicButtonDisabled = "disabled";
            }
        }

        return relicButtonDisabled;
    }

    calculateRelicFields (relic) {
        const relicCost = this.getRelicCost(relic);
        const relicOwned = this.getRelicOwned(relic);
        let relicCostText = relicCost + " " + relic.currency;
        let relicMaxOwnedText = "";

        if (relic.maxOwned !== undefined) {
            relicMaxOwnedText = relicOwned + "/" + relic.maxOwned;

            if (relicOwned >= relic.maxOwned) {
                relicCostText = "Maxed";
            }
        }
        relic.relicCostText = relicCostText;
        relic.relicMaxOwnedText = relicMaxOwnedText;

        return relic;
    }

    render() {
        this.container.innerHTML = ""; // Clear the container before rendering
        this.relics.forEach(relic => {
            const updatedData = this.calculateRelicFields(relic);
            const template = new window.ravenwood.Template('relicCard', updatedData);
            const renderedHTML = template.render();
            const relicButtonDisabled = this.getRelicDisabled(relic);
            if (relicButtonDisabled === "disabled") {
                renderedHTML.querySelector('.relic-card').classList.add("inactive");
                renderedHTML.querySelector('.relic-buy-button').disabled = true;
            }
            console.log(renderedHTML)
            this.container.insertAdjacentElement('beforeend', renderedHTML);
        });
    }
}


window.ravenwood.views.RelicList = RelicList;