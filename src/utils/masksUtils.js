import toolsUtils from "./toolsUtils"


class Masks {
    unMaskPhone(phone) {
        return phone.replace("(", "").replace(")", "").replace("-", "").replaceAll("_", "").replaceAll(" ", "");
    }

    maskCpfCnpj(doc) {
        if (doc.length === 11 && toolsUtils.isCpf(doc)) {
            return '999.999.999-99';
        }

        if (doc.length >= 11 && !toolsUtils.isCpf(doc)) {
            return '99.999.999/9999-99';
        }

        if (doc.length < 11) {
            return '99999999999';
        }
    }

    unMaskCpfCnpj(doc) {
        return doc.replaceAll(".", "").replaceAll("-", "").replaceAll("/", "").replaceAll("_", "");
    }

    formatCpfCnpj(doc) {
        if (doc.length === 11 && toolsUtils.isCpf(doc)) {
            return doc.substring(0, 3) + '.' + doc.substring(3, 6) + '.' + doc.substring(6, 9) + '-' + doc.substring(9);
        }

        if (doc.length >= 11 && !toolsUtils.isCpf(doc)) {
            return doc.substring(0, 2)
                + '.' + doc.substring(2, 5)
                + '.' + doc.substring(5, 8)
                + '/' + doc.substring(8, 12)
                + '-' + doc.substring(12);
        }
    }

    maskPhone(phone) {
        if ((phone[5] && phone[5] === '9') || (phone.length === 12 && phone[3] === '9')) {
            return '(99) 99999-9999';
        } else {
            return '(99) 9999-9999';
        }
    }

    formatPhone(phone, ddi = null) {
        if (ddi === null || ddi === "55") {
            if (phone.length === 11) {
                return (ddi ? "+" + ddi + " " : "") +
                    "(" + phone.substring(0, 2) + ") " + phone.substring(2, 7) + "-" + phone.substring(7);
            } else {
                return (ddi ? "+" + ddi + " " : "") +
                    "(" + phone.substring(0, 2) + ") " + phone.substring(2, 6) + "-" + phone.substring(6);
            }
        } else if (ddi === "54") {
            return "+" + ddi + " (" + phone.substring(0, 3) + ") " + phone.substring(3, 6) + "-" + phone.substring(6);
        } else if (ddi === "591") {
            return "+" + ddi + " " + phone.substring(0, 1) + "-" + phone.substring(1, 4) + "-" + phone.substring(4);
        } else if (ddi === "595") {
            return "+" + ddi + " (" + phone.substring(0, 3) + ") " + phone.substring(3, 6) + "-" + phone.substring(6);
        }

        return "";
    }

    formatZipCode(zipCode) {
        return zipCode.substring(0, 5) + '-' + zipCode.substring(5);
    }

    formatProducerRegistration(string) {
        return string.substring(0, 3) + '.' + string.substring(3, 6) + '.' + string.substring(6, 9) + '.' +
            string.substring(9, 12) + '-' + string.substring(12);
    }

    currencyFormat(num) {
        if (!num)
            return;

        return `${'R$ ' + num.toFixed(2).replace('.', ',')}`;
    }

    currencyFormatToReal(num) {
        return `${'R$ ' + (num / 100).toFixed(2).replace('.', ',')}`;
    }

    percentageNumberFormat(num) {
        return `${num * 100}%`;
    }
}

const masksUtils = new Masks();
export default masksUtils;