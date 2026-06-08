import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonCollection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    
    // Initialize file if it doesn't exist
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
    }
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error reading ${this.name}.json:`, err);
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Returns array of items matching the query object
  find(query = {}) {
    const data = this._read();
    if (Object.keys(query).length === 0) return data;
    
    return data.filter(item => {
      for (let key in query) {
        // Simple exact match logic
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  findOne(query) {
    const results = this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  create(doc) {
    const data = this._read();
    const newDoc = { 
      _id: Math.random().toString(36).substr(2, 9), 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc 
    };
    
    // Add save method mock for dbUser.save()
    newDoc.save = async function() {
      // Find and replace self in data array
      const currentData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${this.collectionName}.json`), 'utf-8'));
      const index = currentData.findIndex(d => d._id === this._id);
      if (index !== -1) {
        // remove the save method before stringifying
        const toSave = { ...this };
        delete toSave.save;
        delete toSave.collectionName;
        currentData[index] = toSave;
        fs.writeFileSync(path.join(DATA_DIR, `${this.collectionName}.json`), JSON.stringify(currentData, null, 2), 'utf-8');
      }
    };
    newDoc.collectionName = this.name;

    const toStore = { ...newDoc };
    delete toStore.save;
    delete toStore.collectionName;

    data.push(toStore);
    this._write(data);
    
    return newDoc;
  }

  update(id, updates) {
    const data = this._read();
    const index = data.findIndex(item => item._id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
      this._write(data);
      return data[index];
    }
    return null;
  }

  delete(id) {
    const data = this._read();
    const filtered = data.filter(item => item._id !== id);
    this._write(filtered);
    return true;
  }
}

const jsonStore = {
  users: new JsonCollection('users'),
  tasks: new JsonCollection('tasks'),
  projects: new JsonCollection('projects'),
  workspaces: new JsonCollection('workspaces'),
  reminders: new JsonCollection('reminders'),
};

// Add a helper so we can still mock dbUser.save() when using findOne
export function hydrateDoc(doc, collectionName) {
  if (!doc) return null;
  doc.save = async function() {
    const currentData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${collectionName}.json`), 'utf-8'));
    const index = currentData.findIndex(d => d._id === this._id);
    if (index !== -1) {
      const toSave = { ...this };
      delete toSave.save;
      currentData[index] = toSave;
      fs.writeFileSync(path.join(DATA_DIR, `${collectionName}.json`), JSON.stringify(currentData, null, 2), 'utf-8');
    }
  };
  return doc;
}

export default jsonStore;
