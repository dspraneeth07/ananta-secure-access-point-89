
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        InfoWindow: any;
        LatLng: any;
        SymbolPath: {
          CIRCLE: any;
        };
        visualization: {
          HeatmapLayer: any;
        };
      };
    };
  }
}

export {};
