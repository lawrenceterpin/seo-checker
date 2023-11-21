/**
 * Classe Seo Checker
 * 
 * @description
 * 
 * Testeur SEO de la page.
 * Dans le panneau de droite, un rapport détaillé affiche le SEO et
 * liste les erreurs et réussites pour chaque balise
 */
class SeoChecker {

    constructor(options) {

        this.options = options;
        
        this.tagsErrors = 0;
        this.tagsSuccess = 0;
        this.lengthErrors = 0;
        this.lengthSuccess = 0;
        this.attributesErrors = 0;
        this.attributesSuccess = 0;

        this.panelIsOpen = this.options.panel.open;

        // Liste des règles SEO à checker dans la page
        this.seoRulesTags = [
            {
                name: "head",
                seoRulesChildTags: [
                    {
                        name: "title",
                        maxLength: 60
                    },
                    {
                        name: "meta",
                        attributes: ["content"],
                        maxLength: 160
                    }
                ]
            },
            {
                name: "body",
                seoRulesChildTags: [
                    {
                        name: "header",
                    },
                    {
                        name: "main",
                    },
                    {
                        name: "footer",
                    },
                    {
                        name: "a",
                        attributes: ["href", "title"]
                    },
                    {
                        name: "img",
                        attributes: ["src", "alt"]
                    },
                ]
            },
            {
                name: "header",
                seoRulesChildTags: [
                    {
                        name: "h1",
                        maxLength: 60
                    },
                    {
                        name: "nav"
                    },
                ]
            },
            {
                name: "section",
                seoRulesChildTags: [
                    {
                        name: "h2",
                        maxLength: 60
                    },
                ]
            },
        ];

        this.errors = [];

        this.init();
    }

    /**
     * Initilisation
     */
    init() {
        // Création du panneau
        this.createPanel();

        // Création du bouton d'ouverture du panneau
        this.createPanelButton();

        if (this.options.panel.displayTagsListReport) {
            // Création du rapport SEO
            this.createSeoReport();
        }

        if (this.options.panel.displayChartsReport) {
            // Création du rapport SEO en camembert
            this.createChartsSeoReport();
        }

        this.panelDisplay();

        this.seoCheckerButton.addEventListener('click', () => this.panelDisplay(), false);
    }

    /**
     * Création du panneau
     */
    createPanel() {
        // Création du la div "#html5-checker"
        this.seoCheckerPanel = document.createElement('div');
        this.seoCheckerPanel.setAttribute('id', 'seo-checker-panel');
        this.seoCheckerPanel.setAttribute('class', 'p-fixed d-flex flex-direction-column');

        this.seoCheckerPanel.innerHTML = "<h2 class='m-0'>SEO Checker</h2>" +
            "<ul class='d-flex mb-2'>" +
            "<li class='col-4'><p class='m-0'><span class='tags-errors error'></span></p><canvas id='tags'></canvas></li>" +
            "<li class='col-4'><p class='m-0'><span class='length-errors error'></span></p><canvas id='length'></canvas></li>" +
            "<li class='col-4'><p class='m-0'><span class='attributes-errors error'></span></p><canvas id='attributs'></canvas></li>" +
            "</ul>" +
            "<ul id='seo-checker-tags-list'></ul>";

        document.body.prepend(this.seoCheckerPanel);
    }

    /**
     * Création du bouton d'ouveture/fermeture du panneau
     */
    createPanelButton() {
        // Création du bouton "#html5-checker-button"
        this.seoCheckerButton = document.createElement('button');
        this.seoCheckerButton.setAttribute('id', 'seo-checker-button');
        this.seoCheckerButton.setAttribute('class', 'p-fixed m-1 p-1 d-flex align-items-center justify-content-center');
        this.seoCheckerButton.setAttribute('title', 'SEO Checker');

        this.seoCheckerButton.innerHTML = "<div><span class='p-fixed tags-errors p-1 align-items-center justify-content-center bg-error'></span></div>" +
            "&nbsp;<img src='images/seo.png' alt='Seo Checker'>&nbsp;";

        document.body.prepend(this.seoCheckerButton);
    }

