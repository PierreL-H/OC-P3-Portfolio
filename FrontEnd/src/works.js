
// create Work class
export class Work {
  constructor (jsonData) {
    jsonData && Object.assign(this, jsonData);
  }
}

