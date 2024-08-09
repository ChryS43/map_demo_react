// MapComponent.js
import { useEffect, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import './Map.css';
import MapButtons from './MapButtons';
import Control from 'ol/control/Control';
import { Draw } from 'ol/interaction';
import { createRoot } from 'react-dom/client';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { getCenter } from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';


function MapComponent() {
    const [savedMap, setSavedMap] = useState<Map | null>(null);
    const [draw, setDraw] = useState<Draw | null>(null);
    const [vectorSource] = useState(new VectorSource());
    
    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        const map = new Map({
            target: "map",
            layers: [osmLayer, vectorLayer],
            view: new View({
                center: [0, 0],
                zoom: 0,
              }),
          });

      setSavedMap(map);

      return () => map.setTarget(undefined)
    }, [vectorSource]);

    useEffect(() => {
        if (savedMap) {

            const parentElement = document.createElement('div');
            const parentRoot = createRoot(parentElement);
            parentRoot.render(<MapButtons onAddDraw={addDrawInteraction} onUpload={uploadGeoJSON} onRemoveFeatures={removeDrawnFeatures}  map={savedMap} />);

            const controls = new Control({
                element: parentElement,
            });

            savedMap?.addControl(controls);
        }
    }, [savedMap]);

    const uploadGeoJSON = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.geojson';
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const contents = e?.target?.result as string;
                    const features = new GeoJSON().readFeatures(contents, {
                        featureProjection: savedMap?.getView().getProjection(),
                    });
                    vectorSource.addFeatures(features);

                    // Calcola l'estensione totale delle feature caricate
                    const extent = vectorSource.getExtent();
                    const center = getCenter(extent);

                    // Esegui lo zoom al centro delle feature caricate
                    savedMap?.getView().animate({
                        center: center,
                        zoom: 6,  // Regola questo valore per il livello di zoom desiderato
                        duration: 1000, // Durata dell'animazione in millisecondi
                    });
                };
                reader.readAsText(file);
            }
        };

        input.click();
    };
    

    const addDrawInteraction = () => {
        if (savedMap) {
            const drawInteraction = new Draw({
                source: vectorSource,
                type: 'Polygon',
            });

            // Aggiunge l'interazione di disegno
            savedMap.addInteraction(drawInteraction);
            setDraw(drawInteraction);

            // Quando una feature è finita di disegnare
            drawInteraction.on('drawend', (event) => {
                const feature = event.feature;
                const extent = feature?.getGeometry()?.getExtent();
                if(extent) {
                    const center = getCenter(extent);
                    savedMap.getView().animate({
                        center: center,
                        zoom: 8,  
                        duration: 500, 
                    });
                }

            });
        }
    };

    // Funzione per rimuovere le features disegnate
    const removeDrawnFeatures = () => {
        vectorSource.clear();
        if (draw && savedMap) {
            savedMap.removeInteraction(draw);
            setDraw(null);
        }
    };


    return (
      <div id="map" className="map-container" >
        
      </div>
    );
}

export default MapComponent;