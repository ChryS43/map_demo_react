// MapComponent.js
import { createRef, useEffect, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import './Map.css';
import MapButtons from './MapButtons';
import Control from 'ol/control/Control';
import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';

function MapComponent() {
    const [savedMap, setSavedMap] = useState<Map | null>(null);

    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })

        const map = new Map({
            target: "map",
            layers: [osmLayer],
            view: new View({
                center: [0, 0],
                zoom: 0,
              }),
          });

      setSavedMap(map);

      return () => map.setTarget(undefined)
    }, []);

    useEffect(() => {
        if (savedMap) {

            const parentElement = document.createElement('div');
            const parentRoot = createRoot(parentElement);
            parentRoot.render(<MapButtons map={savedMap} />);

            const controls = new Control({
                element: parentElement,
            });

            savedMap?.addControl(controls);
        }
    }, [savedMap]);


    return (
      <div id="map" className="map-container" >
        
      </div>
    );
}

export default MapComponent;