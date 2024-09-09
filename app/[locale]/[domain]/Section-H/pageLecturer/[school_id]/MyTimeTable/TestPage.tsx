'use client';
import { getDistanceBetweenTwoPoints } from '@/functions';
import React, { useEffect, useState } from 'react'


const TestPage = () => {

  const [distance, setDistance] = useState<any>();
  useEffect(() => {
    var mboppi = [4.041183194649856, 9.716262201667396]
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        var d = getDistanceBetweenTwoPoints(latitude, longitude, mboppi[0], mboppi[1])
        setDistance(d)
      })
    }
  }, []);

  return (
    <div>Distance {distance && distance.toLocaleString()} m </div>
  )
}

export default TestPage