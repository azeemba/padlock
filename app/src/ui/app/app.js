(() => {

const Collection = padlock.data.Collection;
const Record = padlock.data.Record;
const LocalStorageSource = padlock.source.LocalStorageSource;
const EncryptedSource = padlock.source.EncryptedSource;

class App extends Polymer.Element {

    static get is() { return "pl-app"; }

    static get properties() { return {
        _currentView: {
            type: "string",
            value: "startView"
        },
        _selectedRecord: {
            type: Object,
            observer: "_selectedRecordChanged"
        }
    }; }

    constructor() {
        super();
        this.collection = new Collection();
        this.localSource = new EncryptedSource(new LocalStorageSource("default_coll"));
    }

    _closeRecord() {
        this.$.listView.deselect();
        this.$.pages.select("listView");
    }

    _newRecord() {
        const record = new Record();
        this.collection.add(record);
        this.notifyPath("collection.records");
        this.$.listView.select(record);
        this.$.recordView.edit();
    }

    _recordChange(e) {
        const record = e.detail.record;
        record.updated = new Date();
        this.save();
        this.notifyPath("collection.categories");
    }

    _deleteRecord(e) {
        e.detail.record.remove();
        this.save();
        this.notifyPath("collection.records");
        this._closeRecord();
    }

    _selectedRecordChanged() {
        if (this._selectedRecord) {
            this.$.pages.select("recordView");
        }
    }

    _unlocked() {
        this.notifyPath("collection.records");
        setTimeout(() => {
            this.$.pages.select("listView");
        }, 500);
    }

    lock() {
        this.collection.clear();
        this.localSource.password = "";
        this.$.startView.reset();
        this.$.pages.select("startView");
    }

    save() {
        this.collection.save(this.localSource);
    }

    openMainMenu() {
        this.$.mainMenu.open = true;
    }
}

window.customElements.define(App.is, App);

})();
