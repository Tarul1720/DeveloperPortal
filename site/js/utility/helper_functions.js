if (typeof console === "undefined") {
    console = {};
    console.log = function () {
        return;
    }
}

var dpUtils = {
    preventSubmitIf: function (form, default_val, input_id) {
        // prevents submission of form if provided default value is still present in target input
        // form = form id to submit
        // default_val = value set in function call
        // input_id = input id to check default value of input
        // cdg 7/5/2011
        // example call: preventSubmit("#searchbox_protect", "Search catalog", "#SearchForm_SearchForm_Search");
        var form = document.querySelector('form');
        if (typeof (form) != 'undefined' && form != null) {
            form.submit(function () {
                if (input_id.val() === default_val) {
                    if ((!form + '.msgAlert').length > 0) {
                        form.append("<div class='msgAlert'>Enter a search value.</div>");
                    }
                }
            })
        }

    },
    clearField: function (form) {
        //Clears input fields with class text and textareas on click
        // form = form id
        // example call: clearField("#someform")
        var form = document.querySelector('form');
        var clear = document.querySelectorAll('input.text');
        if ((typeof (form) != 'undefined') && (form != null)) {
            for (var i = 0; i < clear.length; i++) {
                clear[i].defaultValue = clear[i].value;

                clear.addEventListener('click', function () {
                    if (clear.value == clear.defaultValue) {
                        clear.val('');
                    }
                });
                clear.blur(function () {
                    if (clear.value == '') {
                        clear.val(clear.defaultValue);
                    }
                })
            }
        };
    },

    queryString: function () {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = pair[1];
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], pair[1]];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(pair[1]);
            }
        }
        return query_string;
    }(),
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; path=/;" + expires;
    },
    getCookie: function (cname) {
        var lang = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(lang) == 0) return c.substring(lang.length, c.length);
        }
        return "";
    },
    getImages: function (n, arrayToFill) { // n is a Node

        var arrayToFill = arrayToFill || [];
        var domain = window.location.protocol + "//" + window.location.hostname + "/";
        var imgExtensions = ".jpe.jpeg.jpg.gif.tif.bmp.png.svg";
        var pathIgnoreMatch = [/theme\//, /site\/includes\//, /images\/dpcom\//, /images\/base\//];
        var domainChecker = new RegExp(window.location.protocol + "//" + window.location.hostname);
        var validDomain = true;
        var computeBackgroundImg = "";
        var originalImgPath = "";



        function validDomainChecker (path) {

            var isHttpDomain = path.substring(0, 5) === 'http:';
            var isHttpsDomain = path.substring(0, 6) === 'https:';

            if (isHttpDomain || isHttpsDomain) {
                return domainChecker.test(path);
            } else {
                return true;
            }

        }

        function validPathCheck (path) {

            var validPath = true;

            for (var i = 0; i < pathIgnoreMatch.length; i++) { // Loop through the children

                validPath = !pathIgnoreMatch[i].test(path);
                if (!validPath) {
                    break;
                }

            }

            return validPath;

        }

        if (n.nodeType == 1 /*Node.ELEMENT_NODE*/ ) {
            // Check if n is an Element
            if (n.getAttribute("src")) {

                originalImgPath = n.getAttribute("src");
                computeBackgroundImg = originalImgPath.substring(1);

                if (validPathCheck(computeBackgroundImg) && validDomainChecker(originalImgPath)) {
                    validBackgroundImg = imgExtensions.indexOf(computeBackgroundImg.substring(computeBackgroundImg.lastIndexOf("."))) > 0;

                    if (validBackgroundImg) {
                        arrayToFill.push(computeBackgroundImg);
                    }

                }

                // to do: filter out all but image src's
            }

            if (n.getAttribute("background")) {

                originalImgPath = n.getAttribute("background");
                computeBackgroundImg = originalImgPath.substring(1);

                if (validPathCheck(computeBackgroundImg) && validDomainChecker(originalImgPath)) {
                    validBackgroundImg = imgExtensions.indexOf(computeBackgroundImg.substring(computeBackgroundImg.lastIndexOf("."))) > 0;

                    if (validBackgroundImg) {
                        arrayToFill.push(computeBackgroundImg);
                    }

                }



            }

            if (document.all) {

                if (n.currentStyle.backgroundImage != "none") {

                    originalImgPath = n.currentStyle.backgroundImage;
                    computeBackgroundImg = originalImgPath.replace('url("', '').replace('")', '').replace(domain, '');

                    if (validPathCheck(computeBackgroundImg) && validDomainChecker(originalImgPath)) {

                        validBackgroundImg = imgExtensions.indexOf(computeBackgroundImg.substring(computeBackgroundImg.lastIndexOf("."))) > 0;

                        if (validBackgroundImg) {
                            arrayToFill.push(computeBackgroundImg);
                        }

                    }

                }

            } else if (document.defaultView.getComputedStyle(n, '').getPropertyValue("background-image") != "none") {

                originalImgPath = document.defaultView.getComputedStyle(n, '').getPropertyValue("background-image");
                computeBackgroundImg = originalImgPath.replace('url("', '').replace('")', '').replace(domain, '');

                if (validPathCheck(computeBackgroundImg) && validDomainChecker(originalImgPath)) {
                    validBackgroundImg = imgExtensions.indexOf(computeBackgroundImg.substring(computeBackgroundImg.lastIndexOf("."))) > 0;

                    if (validBackgroundImg) {
                        arrayToFill.push(computeBackgroundImg);
                    }

                }

            }

        }
        var children = n.childNodes; // Now get all children of n

        for (var i = 0; i < children.length; i++) { // Loop through the children
            this.getImages(children[i], arrayToFill); // Recurse on each one
        }

        return arrayToFill;

    }

}