    /**
     * Création du rapport SEO
     */
    createSeoReport() {

        let tag,
            li,
            ul,
            childUl,
            childLi,
            childTag,
            childTagText,
            content;

        // Pour chaque règle SEO
        this.seoRulesTags.forEach(seoRuleTag => {
            // On récupère le nom de la balise SEO
            tag = document.getElementsByTagName(seoRuleTag.name);

            // On créé une li pour chaque balise SEO
            li = document.createElement('li');
            // On affiche le nom de la balise SEO
            li.innerHTML = "<h3 class='mb-1'>" + seoRuleTag.name + " (" + tag.length + ")</h3>";

            // On répète la boucle en fonction du nombre de balise SEO
            for (var i = 0; i < tag.length; i++) {

                // On récupère l'ul de la liste des balises SEO
                ul = document.getElementById('seo-checker-tags-list');
                // On place
                ul.appendChild(li);

                childUl = document.createElement('ul');
                li.appendChild(childUl);

                // Pour chaque balise enfant
                seoRuleTag.seoRulesChildTags.forEach(seoRulesChildTag => {

                    // On récupère la balise enfant dans le DOM
                    childTag = tag[i].getElementsByTagName(seoRulesChildTag.name);
                    // Texte de la balise enfant
                    childTagText = "";

                    childLi = document.createElement('li');
                    childLi.innerHTML = '<div class="' + ((childTag.length > 0) ? 'success' : 'error') + '">'
                        + ((childTag.length > 0) ? '✔' : '☓') + ' Balise ' +
                        '<strong>' + seoRulesChildTag.name + '</strong>' +
                        ' (' + childTag.length + ')</div>';

                    // Si la balise enfant n'existe pas dans le DOM
                    if (childTag.length <= 0) {
                        // On incrémente le nombre de balise manquante
                        this.tagsErrors++;
                    }
                    else {
                        this.tagsSuccess++;
                    }

                    // On répète la boucle en fonction du nombre de balise enfant
                    for (var j = 0; j < childTag.length; j++) {

                        if (seoRulesChildTag.name == 'meta') {

                            if (childTag[j].getAttribute('content') !== null) {

                                childTagText = childTag[j].getAttribute('content');
                            }
                        }
                        else {

                            if (typeof childTag[j].innerText !== 'undefined') {

                                childTagText = childTag[j].innerText;
                            }
                        }

                        content = (childTagText.length > 0) ? '<ul class="ml-2 mt-1 mb-1 pb-1 border-bottom"><li><div><strong>- Texte:</strong> ' + this.limit(childTagText, 20) + '... </div></li>' : '<ul class="ml-2 mt-1 mb-1 pb-1 border-bottom">';

                        if (seoRulesChildTag.maxLength) {

                            if (childTag[j].getAttribute('charset') == null) {
                                content += '<li class="' + ((childTagText.length > 0 && childTagText.length <= seoRulesChildTag.maxLength) ? 'success' : ' error') + '">- Longueur: ' + childTagText.length + '/' + seoRulesChildTag.maxLength + '</li>';
                            }
                        }

                        if (childTagText.length > 0 && childTagText.length > seoRulesChildTag.maxLength) {

                            this.lengthErrors++;
                        }
                        else {

                            this.lengthSuccess++;
                        }

                        // Si il y a des attributs à checker pour cette balise
                        if (seoRulesChildTag.attributes) {

                            // Pour chaque attribut à checker pour cette balise
                            seoRulesChildTag.attributes.forEach(attribute => {

                                if (childTag[j].getAttribute('charset') == null) {

                                    content += '<li class="' + (childTag[j].getAttribute(attribute) ? 'success' : 'error') + '">- ' + ((childTag[j].getAttribute(attribute) ? '✔' : '☓')) + ' <strong>' + attribute + ' ' + (childTag[j].getAttribute(attribute) ? ': ' + childTag[j].getAttribute(attribute) : '(manquant)') + '</strong></li>';
                                }

                                // Si l'attribut n'existe pas pour cette balise dans le DOM
                                if (childTag[j].getAttribute(attribute) == null && childTag[j].getAttribute('charset') == null) {

                                    // On incrémente le nombre d'attribut manquant
                                    this.attributesErrors++;
                                }
                                else {
                                    this.attributesSuccess++;
                                }
                            });
                        }

                        content += "</ul>";

                        childLi.innerHTML += content;
                    }

                    childUl.appendChild(childLi);
                });
            }
        });

        this.displayTagsErrors();

        this.displayLengthErrors();

        this.displayAttributesErrors();
    }

