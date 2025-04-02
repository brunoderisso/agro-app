class Strings {
    toCapitalize(str) {
        if (str) {
            const arr = str.split(" ");

            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
            }

            return arr.join(" ");
        }
    }

    mapUserNameSurname(user) {
        if (!user.name && !user.surname) {
            return "";
        } else if (!user.surname) {
            return user.name;
        } else if (!user.name) {
            return user.surname;
        } else {
            return user.name + " " + user.surname;
        }
    }

    getParameterByName(name, url = window.location.href) {
        name = name.replace(/[[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    slugURL(string) {
        return string.toLowerCase()
            .replace(/[àÀáÁâÂãäÄÅåª]+/g, 'a')       // Special Characters #1
            .replace(/[èÈéÉêÊëË]+/g, 'e')       	// Special Characters #2
            .replace(/[ìÌíÍîÎïÏ]+/g, 'i')       	// Special Characters #3
            .replace(/[òÒóÓôÔõÕöÖº]+/g, 'o')       	// Special Characters #4
            .replace(/[ùÙúÚûÛüÜ]+/g, 'u')       	// Special Characters #5
            .replace(/[ýÝÿŸ]+/g, 'y')       		// Special Characters #6
            .replace(/[ñÑ]+/g, 'n')       			// Special Characters #7
            .replace(/[çÇ]+/g, 'c')       			// Special Characters #8
            .replace(/[ß]+/g, 'ss')       			// Special Characters #9
            .replace(/[Ææ]+/g, 'ae')       			// Special Characters #10
            .replace(/[Øøœ]+/g, 'oe')       		// Special Characters #11
            .replace(/[%]+/g, 'pct')       			// Special Characters #12
            .replace(/[_]+/g, '-')       			// Special Characters #12
            .replace(/\s+/g, '-')           		// Replace spaces with -
            .replace(/[^\w-]+/g, '')       		    // Remove all non-word chars
            .replace(/--+/g, '-')         		    // Replace multiple - with single -
            .replace(/^-+/, '')             		// Trim - from start of text
            .replace(/-+$/, '');                    // Trim - from end of text
    }

    formatToHa(area) {
        if (!area) {
            return;
        }

        return `${area.toString().replace('.', ',')} ha`;
    }

    getStringWidth(text, font) {
        // Cria um elemento span fora da tela para medir a largura
        const span = document.createElement("span");
        span.style.position = "absolute";
        span.style.whiteSpace = "nowrap";
        span.style.font = font; // Aplica a fonte especificada
        span.innerText = text;
        document.body.appendChild(span);

        // Obtém a largura da string
        const width = span.offsetWidth;

        // Remove o elemento span
        document.body.removeChild(span);

        return width;
    }

    isStringWiderThanDiv(string, divId) {
        const div = document.getElementById(divId);

        if (div) {
            // Obter a largura da div
            const divWidth = div.offsetWidth;

            // Obter o estilo da fonte aplicada na div
            const font = window.getComputedStyle(div).font;

            // Obter a largura da string
            const stringWidth = this.getStringWidth(string, font);

            return stringWidth > divWidth;
        }
    }
}

const stringsUtils = new Strings();
export default stringsUtils;