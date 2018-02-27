export class DataAccessLayer {
    loadData(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.overrideMimeType('application/json');

            xhr.onload = () => {
                if (xhr.status === 200) {
                    this.fleetData = JSON.parse(xhr.responseText);
                    resolve();
                } else {
                    reject(xhr.statusText);
                }
            };

            xhr.open('GET', url, true);
            xhr.send();
        });
    }
}