    displayTagsErrors() {

        var tagsErrorsSpan = document.getElementsByClassName('tags-errors');

        if ((this.tagsErrors + this.attributesErrors + this.lengthErrors) > 0) {
            tagsErrorsSpan[0].setAttribute('style', 'display: flex;');
        }

        tagsErrorsSpan[0].innerText = ((this.tagsErrors + this.attributesErrors + this.lengthErrors) > 0) ? (this.tagsErrors + this.attributesErrors + this.lengthErrors) : "";
        tagsErrorsSpan[1].innerText = "balises manquantes (" + this.tagsErrors + ")";
    }

    displayLengthErrors() {

        var lengthErrorsSpan = document.getElementsByClassName('length-errors');

        lengthErrorsSpan[0].innerText = "problèmes de longueur (" + this.lengthErrors + ")";
    }

    displayAttributesErrors() {

        var attributesErrorsSpan = document.getElementsByClassName('attributes-errors');

        attributesErrorsSpan[0].innerText = "attributs manquants (" + this.attributesErrors + ")";
    }

    /**
     * Création des rapport SEO en graphiques
     */
    createChartsSeoReport() {

        this.errors = [
            {
                id: "tags",
                labels: [
                    'Balises manquantes',
                    'Balises existantes',
                ],
                error: this.tagsErrors,
                success: this.tagsSuccess
            },
            {
                id: "length",
                labels: [
                    'Balises manquantes',
                    'Balises existantes',
                ],
                error: this.lengthErrors,
                success: this.lengthSuccess
            },
            {
                id: "attributs",
                labels: [
                    'Attributs manquants',
                    'Attributs existants',
                ],
                error: this.attributesErrors,
                success: this.attributesSuccess
            }
        ];

        this.errors.forEach(error => {

            new Chart(document.getElementById(error.id), {
                type: 'pie',
                data: {
                    labels: error.labels,
                    datasets: [{
                        label: ' Total',
                        data: [error.error, error.success],
                        backgroundColor: [
                            'red',
                            'green',
                        ],
                        hoverOffset: 4
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            align: 'start',
                        }
                    }
                }
            });
        });
    }

    limit(string = '', limit = 0) {
        return string.substring(0, limit)
    }

    percentage(num, num2) {
        return num / num2 * 100;
    }

    /**
     * Affichage du panneau
     */
    panelDisplay() {

        if (this.panelIsOpen == true) {
            // On affiche le panneau de la liste des balises
            this.seoCheckerPanel.classList.add("open");

            this.showPanel();
        }
        else {
            // On cache le panneau de la liste des balises
            this.seoCheckerPanel.classList.remove("open");

            this.hidePanel();
        }

        this.panelIsOpen = (this.panelIsOpen) ? false : true;
    }

    showPanel() {

        this.seoCheckerButton.innerHTML = "<div><span class='p-fixed tags-errors p-1 align-items-center justify-content-center bg-error'></span></div>" +
            "&nbsp;<i class='fa fa-close'></i>&nbsp;";
    }

    hidePanel() {

        this.seoCheckerButton.innerHTML = "<div><span class='p-fixed tags-errors p-1 align-items-center justify-content-center bg-error'></span></div>" +
            "&nbsp;<img src='images/seo.png' alt='Seo Checker'>&nbsp;";
    }
};