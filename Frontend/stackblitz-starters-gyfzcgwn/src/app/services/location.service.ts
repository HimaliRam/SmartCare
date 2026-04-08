import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    getUserLocation(): Promise<any> {
        return new Promise((resolve, reject) => {

            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                error => reject(error)
            );

        });
    }

}