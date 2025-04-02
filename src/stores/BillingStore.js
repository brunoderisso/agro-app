import axios from "axios";
import { EventEmitter } from "events";

import { LocalConfig } from "../LocalConfig"
import { checkStatus, errorHandler, errorHandlerIgnoreNotFoundWithCallbackv2 } from "../helpers/helpers";
import errorHandlerWithCallback from '../helpers/errorHandler';
import SessionStore from '../stores/SessionStore';
import stringsUtils from '../utils/stringsUtils';

EventEmitter.EventEmitter.defaultMaxListeners = 0;


class BillingStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.props = props;
        this.plan = {};
        this.cart = {
            planId: "",
            customerId: "",
            payment: {},
            customerName: "",
            customer: {},
            success: false,
            total: 0,
        };
        this.paymentMeta = [{ id: "pix", label: "Pix" }, { id: "credit_card", label: "Cartão de Crédito" }];
        this.periodMeta = [{ id: "days", label: "Dias" }, { id: "months", label: "* cobrança mensal" }, { id: "years", label: "Anos" }];
        this.properties = [];
        this.HATAX = 1;
    };

    getPayable(id) {
        let label = this.paymentMeta.find((payment) => { return payment.id === id }).label || "";
        return label;
    }

    getPeriod(id) {
        let label = this.periodMeta.find((period) => { return period.id === id })?.label || "";
        return label;
    }

    setProperties(properties) {
        this.properties = properties;
    }

    getProperties() {
        return this.properties;
    }

    setTotal(valor) {
        this.cart = {
            ...this.cart,
            total: valor
        }
    }

    setDiscount(valor) {
        this.cart = {
            ...this.cart,
            discount: valor
        }
    }

    getCart() {
        return this.cart;
    }

    setPlanId(id) {
        this.cart = {
            ...this.cart,
            planId: id
        }
    }

    setHatax(value) {
        this.HATAX = value;
    }

    getHatax() {
        return this.HATAX;
    }

    setSuccess() {
        this.cart = {
            ...this.cart,
            success: true
        }
    }

    setPlanObjectId(id) {
        this.cart = {
            ...this.cart,
            planObjectId: id
        }
    }

    setPlanDetails(plan) {
        this.plan = plan;
    }

    getPlanDetails() {
        return this.plan;
    }

    setCustomer(customer) {
        this.cart = {
            ...this.cart,
            customer: customer
        }
    }

    setCustomerId(id) {
        this.cart = {
            ...this.cart,
            customerId: id
        }
    }

    setCustomerName(name) {
        this.cart = {
            ...this.cart,
            customerName: name
        }
    }

    setPayment(p) {
        this.cart = {
            ...this.cart,
            payment: p
        }
    }
    calculateDiscountValue(discount, total) {
        if (discount >= 0 && discount <= 1) { // Verifica se o percentual está no intervalo correto (entre 0 e 1).
            return total * discount;
        }

        return null;
    }

    createTokenIugu(creditCard, iugu, tokenResponseHandler) {
        const first_name = creditCard.full_name.split(" ")[0];
        const last_name = creditCard.full_name.split(" ")[creditCard.full_name.split(" ").length - 1];
        const mouth = creditCard.expiration.split("/")[0];
        const year = creditCard.expiration.split("/")[1];

        const cc = iugu.CreditCard(creditCard.number, mouth, year, first_name, last_name, creditCard.verification_value);

        iugu.createPaymentToken(cc, tokenResponseHandler);
    }

    getBrandCreditCard(n, iugu) {
        const number = n.replace(" ", "");

        if (iugu) {
            const brand = iugu.utils.getBrandByCreditCardNumber(number);
            return brand;
        }
        return false;
    }

    formatValidityDateCc(month, year) {
        let date = month?.length === 1 ? '0' + month : month;

        date += '/' + year?.substr(2, 3);

        return date;
    }

    getPlans(cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/plan/", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ data: responseData.data, id: cancelToken.id });
                    } else {
                        callbackFunc({ data: null, id: cancelToken.id });
                    }
                };
            })
            .catch(errorHandler);
    }

    getUserSubscriptions(cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/subscription/", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ data: responseData.data, id: cancelToken.id });
                    } else {
                        callbackFunc({ data: null, id: cancelToken.id });
                    }
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    postUserSubscription(cancelToken, id, action, callbackFunc) {
        // action = 'suspend' ou action = 'activate'
        let token = SessionStore.getToken();

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/subscription/" + id + "/" + action, {}, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ data: responseData.data, id: cancelToken.id });
                    } else {
                        callbackFunc({ data: null, id: cancelToken.id });
                    }
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getUserPayments(cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/payment_method/", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ data: responseData.data, id: cancelToken.id });
                    } else {
                        callbackFunc({ data: null, id: cancelToken.id });
                    }
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    updateUserPayment(payment, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/payment_method/" + payment.objectid, payment, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {

                    callbackFunc({ data: responseData.data, id: cancelToken.id });

                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    deleteUserPayment(id, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        this.axios = axios.delete(LocalConfig.apiURL + "/api/account/payment_method/" + id, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ data: responseData.data, id: cancelToken.id });
                    } else {
                        callbackFunc({ data: null, id: cancelToken.id });
                    }
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getCustomer(cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/customer", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ data: responseData.data, id: cancelToken.id });
                    } else {
                        callbackFunc({ data: null, id: cancelToken.id });
                    }
                };
            })
            .catch(errorHandlerIgnoreNotFoundWithCallbackv2(callbackFunc));
    }

    getPlan(planId, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/plan/" + planId, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ data: responseData.data, id: cancelToken.id });
                    } else {
                        callbackFunc({ data: null, id: cancelToken.id });
                    }
                };
            })
            .catch(errorHandlerIgnoreNotFoundWithCallbackv2(callbackFunc));
    }

    addCustomer(customer, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/customer", customer, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {

                    callbackFunc({ data: responseData.data, id: cancelToken.id });

                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    purchase(cart, cancelToken, callbackFunc) {
        const token = SessionStore.getToken();
        const subscription = {};

        subscription.plan_objectid = cart.planId;

        if (cart.couponId.length > 0) {
            subscription.coupon_objectid = cart.couponId;
        }

        subscription.environments = this.properties;

        subscription.subitems = [{
            description: "area",
            price_cents: cart.haTax * 100,
            quantity: Math.trunc(cart.area) // A Iugu aceita apenas inteiro para 'quantity'
        }]

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/subscription/", subscription, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {

                    callbackFunc({ data: responseData.data, id: cancelToken.id });

                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    setAsDefaultPayment(id, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/payment_method/" + id + "/set_default", {}, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });

                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    attCustomer(customer, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/customer", customer, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });

                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    findPlanHaTAX(plan) {
        if (!plan.subitems) {
            return this.HATAX;
        }

        const items = plan.subitems;
        const tax = this.findPlanWithArea(items);

        if (tax) {
            const price = tax.price_cents;

            return price / 100;
        } else {
            return this.HATAX;
        }
    }

    // Retorna plano que tiver a description 'area'
    findPlanWithArea(items) {
        if (items) {
            return items.find((item) => { return item.description === "area" });
        }

        return undefined;
    }

    setPaymentMethod(payment, description, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        let pay = {
            set_as_default: "true",
            token: payment.id,
            description: description || "Meu Cartão"
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/payment_method/", pay, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    searchCoupon(cancelToken, coupon, callbackFunc) {
        const token = SessionStore.getToken();
        const slugCoupon = stringsUtils.slugURL(coupon);

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/coupon/search/" + slugCoupon, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getListCoupons(cancelToken, pagination, callbackFunc) {
        const token = SessionStore.getToken();

        let params = '';

        if (pagination) {
            params = '?start=' + pagination.start + '&limit=' + pagination.limit;
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/coupon/" + params, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getInvoicesList(cancelToken, pagination, callbackFunc) {
        const token = SessionStore.getToken();

        let params = '';

        if (pagination) {
            params = '?start=' + pagination.start + '&limit=' + pagination.limit;
        }

        this.axios = axios.get(LocalConfig.apiURL + '/api/account/invoice/' + params, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

}

const BStore = new BillingStore();

export default BStore;
