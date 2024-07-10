<template>
  <content>
    <MapButtons></MapButtons>

    <CircuitsSideBar :circuits="circuits" :isLoading="isLoading">
    </CircuitsSideBar>

    <MglMap
      class="mt-n1 ml-0 mb-n12"
      style="height: 94vh; width: 100vw"
      :accessToken="accessToken"
      :mapStyle="mapStyle"
      :pitch="pitch"
      :center="center"
      :zoom="zoom"
      :bearing="rotation"
      @load="onMapLoaded"
    >
      <MglNavigationControl position="bottom-right" />
      <MglGeolocateControl position="bottom-right" />

      <MglMarker
        v-for="(circuit, i) in mapCircuits"
        :key="i"
        :coordinates="[circuit.longitude, circuit.latitude]"
        color="blue"
      >
        <div slot="marker">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                style="background-color: green"
                :style="{
                  'background-color': circuit.online == 3 ? 'green' : 'red',
                }"
                outlined
                fab
                dark
                x-small
                color="blue-grey lighten-1"
                elevation="4"
              >
                <v-icon v-on="on" color="white">mdi-router-wireless</v-icon>
              </v-btn>
            </template>
            <span>{{ circuit.designacaoCliente }}</span>
          </v-tooltip>
        </div>
        <MglPopup
          :offset="16"
          :closeButton="false"
          :showed="showPopups[i].show"
        >
          <CircuitPopupCard :circuit="Object.assign({}, circuit)">
          </CircuitPopupCard>
        </MglPopup>
      </MglMarker>
    </MglMap>
  </content>
</template>

<script>
import MapButtons from "../components/MapButtons";
import Mapboxgl from "mapbox-gl";
import promisify from "map-promisified";
import CircuitsSideBar from "../components/CircuitsSideBar";
import CircuitPopupCard from "../components/cards/CircuitPopupCard";

import {
  MglMap,
  MglNavigationControl,
  MglGeolocateControl,
  MglMarker,
  MglPopup,
} from "vue-mapbox";

