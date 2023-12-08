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

        if (typeof options !== 'undefined') {
            this.options = options;
        }
        else {
            this.options = {
                panel: {
                    open: false,
                    displayChartsReport: true,
                    displayTagsListReport: true
                }
            };
        }

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
                        content: "innerText",
                        maxLength: 60
                    },
                    {
                        name: "meta",
                        content: "content",
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
                        content: "innerText",
                    },
                    {
                        name: "main",
                        content: "innerText",
                    },
                    {
                        name: "footer",
                        content: "innerText",
                    },
                    {
                        name: "a",
                        content: "innerText",
                        attributes: ["href", "title"]
                    },
                    {
                        name: "img",
                        content: "innerText",
                        attributes: ["src", "alt"]
                    },
                ]
            },
            {
                name: "header",
                seoRulesChildTags: [
                    {
                        name: "h1",
                        content: "innerText",
                        maxLength: 60
                    },
                    {
                        name: "nav",
                        content: "innerText",
                    },
                ]
            },
            {
                name: "section",
                seoRulesChildTags: [
                    {
                        name: "h2",
                        content: "innerText",
                        maxLength: 60
                    },
                ]
            },
        ];

        // Liste d'erreurs
        this.errors = [];

        // Initialisation
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

        // Affichage du panneau
        this.panelDisplay();

        // Onglets de navigation du panneau
        this.switchTabs();

        // Clic du bouton d'ouverture/fermeture du panneau
        this.seoCheckerButton.addEventListener('click', () => this.panelDisplay(), false);
    }

    /**
     * Création du panneau
     */
    createPanel() {
        // Création du la div "#html5-checker"
        this.seoCheckerPanel = document.createElement('div');
        this.seoCheckerPanel.setAttribute('id', 'seo-checker-panel');
        this.seoCheckerPanel.setAttribute('class', 'p-fixed p-1 d-flex flex-direction-column shadow black');

        this.seoCheckerPanel.innerHTML = "<div id='tabs' class='d-flex flex-direction-column'>" +
            "<h2 class='purple'>SEO Checker</h2>" +
            "<ul id='tabsLabel' class='d-flex'>" +
            "<li id='tab-1' class='tabsLabel col-6 p-1 p-relative open'>" +
            "<h3 class='m-0'>Résumé</h3>" +
            "</li>" +
            "<li id='tab-2' class='tabsLabel col-6 p-1 p-relative'>" +
            "<h3 class='m-0'>Rapport détaillé</h3>" +
            "</li>" +
            "</ul>" +
            "<div id='tabs-body' class='d-flex flex-direction-column h-100'>" +
            "<div class='tabsContent d-flex flex-direction-column tab-1 p-1 open'>" +
            "<ul id='charts-seo-report' class='d-flex wrap mb-2 p-1'>" +
            "<li class='col-12 col-lg-4'><p class='m-0'><span class='tags-errors error'></span></p><canvas id='tags'></canvas></li>" +
            "<li class='col-12 col-lg-4'><p class='m-0'><span class='length-errors error'></span></p><canvas id='length'></canvas></li>" +
            "<li class='col-12 col-lg-4'><p class='m-0'><span class='attributes-errors error'></span></p><canvas id='attributs'></canvas></li>" +
            "</ul>" +
            "</div>" +
            "<div class='tabsContent d-flex flex-direction-column tab-2 p-1'>" +
            "<ul id='seo-checker-tags-list' class='p-1'></ul>" +
            "</div>" +
            "</div></div>";

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
            "&nbsp;<img src='https://lawrenceterpin.github.io/seo-checker/images/seo.png' alt='Seo Checker'>&nbsp;";

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

                        childTagText = (typeof childTag[j][seoRulesChildTag.content] !== 'undefined') ? childTag[j][seoRulesChildTag.content] : "";

                        content = '<ul class="ml-2 mt-1 mb-1 pb-1 border-bottom">';

                        content += (childTagText.length > 0) ? '<li><div><strong>- Texte:</strong> ' + this.limit(childTagText, 20) + '... </div></li>' : '';

                        if (seoRulesChildTag.maxLength) {

                            if (childTag[j].getAttribute('charset') == null) {
                                content += '<li class="' + ((childTagText.length > 0 && childTagText.length <= seoRulesChildTag.maxLength) ? 'success' : ' error') + '">- ' + ((childTagText.length > 0 && childTagText.length <= seoRulesChildTag.maxLength) ? '✔' : '☓') + ' <strong>Longueur:</strong> ' + childTagText.length + '/' + seoRulesChildTag.maxLength + '</li>';
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
                            '#e74c3c',
                            '#27ae60',
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

        this.panelIsOpen = (this.panelIsOpen) ? false : true;

        if (this.panelIsOpen == false) {
            // On affiche le panneau de la liste des balises
            this.seoCheckerPanel.classList.add("open");

            this.showPanel();
        }
        else {
            // On cache le panneau de la liste des balises
            this.seoCheckerPanel.classList.remove("open");

            this.hidePanel();
        }
    }

    showPanel() {

        this.seoCheckerButton.innerHTML = "<div><span class='p-fixed tags-errors p-1 align-items-center justify-content-center bg-error'></span></div>" +
            "&nbsp;<i class='fa fa-close'></i>&nbsp;";
    }

    hidePanel() {

        this.seoCheckerButton.innerHTML = "<div><span class='p-fixed tags-errors p-1 align-items-center justify-content-center bg-error'></span></div>" +
            "&nbsp;<img src='https://lawrenceterpin.github.io/seo-checker/images/seo.png' alt='Seo Checker'>&nbsp;";
    }

    switchTabs() {

        var tabs = document.querySelectorAll('.tabsLabel');

        tabs.forEach(tab => {

            tab.addEventListener('click', function () {

                tabs.forEach(tab => {
                    if (tab.classList.contains('open')) {
                        tab.classList.remove('open');
                    }
                });

                tab.classList.add('open');
                var tabsContent = document.querySelectorAll('.tabsContent');

                tabsContent.forEach(tab => {
                    if (tab.classList.contains('open')) {
                        tab.classList.remove('open');
                    }
                });

                var tabContent = document.querySelector('#tabs-body .' + this.id);
                tabContent.classList.add('open');
            });
        });
    }
};
