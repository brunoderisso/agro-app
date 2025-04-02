import { EventEmitter } from "events";

class ACStore extends EventEmitter {

  constructor() {
    super();

    this.features = [];

    this.measuresList = [];
    this.measures = ["all"];

    this.devicesList = [];
    this.devices = [];

    this.functionList = [
      { value: "MEAN", label: "settings.functionLabelMEAN", description: "settings.functionDescriptionMEAN" },
      { value: "COUNT", label: "settings.functionLabelCOUNT", description: "settings.functionDescriptionCOUNT" },
      { value: "MEDIAN", label: "settings.functionLabelMEDIAN", description: "settings.functionDescriptionMEDIAN" },
      { value: "MODE", label: "settings.functionLabelMODE", description: "settings.functionDescriptionMODE" },
      { value: "SUM", label: "settings.functionLabelSUM", description: "settings.functionDescriptionSUM" },
      { value: "MAX", label: "settings.functionLabelMAX", description: "settings.functionDescriptionMAX" },
      { value: "MIN", label: "settings.functionLabelMIN", description: "settings.functionDescriptionMIN" },
      { value: "LAST", label: "settings.functionLabelLAST", description: "settings.functionDescriptionLAST" }
    ];
    this.function = "MEAN";

    this.refreshTime = 60;
  }

  setFeatures(features) {
    this.features = features;
    this.emit("change_features", features);
  }

  setFunction(func){
    this.function = func;
    this.emit("change_function");
  }

  setDevices(devices) {
    this.devicesList = devices;
  }

  setMeasures(measures) {
    this.measuresList = measures;
  }

  setTimeRefresh(time) {
    this.refreshTime = time;
    this.emit("change_refresh", time);
  }

  refresh() {
    this.emit("click_refresh");
  }

  getFeatures() {
    return this.features;
  }

  getFeaturesNames() {
    return Object.keys(this.features);
  }

  checkDevices(selectedDevices) {
    // Extrai os deveuis dos dispositivos da lista completa
    const allDeviceEuis = this.devicesList.map((device) => device.deveui);

    if (selectedDevices.length === allDeviceEuis.length) {
      // Se todos os dispositivos estão selecionados, define "all" internamente
      this.devices = ["all", ...allDeviceEuis];
    } else {
      // Caso contrário, apenas armazena os dispositivos selecionados ou vazio
      this.devices = selectedDevices;
    }

    this.emit("change_devices");
  }

  checkMeasure(measure) {
    // Extrai os nomes das medidas da lista de objetos measuresList
    const measureNames = this.measuresList.map((m) => m.name);

    if (measure === "all") {
      if (this.measures.includes("all")) {
        // Se "all" já está selecionado, desmarca todas as medidas
        this.measures = [];
      } else {
        // Marca "all" e todas as medidas individuais
        this.measures = ["all", ...measureNames];
      }
      this.emit("change_measure");
      return;
    }

    // Comportamento ao clicar em uma medida específica
    if (this.measures.includes("all")) {
      // Remove "all" e a medida específica, mantendo o restante marcado
      this.measures = measureNames.filter((m) => m !== measure);
    } else {
      if (this.measures.includes(measure)) {
        // Remove a medida se já estiver marcada
        this.measures = this.measures.filter((m) => m !== measure);
      } else {
        // Adiciona a medida ao array
        this.measures.push(measure);

        // Se todas as medidas forem marcadas individualmente, adiciona "all"
        if (this.measures.length === measureNames.length) {
          this.measures = ["all", ...measureNames];
        }
      }
    }

    this.emit("change_measure");
  }
}


const AdvancedConfigurationStore = new ACStore();
export default AdvancedConfigurationStore;