export default {
  components: {
    MapButtons,
    MglMap,
    MglNavigationControl,
    MglGeolocateControl,
    MglMarker,
    MglPopup,
    CircuitsSideBar,
    CircuitPopupCard,
  },
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoidGVsZXNwYXppbyIsImEiOiJjbGE2dncwc2owN2dlM3ZzMG9oMzFlenRxIn0.V9BortDXvy8b7aLA9lgCpQ",
      mapStyle: "mapbox://styles/mapbox/streets-v11",
      pitch: 60,
      center: [-43.244715266733785, -22.426041018417468],
      zoom: 11,
      rotation: 0,
      circuits: [],
      mapCircuits: [],
      actions: undefined,
      showPopups: [],
      searchText: undefined,
      contractNumber: undefined,
      isLoading: false,
      lastAppState: undefined,
      intervalId: undefined,
      routes: [],
    };
  },
  methods: {
    changeAngle() {
      this.pitch = this.pitch == 60 ? 0 : 60;
    },
    clearMap() {
      this.mapCircuits = [];

      for(var index in this.routes){
        this.mapbox.removeLayer(this.routes[index].circuit.nome);
        this.mapbox.removeSource(this.routes[index].circuit.nome);
      }

      this.routes = [];
    },
    showPopup(circuit) {
      this.loadDistinctDevicesToMap(circuit);

      for (var i in this.showPopups) {
        this.showPopups[i].show = false;
      }

      for (var index in this.showPopups) {
        if (this.showPopups[index].nome == circuit.nome) {
          this.showPopups[index].show = true;
        }
      }
    },
    async flyTo(circuit, speed) {
      if (!this.actions) return;
      await this.actions.flyTo({
        center: [circuit.longitude, circuit.latitude],
        speed: speed || 0.8,
        curve: 1,
      });
    },
    onMapLoaded(event) {
      this.mapbox = event.map;
      this.actions = promisify(event.map);

      event.map.on("zoomend", (e) => {
        this.$appState().mapZoom = e.target.getZoom();
      });

      event.map.on("pitchend", (e) => {
        this.$appState().mapPitch = e.target.getPitch();
      });

      event.map.on("dragend", (e) => {
        this.$appState().mapPosition = e.target.getCenter();
      });

      event.map.on("moveend", (e) => {
        this.$appState().mapPosition = e.target.getCenter();
      });

      event.map.on("rotateend", (e) => {
        this.$appState().mapRotation = e.target.getBearing();
      });
    },
    search() {
      this.isLoading = true;
      this.$get("/circuito/localizacao", {
        searchText: this.searchText || "",
        contractNumber: JSON.parse(window.sessionStorage.getItem("contract"))
          .numeroContratoTpz,
      }).then((response) => {
        if (!response) {
          return;
        }

        this.circuits = [];

        this.circuits = this.circuits.concat(response.data);
        this.loadDistinctDevicesToMap();
        this.isLoading = false;
      });
    },
    loadDistinctDevicesToMap(circuit) {
      if (circuit) {
        for (var i in this.mapCircuits) {
          if (circuit.nome == this.mapCircuits[i].nome) {
            hasItem = true;
            break;
          }
        }

        if (!hasItem) {
          this.mapCircuits.push(Object.assign({}, circuit));
        }

        this.showPopups = this.mapCircuits.map((m) => {
          return { nome: m.nome, show: false };
        });

        return;
      }

      for (var index in this.circuits) {
        var hasItem = false;
        for (var index2 in this.mapCircuits) {
          if (this.circuits[index].nome == this.mapCircuits[index2].nome) {
            hasItem = true;
            break;
          }
        }

        if (!hasItem) {
          this.mapCircuits.push(Object.assign({}, this.circuits[index]));
        }
      }

      this.showPopups = this.mapCircuits.map((m) => {
        return { nome: m.nome, show: false };
      });
    },
    loadMapPreferences() {
      this.$getUser().then((user) => {
        if (user.preferencias) {
          this.$appState().mapZoom = user.preferencias.zoomMapa || 11;
          this.$appState().mapRotation = user.preferencias.rotacaoMapa || 0;
          this.$appState().mapPitch = user.preferencias.anguloMapa;
          this.$appState().mapPosition = {
            lat: user.preferencias.latitudeMapa,
            lng: user.preferencias.longitudeMapa,
          };
          this.$appState().lastSearch = user.preferencias.ultimaBusca || "";
          this.$appState().mapStyle =
            user.preferencias.estiloMapa || "streets-v11";

          this.$root.$emit("change-mode", this.$appState().mapStyle);
          this.searchText = this.$appState().lastSearch;
          this.search();

          this.center = [
            user.preferencias.longitudeMapa,
            user.preferencias.latitudeMapa,
          ] || [-43.244715266733785, -22.426041018417468];
          this.zoom = this.$appState().mapZoom;
          this.rotation = this.$appState().mapRotation;
          this.pitch = this.$appState().mapPitch;
          this.rotation = this.$appState().mapRotation;
          this.$forceUpdate();
        } else {
          this.searchText = this.$appState().lastSearch || "";
          //this.search();
        }
      });
    },
    hasChangedState() {
      return (
        this.$appState().mapRotation != this.lastAppState.mapRotation ||
        this.$appState().mapZoom != this.lastAppState.mapZoom ||
        this.$appState().mapPitch != this.lastAppState.mapPitch ||
        this.$appState().lastSearch != this.lastAppState.lastSearch ||
        this.$appState().mapPosition != this.lastAppState.mapPosition ||
        this.$appState().mapStyle != this.lastAppState.mapStyle
      );
    },
    loadDistinctDeviceToList(device) {
      var hasItem = false;
      for (var index in this.circuits) {
        if (this.circuits[index].nome == device.nome) {
          hasItem = true;
          break;
        }
      }

      if (!hasItem) {
        this.circuits.push(device);
      }
    },
    diffBetween(number1, number2) {
      return number1 > number2 ? number1 - number2 : number2 - number1;
    },
  },
  created() {
    this.$root.$on("localizacao", (circuit) => {
      for (var index in this.circuits) {
        if (this.circuits[index].nome == circuit.designacaoTpz) {
          this.circuits[index].latitude = circuit.latitude;
          this.circuits[index].longitude = circuit.longitude;
          this.circuits[index].velocidade = circuit.velocidade;
        }
      }

      for (var index2 in this.mapCircuits) {
        if (this.mapCircuits[index2].nome == circuit.designacaoTpz) {
          var latitudeDiff =
            this.diffBetween(
              circuit.latitude,
              this.mapCircuits[index2].latitude
            ) / 1500;
          var longitudeDiff =
            this.diffBetween(
              circuit.longitude,
              this.mapCircuits[index2].longitude
            ) / 1500;

          if (latitudeDiff <= 0.001 && longitudeDiff <= 0.001) {
            return;
          }

          //Atualização e animação de movimento com duração de 1500ms (1.5 segs)
          var vm = this;
          for (var counter = 1; counter <= 1500; counter++) {
            setTimeout(function () {
              vm.mapCircuits[index2].latitude =
                vm.mapCircuits[index2].latitude + latitudeDiff;
              vm.mapCircuits[index2].longitude =
                vm.mapCircuits[index2].longitude + longitudeDiff;
            }, counter);
          }
        }
      }
    });

    this.$root.$on("status", (circuit) => {
      for (var index in this.circuits) {
        if (this.circuits[index].nome == circuit.designacaoTpz) {
          this.circuits[index].online = circuit.status;
        }
      }

      for (var index2 in this.mapCircuits) {
        if (this.mapCircuits[index2].nome == circuit.designacaoTpz) {
          this.mapCircuits[index2].online = circuit.status;
        }
      }

      this.$forceUpdate();
    });

    this.$root.$on("search", (searchText) => {
      this.searchText = searchText;
      this.search();
      this.$appState().lastSearch = searchText;
    });

    this.$root.$on("change-mode", (mode) => {
      this.mapStyle = !mode.includes("mapbox")
        ? "mapbox://styles/mapbox/" + mode
        : mode;

      this.$appState().mapStyle = mode;
    });

    this.isLoading = true;
    setTimeout(() => {
      if (window.sessionStorage.getItem("circuit")) {
        var circuit = JSON.parse(window.sessionStorage.getItem("circuit"));
        this.loadDistinctDevicesToMap(circuit);

        this.circuits.push(circuit);
        this.flyTo(circuit);
        this.showPopup(circuit);
        this.loadDistinctDeviceToList(circuit);
        window.sessionStorage.setItem("circuit", null);
        this.isLoading = false;
      }
    }, 2500);

    this.$root.$on("search", (searchText, contractNumber) => {
      this.searchText = searchText;
      this.contractNumber = contractNumber;
      this.search();
      this.$appState().lastSearch = searchText;
    });

    this.$root.$on("clear-map", () => {
      this.clearMap();
    });

    this.$root.$on("change-angle", () => {
      this.changeAngle();
    });

    this.$root.$on("show-popup", (device) => {
      this.showPopup(device);
    });

    this.$root.$on("fly-to", (device) => {
      this.flyTo(device);
    });

    this.$root.$on("online", (receivedMessage) => {
      for (var index in this.mapCircuits) {
        if (this.mapCircuits[index].nome == receivedMessage.nome) {
          this.mapCircuits[index].online = true;

          this.mapCircuits[index].ultimaAmostra = { date: {}, time: {} };

          var now = new Date();
          this.mapCircuits[index].ultimaAmostra.date.year = now.getFullYear();
          this.mapCircuits[index].ultimaAmostra.date.month = now.getMonth();
          this.mapCircuits[index].ultimaAmostra.date.day = now.getDate();
          this.mapCircuits[index].ultimaAmostra.time.hour = now.getHours();
          this.mapCircuits[index].ultimaAmostra.time.minute = now.getMinutes();
          this.mapCircuits[index].ultimaAmostra.time.second = now.getSeconds();

          this.$forceUpdate();
        }
      }
    });

    this.$root.$on("offline", (receivedMessage) => {
      for (var index in this.mapCircuits) {
        if (this.mapCircuits[index].nome == receivedMessage.nome) {
          this.mapCircuits[index].online = false;
        }
      }
    });

    this.$root.$on("remove-route", (route) => {
      this.mapbox.removeLayer(route.circuit.nome);
      this.mapbox.removeSource(route.circuit.nome);

      this.routes = this.routes.filter(el => el.circuit.nome !== route.circuit.nome);
    });

    this.$root.$on("show-route", (route) => {

      this.routes.push(route);
      var coordinates = route.coordinates;

      this.mapbox.addSource(route.circuit.nome, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      });

      this.mapbox.addLayer({
        id: route.circuit.nome,
        type: "line",
        source: route.circuit.nome,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#76FF03",
          "line-width": 8,
        },
      });

      // Create a 'LngLatBounds' with both corners at the first coordinate.
      const bounds = new Mapboxgl.LngLatBounds(
        [-122.483696, 37.833818],
        [-122.483696, 37.833818]
      );

      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      for (const coord of coordinates) {
        bounds.extend(coord);
      }

      this.mapbox.fitBounds(bounds, {
        padding: 60,
      });
    });

    this.intervalId = setInterval(() => {
      if (!this.lastAppState || this.hasChangedState()) {
        //this.$saveAppState();
        this.lastAppState = Object.assign({}, this.$appState());
      }
    }, 60000);

    window.sessionStorage.setItem("intervalId", this.intervalId);
  },
  beforeMount() {
    window.addEventListener("beforeunload", async () => {
      clearInterval(this.intervalId);
      //await this.$saveAppState();
    });
  },
};
</script>
<style>
.v-btn.v-btn--outlined {
  border-width: 2px;
  border-color: white;
}
.v-navigation-drawer {
  background-color: transparent;
}
.list-enter,
.list-leave-to {
  opacity: 0;
}
.list-enter-active,
.list-leave-active {
  transition: opacity 0.5s ease;
}
.list-move {
  transition: transform 0.5s ease-out;
}
.mapboxgl-popup-content {
  padding: 0px 0px 12px;
  margin-left: -0.6rem;
  background: #fff0 !important;
}
.mapboxgl-ctrl {
  z-index: 2;
}
</style>