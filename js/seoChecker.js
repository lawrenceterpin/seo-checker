// Création du la div "#html5-checker"
var seoChecker = document.createElement('div');
seoChecker.setAttribute('id', 'seo-checker-panel');
seoChecker.innerHTML = "<h2 class='m-0'>SEO Checker</h2>" +
    "<p class='m-0'><span class='tags-errors error'></span></p>" +
    "<p class='m-0'><span class='attributes-errors error'></span></p>" +
    "<ul id='seo-checker-tags-list'></ul>";

document.body.prepend(seoChecker);

// Création du bouton "#html5-checker-button"
var seoCheckerButton = document.createElement('button');
seoCheckerButton.setAttribute('id', 'seo-checker-button');
seoCheckerButton.setAttribute('title', 'SEO Checker');

seoCheckerButton.innerHTML = "<div><span class='tags-errors error'></span></div>" +
    "&nbsp;<img src='images/seo.png' alt='Seo Checker'>&nbsp;";

document.body.prepend(seoCheckerButton);

// Liste des règles SEO à checker dans la page
var seoRulesTags = [
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

var tagsCount = 0;
var tagsErrors = 0;
var attributesErrors = 0;

// Pour chaque règle SEO
seoRulesTags.forEach(seoRuleTag => {
    // On récupère le nom de la balise SEO
    var tag = document.getElementsByTagName(seoRuleTag.name);

    // On créé une li pour chaque balise SEO
    var li = document.createElement('li');
    // On affiche le nom de la balise SEO
    li.innerHTML = "<h3>" + seoRuleTag.name + " (" + tag.length + ")</h3>";

    // On répète la boucle en fonction du nombre de balise SEO
    for (var i = 0; i < tag.length; i++) {

        // On récupère l'ul de la liste des balises SEO
        var ul = document.getElementById('seo-checker-tags-list');
        // On place
        ul.appendChild(li);

        var childUl = document.createElement('ul');
        li.appendChild(childUl);

        // Pour chaque balise enfant
        seoRuleTag.seoRulesChildTags.forEach(seoRulesChildTag => {

            // On récupère la balise enfant dans le DOM
            var childTag = tag[i].getElementsByTagName(seoRulesChildTag.name);

            // Texte de la balise enfant
            var childTagText = "";

            var chilLi = document.createElement('li');
            chilLi.innerHTML = '<div class="' + ((childTag.length > 0) ? 'success' : 'error') + '">'
                + ((childTag.length > 0) ? '✔' : '☓') + ' Balise ' +
                '<strong>' + seoRulesChildTag.name + '</strong>' +
                '(' + childTag.length + ')</div>';

            // Si la balise enfant n'existe pas dans le DOM
            if (childTag.length <= 0) {

                // On incrémente le nombre de balise manquante
                tagsErrors++;
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

                var content = '<div class="ml-2"><strong>- Contenu:</strong> ' + limit(childTagText, 20) + '... </div>';

                if (seoRulesChildTag.maxLength) {

                    content += '<div class="' + ((childTagText.length > 0 && childTagText.length <= seoRulesChildTag.maxLength) ? 'ml-2 success' : 'ml-2 error') + '">- Longueur: ' + childTagText.length + '/' + seoRulesChildTag.maxLength + '</div>';
                }

                // Si 
                if (seoRulesChildTag.attributes) {

                    seoRulesChildTag.attributes.forEach(attribute => {

                        content += '<div class="ml-2 ' + (childTag[j].getAttribute(attribute) ? 'success' : 'error') + '">- ' + ((childTag[j].getAttribute(attribute) ? '✔' : '☓')) + ' <strong>' + attribute + ' ' + (childTag[j].getAttribute(attribute) ? ': ' + childTag[j].getAttribute(attribute) : '(manquant)') + '</strong></div>';

                        if (childTag[j].getAttribute(attribute) == null && childTag[j].getAttribute('charset') == null) {

                            attributesErrors++;
                        }
                    });
                }

                chilLi.innerHTML += content;
            }

            childUl.appendChild(chilLi);
        });
    }

    // On compte le nombre d'élément pour chaque balise
    tagsCount = tagsCount + tag.length;

    var tagsErrorsSpan = document.getElementsByClassName('tags-errors');

    if (tagsErrors > 0) {
        tagsErrorsSpan[0].setAttribute('style', 'display: flex;');
    }

    tagsErrorsSpan[0].innerText = (tagsErrors > 0) ? tagsErrors : "";
    tagsErrorsSpan[1].innerText = (tagsErrors > 0) ? tagsErrors + " balise(s) manquante(s)" : "";

    var attributesErrorsSpan = document.getElementsByClassName('attributes-errors');

    attributesErrorsSpan[0].innerText = (attributesErrors > 0) ? attributesErrors + " attribut(s) manquant(s)" : "";
});

// Au clic du bouton "#html5-checker-button"
seoCheckerButton.addEventListener('click', function () {

    // On affiche le panneau de la liste des balises
    seoChecker.setAttribute('class', 'open');
});

function limit(string = '', limit = 0) {
    return string.substring(0, limit)
}