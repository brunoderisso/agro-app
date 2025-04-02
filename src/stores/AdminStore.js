import { EventEmitter } from "events";
import axios from "axios";

import sessionStore from "./SessionStore";
import { LocalConfig } from "../LocalConfig";

// Store para rodar scripts por fora da aplicação
class AdminStore extends EventEmitter {
  constructor(props) {
    super(props);

    this.props = props;
  }

  addComponentLabelLanguage(cancelToken, componentId, body) {
    const token = sessionStore.getToken();

    if (token === null) {
      return;
    }

    const promises = [];

    body.forEach(element => {
      this.axios = axios.post(LocalConfig.apiURL + "/api/admin/component/" + componentId + "/label/", element, {
        cancelToken: cancelToken.token.token.token,
        headers: {
          "Content-Type": "text/plain",
          "Authorization": "Bearer " + token,
        }
      });
      promises.push(this.axios);
    });

    Promise.all(promises);
  }

  addCrop(cancelToken, body) {
    const token = sessionStore.getToken();

    if (token === null) {
      return;
    }

    const promises = [];

    body.forEach(element => {
      this.axios = axios.post(LocalConfig.apiURL + "/api/crop/", element, {
        cancelToken: cancelToken.token.token.token,
        headers: {
          "Content-Type": "text/plain",
          "Authorization": "Bearer " + token,
        }
      });
      promises.push(this.axios);
    });

    Promise.all(promises);
  }

  // Exemplo de uso
  onClickDisease = () => {
    // IDs das doenças
    const diseaseIds = [
      "cd7dvh99jvb3hme88aq0", // Antracnose
      "cd7dsnp9jvb3hme88ap0", // Ferrugem branca
      "cd7beu99jvb3ha15lup0", // Ferrugem comum
      "cd7dudh9jvb3hme88apg"  // Ferrugem poli
    ];

    // IDs dos cultivos
    const cropIds = [
      "csn5ctec3uks73c0bu5g",
      "csn5ctec3uks73c0bu4g",
      "csn5ctec3uks73c0bu60",
      "csn5ctec3uks73c0bu6g",
      "csn5ct6c3uks73c0bu40",
      "csn5ctmc3uks73c0bu70",
      "cmfcqtec3uks73checj0",
      "ccdo1o4qmuqjdui50rs0",
      "csn5ct6c3uks73c0bu30",
      "csn5ct6c3uks73c0bu1g",
      "csn5ct6c3uks73c0bu2g",
      "csn5ct6c3uks73c0bu3g",
      "csn5ct6c3uks73c0bu20",
      "csn5ctec3uks73c0bu50"
    ];

    this.associateDiseasesWithCrops(cropIds, diseaseIds, (results) => {
      if (results) {
        console.log("Associação completa:", results);
      } else {
        console.log("Falha na associação.");
      }
    });
  }

  //#######################
  associateDiseasesWithCrops(cropIds, diseaseIds, callBackFunc) {

    const token = this.getToken();

    if (token === null) {
      return
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    };

    // Função para associar uma única doença a um cultivo
    const associateDisease = async (cropId, diseaseId) => {
      try {
        const response = await axios.post(
          `${LocalConfig.apiURL}/api/admin/crop/${cropId}/disease/`,
          {
            cropobjectid: cropId,
            diseaseobjectid: diseaseId,
          },
          { headers }
        );
        return response.data;
      } catch (error) {
        console.error(`Error associating disease ${diseaseId} with crop ${cropId}:`, error);
        return null;
      }
    };

    // Função para associar todas as doenças a todos os cultivos
    const associateAllDiseases = async () => {
      const results = [];

      for (const cropId of cropIds) {
        for (const diseaseId of diseaseIds) {
          const result = await associateDisease(cropId, diseaseId);
          if (result) {
            results.push(result);
          }
        }
      }

      return results;
    };

    // Executa a associação e chama o callback com os resultados
    associateAllDiseases()
      .then((results) => callBackFunc(results))
      .catch((error) => console.error("Error associating diseases with crops:", error));
  }
}

const adminStore = new AdminStore();

export default adminStore;