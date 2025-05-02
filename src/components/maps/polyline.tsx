import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useState, useEffect } from "react";

type PolylineCustomProps = {
  encodedPath?: string;
};

export type PolylineProps = google.maps.PolylineOptions & PolylineCustomProps;

export const Polyline = (props: PolylineProps) => {
  const { encodedPath, ...polylineOptions } = props;

  const map = useMap();
  const geometryLibrary = useMapsLibrary("geometry");
  const mapsLibrary = useMapsLibrary("maps");

  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!mapsLibrary) return;

    setPolyline(new mapsLibrary.Polyline());
  }, [mapsLibrary]);

  useEffect(() => {
    if (!polyline) return;

    polyline.setOptions(polylineOptions);
  }, [polyline, polylineOptions]);

  useEffect(() => {
    if (!encodedPath || !geometryLibrary || !polyline) return;

    polyline.setPath(geometryLibrary.encoding.decodePath(encodedPath));
  }, [polyline, encodedPath, geometryLibrary]);

  useEffect(() => {
    if (!map || !polyline) return;

    console.log("adding polyline to map");
    polyline.setMap(map);

    return () => polyline.setMap(null);
  }, [map, polyline]);

  return <></>;
};
