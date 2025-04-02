import { EventEmitter } from "events";


EventEmitter.EventEmitter.defaultMaxListeners = 0;


class GraphicsStore extends EventEmitter {

    constructor() {
        super();

        this.sizes = [];

    }


    add(name) {
        if(this.find(name) !== null){
            return false;
        }
        if (name !== null && name!=="") {
            this.sizes.push({name, height: 0, width: 0});
            return true;
        }
        return false;
    }

    find(name) {
        for(let i = 0; i < this.sizes.length ; i++){
            if(this.sizes[i].name === name){
                return this.sizes[i];
            }
        }
        return null;
    }

    update(size) {
        if(size === null || size === undefined){
            return false;
        }

        for (let i = 0; i < this.sizes.length; i++) {
            if (size.name === this.sizes[i].name) {
                this.sizes[i] = size;
                return true
            }
        }
        return false;
    }

    getSizesById(document, component) {
        let c = document.getElementById(component);
        if(c === null){
            return null;
        }
        let width = c.offsetWidth;
        let height = c.offsetHeight;

        var style = c.currentStyle || window.getComputedStyle(c);
    
        width = width - parseInt(style.marginLeft) - parseInt(style.marginRight) ;
        height = height - parseInt(style.marginTop) - parseInt(style.marginBottom) - parseInt(style.paddingBottom) - parseInt(style.paddingTop) -5 ;

        return {name: component, width, height};
    }

    clear(name){
        for(let i = 0 ; i < this.sizes.length ; i++){
            if(this.sizes[i].name === name){
                this.sizes.splice(i, 1);
                return true;
            }
        }
        return false;
    }


}

const graphicsStore = new GraphicsStore();

export default graphicsStore;
