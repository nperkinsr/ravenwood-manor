class Template {
    // This is the function that is called when you do new Template(templateName, data, targetElement)
    constructor(templateName, data) {
        this.templateName = templateName;
        this.data = data;
    }

    cloneTemplate() {
        try {
            this.template = window.ravenwood.templates[this.templateName];
        } catch (error) {
            console.error('Error cloning template: ' + error);
        }
    }

    render() {
        this.cloneTemplate();
        this.HTMLString = this.template(this.data);
        this.renderedHTML = document.createElement('div');
        this.renderedHTML.innerHTML = this.HTMLString;
        return this.renderedHTML;
    }
}

window.ravenwood.Template = Template;
